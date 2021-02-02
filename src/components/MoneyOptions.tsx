import classNames from "classnames";
import React from "react";
import "./MoneyOptions.css";
import { formatMoney } from "../domain/Money";

interface Props {
  startMoney: number[];
  money: Set<number>;
}

const MoneyOptions: React.FC<Props> = ({ startMoney, money, children }) => {
  const half = Math.floor(startMoney.length / 2);
  const left = startMoney.slice(0, half);
  const right = startMoney.slice(half);
  return (
    <div className="money">
      <div className="money-zone">
        {left.map((amount) => (
          <MoneyBar
            key={`money-${amount}`}
            amount={amount}
            hidden={!money.has(amount)}
          />
        ))}
      </div>
      {children}
      <div className="money-zone">
        {right.map((amount) => (
          <MoneyBar
            key={`money-${amount}`}
            amount={amount}
            hidden={!money.has(amount)}
          />
        ))}
      </div>
    </div>
  );
};

interface MoneyBarProps {
  amount: number;
  hidden: boolean;
}
const MoneyBar: React.FC<MoneyBarProps> = ({ amount, hidden }) => {
  return (
    <div
      className={classNames("money-bar", {
        hidden,
      })}
    >
      <div className="money-bar-amount">{formatMoney(amount)}</div>
    </div>
  );
};

export default MoneyOptions;
