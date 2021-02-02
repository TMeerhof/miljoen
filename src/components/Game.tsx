import React, { useState } from "react";
import { startCases, startMoney } from "../domain/Start";
import Cases from "./Cases";
import "./Game.css";
import MoneyOptions from "./MoneyOptions";
import _ from "lodash";
import Linda from "./Linda";
import DeaLQuestion from "./DealNoDeal";
import { formatMoney } from "../domain/Money";
import useSound from "use-sound";
import { messageKeys } from "./linda/LindaMessage";
const siren = require("./siren.mp3");

const shuffleCases = (amounts: number[], cases: number[]) => {
  const shuffleCase = _.zip(_.shuffle(amounts), _.shuffle(cases)) as [
    number,
    number
  ][];
  const map = new Map(shuffleCase);
  return map;
};

// const caseOrder = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
// const multiplier = [0.05, 0.15, 0.3, 0.6];
const caseOrder = [6, 5, 4, 3, 2, 1, 1, 1, 1, 1];
const multiplier = [0.05, 0.15, 0.3, 0.6];
const max = Math.max(...multiplier);
let cases = startCases().length - 1; // player case
const momentList = caseOrder.map((num, i) => {
  cases -= num;
  return {
    index: i,
    num: cases,
    multiplier: multiplier[i] || max,
  };
});

console.log(momentList);

const Game: React.FC<{}> = () => {
  const [msg, setMsg] = useState<messageKeys[]>(["start"]);
  const [allMoney] = useState(startMoney());
  const [allCases] = useState(startCases().reverse());
  const [mapping, setMapping] = useState(shuffleCases(allCases, allMoney));
  const [moneyLeft, setMoney] = useState(new Set(startMoney()));
  const [cases, setCases] = useState(new Set(startCases()));
  const [mine, setMine] = useState<number | undefined>();
  const [moment, setMoment] = useState(momentList[0]);
  const [lastAmount, setLastamount] = useState(0);
  const [bank, setBank] = useState(0);
  const [showBank, setShowBank] = useState(false);
  const [playSiren] = useSound(siren.default);

  const pickMoney = (num: number) => {
    const arr = Array.from(moneyLeft).filter((v) => v !== num);
    console.log(arr);
    setMoney(new Set(arr));
  };

  const pickCase = (num: number) => {
    const arr = Array.from(cases).filter((v) => v !== num);
    setCases(new Set(arr));
  };

  const initGame = () => {
    setMoney(new Set(startMoney()));
    setCases(new Set(startCases()));
    setMapping(shuffleCases(allCases, allMoney));
    setMoment(momentList[0]);
    setShowBank(false);
    setBank(0);
    setMsg(["start"]);
  };

  const startCase = (num: number) => {
    setMine(num);
    setMsg(["first6"]);
  };

  const handleClickCase = (num: number) => {
    if (bank) return;
    pickCase(num);
    if (!mine) {
      startCase(num);
      return;
    }
    const myAmount = mine && (mapping.get(mine) as number);
    const amountInCase = mapping.get(num);
    if (!amountInCase || !myAmount) return;

    let caseVal: messageKeys;
    if (amountInCase > allMoney[22]) {
      caseVal = "expensive";
    } else if (amountInCase < allMoney[6]) {
      caseVal = "cheap";
    } else {
      caseVal = "regular";
    }

    setLastamount(amountInCase);
    pickMoney(amountInCase);
    if (cases.size === 1) {
      setBank(myAmount);
      setMsg(["end"]);
    } else if (cases.size - 1 === moment.num) {
      setMsg([caseVal, "bank"]);
      const left = Array.from(moneyLeft)
        .filter((n) => n !== num)
        .sort((a, b) => a - b);
      const pot = left.reduce((mem, amount) => mem + amount, 0);
      const average = pot / moneyLeft.size;
      const meanIndex = Math.floor(moneyLeft.size / 2);
      const mean = left[meanIndex];
      const diff = average - mean;
      const bank = mean + diff * moment.multiplier;
      console.log({ mean, average, meanIndex, left, moment, diff });
      setBank(bank);
      setTimeout(() => {
        setMsg(["bankResult"]);
        playSiren();
        setShowBank(true);
      }, 4000);
    } else {
      setMsg([caseVal, "continue"]);
    }
  };

  const handleDealResponse = (answer: boolean) => {
    console.log("Deal", answer);
    if (answer) {
      setMsg(["deal", "checkOwn"]);
      setTimeout(() => {
        setMsg(["showOwn"]);
      }, 4000);
    } else {
      setMsg(["noDeal"]);
      setBank(0);
      setShowBank(false);
      setMoment(momentList[moment.index + 1]);
    }
  };

  return (
    <div className="game">
      <div className="backdrop" />
      <MoneyOptions startMoney={allMoney} money={moneyLeft}>
        <div className="mid">
          <Linda
            msg={msg}
            casesToOpen={cases.size - moment.num}
            bank={bank}
            lastAmount={lastAmount}
            mine={mine && mapping.get(mine)}
          />
          <DeaLQuestion handleResponce={handleDealResponse} showBank={showBank}>
            {formatMoney(bank)}
          </DeaLQuestion>
          <div>
            <Cases
              allCases={allCases}
              cases={cases}
              pickCase={handleClickCase}
            />
            <div className="reset" onClick={initGame}>
              Reset
            </div>
          </div>
        </div>
      </MoneyOptions>
    </div>
  );
};

export default Game;
