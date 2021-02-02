import React from "react";
import "./DealNoDeal.css";

interface Props {
  handleResponce: (deal: boolean) => void;
  showBank: boolean;
}

const DeaLQuestion: React.FC<Props> = ({
  handleResponce,
  children,
  showBank,
}) => {
  return (
    <div className="deal">
      {showBank && (
        <div className="bank">
          <div className="amount">{children}</div>
          <DealButton onclick={() => handleResponce(true)}></DealButton>
          <div className="stop" onClick={() => handleResponce(false)}></div>
        </div>
      )}
    </div>
  );
};

export const DealButton: React.FC<{ onclick: () => any }> = ({ onclick }) => {
  return <div className="button" onClick={onclick}></div>;
};
export default DeaLQuestion;
