import React from "react";
import "./DealNoDeal.css";

interface Props {
  handleResponce: (deal: boolean) => void;
}

const DeaLQuestion: React.FC<Props> = ({ handleResponce, children }) => {
  return (
    <div className="deal">
      <div className="bank">
        <div className="amount">{children}</div>
        <div className="button" onClick={() => handleResponce(true)}></div>
        <div className="stop" onClick={() => handleResponce(false)}></div>
      </div>
    </div>
  );
};

export default DeaLQuestion;
