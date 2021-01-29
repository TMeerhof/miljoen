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

const zipCases = (amounts: number[], cases: number[]) => {
  const shuffleCase = _.zip(_.shuffle(amounts), _.shuffle(cases));
  const map = new Map(shuffleCase);
  return map;
};

const caseOrder = [1, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1];
let cases = startCases().length;
const momentList = caseOrder.map((num, i) => {
  cases -= num;
  return {
    num: cases,
  };
});

const Game: React.FC<{}> = () => {
  const [msg, setMsg] = useState<messageKeys>("start");
  const [allMoney] = useState(startMoney());
  const [allCases] = useState(startCases().reverse());
  const [mapping] = useState(zipCases(allCases, allMoney));
  const [moneyLeft, setMoney] = useState(new Set(startMoney()));
  const [cases, setCases] = useState(new Set(startCases()));
  const [mine, setMine] = useState<number | undefined>();
  const [moment, setMoment] = useState(momentList[1]);
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

  const startCase = (num: number) => {
    setMine(num);
    setMsg("first6");
    setMoment(momentList[1]);
  };

  const handleClickCase = (num: number) => {
    if (bank) return;
    pickCase(num);
    if (!mine) {
      startCase(num);
      return;
    }
    const amountInCase = mapping.get(num);
    if (!amountInCase) return;
    setLastamount(amountInCase);
    pickMoney(amountInCase);
    if (cases.size - 1 === moment.num) {
      setMsg("bank");
      const pot = Array.from(moneyLeft).reduce(
        (mem, amount) => mem + amount,
        0
      );
      const average = pot / moneyLeft.size;
      setBank(average);
      setTimeout(() => {
        setMsg("bankResult");
        playSiren();
        setShowBank(true);
      }, 4000);
      return;
    }
    if (amountInCase > allMoney[22]) {
      setMsg("expensive");
    } else if (amountInCase < allMoney[6]) {
      setMsg("cheap");
    } else {
      setMsg("regular");
    }
  };

  const handleDealResponce = (answer: boolean) => {
    console.log("Deal", answer);
  };

  return (
    <div className="game">
      <MoneyOptions startMoney={allMoney} money={moneyLeft}>
        <div className="mid">
          <Linda
            msg={msg}
            casesToOpen={cases.size - moment.num}
            bank={bank}
            lastAmount={lastAmount}
          />
          {showBank && (
            <DeaLQuestion handleResponce={handleDealResponce}>
              {formatMoney(bank)}
            </DeaLQuestion>
          )}
          <Cases allCases={allCases} cases={cases} pickCase={handleClickCase} />
        </div>
      </MoneyOptions>
    </div>
  );
};

export default Game;
