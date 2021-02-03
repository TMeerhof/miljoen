import React, { useEffect } from 'react';
import useSound from 'use-sound';
import './DealNoDeal.css';
const siren = require('./siren.mp3');

interface Props {
  handleResponse: (deal: boolean) => void;
  showBank: boolean;
}

const DeaLQuestion: React.FC<Props> = ({
  handleResponse,
  children,
  showBank,
}) => {
  const [playSiren] = useSound(siren.default);
  useEffect(() => {
    if (showBank) {
      playSiren();
    }
  }, [showBank, playSiren]);

  return (
    <div className="deal">
      {showBank && (
        <div className="bank">
          <div className="amount">{children}</div>
          <DealButton onclick={() => handleResponse(true)}></DealButton>
          <div className="stop" onClick={() => handleResponse(false)}></div>
        </div>
      )}
    </div>
  );
};

export const DealButton: React.FC<{ onclick: () => any }> = ({ onclick }) => {
  return <div className="button" onClick={onclick}></div>;
};
export default DeaLQuestion;
