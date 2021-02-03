import React, { useCallback, useRef, useState } from 'react';
import { startCases, startMoney } from '../domain/Start';
import Cases from './Cases';
import './Game.css';
import MoneyOptions from './MoneyOptions';
import _ from 'lodash';
import Linda from './Linda';
import DeaLQuestion from './DealNoDeal';
import { formatMoney } from '../domain/Money';
import { messageKeys } from './linda/LindaMessage';

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

const allMoney = startMoney();
const allCases = startCases().reverse();
// out of reacts scope to prevent console pirates getting it to easy
let mapping = shuffleCases(allCases, allMoney);
let showMine = false;

const Game: React.FC<{}> = () => {
  const [msg, setMsg] = useState<messageKeys[]>(['start']);
  const [moneyLeft, setMoney] = useState(new Set(startMoney()));
  const [cases, setCases] = useState(new Set(startCases()));
  const [mine, setMine] = useState<number | undefined>();
  const [moment, setMoment] = useState(momentList[0]);
  const [lastAmount, setLastAmount] = useState(0);
  const [bank, setBank] = useState(0);
  const [showBank, setShowBank] = useState(false);
  const lindaCallback = useRef<Function | undefined>(undefined);

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
    mapping = shuffleCases(allCases, allMoney);
    showMine = false;
    setMoment(momentList[0]);
    setShowBank(false);
    setBank(0);
    setMine(0);
    setMsg(['start']);
  };

  const handleLindaDone = useCallback(() => {
    lindaCallback.current?.();
  }, []);

  const caseValueMessage = (amountInCase: number): messageKeys => {
    const quarterIndex = (quarter: number) =>
      Math.round((allMoney.length / 4) * quarter);

    console.log('quarter', quarterIndex(2));
    if (amountInCase > allMoney[quarterIndex(3)]) {
      return 'expensive';
    } else if (amountInCase < allMoney[quarterIndex(1)]) {
      return 'cheap';
    } else if (amountInCase > allMoney[quarterIndex(2)]) {
      return 'upperHalfAmount';
    }
    return 'lowerHalfAmount';
  };

  // do this after delay after linda is done speaking
  const afterLinda = (func: Function, delay: number) => {
    lindaCallback.current = () => {
      setTimeout(() => {
        func();
      }, delay);
      lindaCallback.current = undefined;
    };
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
    afterLinda(() => {
      setMsg(['bankResult']);
      setShowBank(true);
    }, 800);
  };

  const handleClickCase = (num: number) => {
    if (bank) return;
    pickCase(num);
    if (!mine) {
      // first pick you're own case
      setMine(num);
      setMsg(['first6']);
      return;
    }
    const myAmount = mine && (mapping.get(mine) as number);
    const amountInCase = mapping.get(num);
    if (!amountInCase || !myAmount) return;

    const caseVal = caseValueMessage(amountInCase);
    console.log(amountInCase, caseVal);
    setLastAmount(amountInCase);
    pickMoney(amountInCase);

    if (cases.size === 1) {
      // picked all cases, end game
      setBank(myAmount);
      setMsg(['end']);
      showMine = true;
    } else if (cases.size - 1 === moment.num) {
      // Bank moment
      setMsg([caseVal, 'bank']);
      bankMoment(amountInCase);
    } else {
      setMsg([caseVal, 'continue']);
    }
  };

  const handleDealResponse = (answer: boolean) => {
    console.log('Deal', answer);
    if (answer) {
      showMine = true;
      setMsg(['deal', 'checkOwn']);
      afterLinda(() => {
        setMsg(['showOwn']);
      }, 1500);
    } else {
      setMsg(['noDeal']);
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
            mine={mine && showMine ? mapping.get(mine) : 0}
            lindaDoneCallback={handleLindaDone}
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
