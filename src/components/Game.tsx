import React, { useRef, useState } from "react";
import { startCases, startMoney } from "../domain/Start";
import Cases from "./Cases";
import "./Game.css";
import MoneyOptions from "./MoneyOptions";
import Screen from "./Screen";
import _ from "lodash";
import Linda from "./Linda";

const zipCases = (amounts: number[], cases: number[]) => {
  const shuffleCase = _.zip(_.shuffle(amounts), _.shuffle(cases));
  const map = new Map(shuffleCase);
  return map;
};

const Game: React.FC<{}> = () => {
  const [allMoney] = useState(startMoney());
  const [allCases] = useState(startCases().reverse());
  const [mapping] = useState(zipCases(allCases, allMoney));

  const [money, setMoney] = useState(new Set(startMoney()));
  const [cases, setCases] = useState(new Set(startCases()));

  const pickMoney = (num: number) => {
    const arr = Array.from(money).filter((v) => v !== num);
    console.log(arr);
    setMoney(new Set(arr));
  };

  const pickCase = (num: number) => {
    const arr = Array.from(cases).filter((v) => v !== num);
    setCases(new Set(arr));
  };

  const handleClickCase = (num: number) => {
    pickCase(num);
    const money = mapping.get(num);
    if (!money) return;
    pickMoney(money);
  };

  return (
    <div className="game">
      <MoneyOptions startMoney={allMoney} money={money}>
        <div className="mid">
          {/* <Screen msg={"kies een koffer"}></Screen> */}
          <Linda msg={"kies een koffer"} />
          <Cases allCases={allCases} cases={cases} pickCase={handleClickCase} />
        </div>
      </MoneyOptions>
    </div>
  );
};

export default Game;
