import React, { useState } from "react";
import { startCases, startMoney } from "../domain/Start";
import Cases from "./Cases";
import "./Game.css";
import MoneyOptions from "./MoneyOptions";
import _ from "lodash";
import Linda from "./Linda";
import DeaLQuestion from "./DealNoDeal";
import { formatMoney } from "../domain/Money";
import { messageKeys } from "./linda/LindaMessage";

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
    meanAverageSplit: multiplier[i] || max,
  };
});

const Game: React.FC<{}> = () => {
  const [msg, setMsg] = useState<messageKeys[]>(["start"]);
  const [allMoney] = useState(startMoney());
  const [allCases] = useState(startCases().reverse());
  const [mapping, setMapping] = useState(shuffleCases(allCases, allMoney));
  const [moneyLeft, setMoney] = useState(new Set(startMoney()));
  const [cases, setCases] = useState(new Set(startCases()));
  const [mine, setMine] = useState<number | undefined>();
  const [moment, setMoment] = useState(momentList[0]);
  const [lastAmount, setLastAmount] = useState(0);
  const [bank, setBank] = useState(0);
  const [showBank, setShowBank] = useState(false);

  const pickMoney = (num: number) => {
    const arr = Array.from(moneyLeft).filter((v) => v !== num);
    setMoney(new Set(arr));
  };

  const pickCase = (num: number) => {
    const arr = Array.from(cases).filter((v) => v !== num);
    setCases(new Set(arr));
  };

  const resetGame = () => {
    setMoney(new Set(startMoney()));
    setCases(new Set(startCases()));
    setMapping(shuffleCases(allCases, allMoney));
    setMoment(momentList[0]);
    setShowBank(false);
    setBank(0);
    setMsg(["start"]);
  };

  const caseValueMessage = (amountInCase: number): messageKeys => {
    if (amountInCase > allMoney[22]) {
      return "expensive";
    } else if (amountInCase < allMoney[6]) {
      return "cheap";
    }
    return "regular";
  };

  const bankMoment = (amountInCase: number) => {
    const sortedMoneyLeft = Array.from(moneyLeft)
      .filter((n) => n !== amountInCase)
      .sort((a, b) => a - b);
    // total pot
    const pot = sortedMoneyLeft.reduce((mem, amount) => mem + amount, 0);
    // average (is way to high early game)
    const average = pot / moneyLeft.size;

    const meanIndex = Math.floor(moneyLeft.size / 2);
    // the mean is a boring round numbers
    const mean = sortedMoneyLeft[meanIndex];

    const diff = average - mean;
    // so pick a amount between the mean and average bases on a meanAverageSplit constant
    const bank = mean + diff * moment.meanAverageSplit;
    setBank(bank);
    setTimeout(() => {
      setMsg(["bankResult"]);
      setShowBank(true);
    }, 4500);
  };

  const handleClickCase = (num: number) => {
    if (bank) return;
    pickCase(num);
    if (!mine) {
      // first pick you're own case
      setMine(num);
      setMsg(["first6"]);
      return;
    }
    const myAmount = mine && (mapping.get(mine) as number);
    const amountInCase = mapping.get(num);
    if (!amountInCase || !myAmount) return;

    const caseVal = caseValueMessage(amountInCase);
    setLastAmount(amountInCase);
    pickMoney(amountInCase);

    if (cases.size === 1) {
      // picked all cases, end game
      setBank(myAmount);
      setMsg(["end"]);
    } else if (cases.size - 1 === moment.num) {
      // Bank moment
      setMsg([caseVal, "bank"]);
      bankMoment(amountInCase);
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
          <DeaLQuestion handleResponse={handleDealResponse} showBank={showBank}>
            {formatMoney(bank)}
          </DeaLQuestion>
          <div>
            <Cases
              allCases={allCases}
              cases={cases}
              pickCase={handleClickCase}
            />
            <div className="reset" onClick={resetGame}>
              Reset
            </div>
          </div>
        </div>
      </MoneyOptions>
    </div>
  );
};

export default Game;
