import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import "./Linda.css";
import useDeepCompareMemoize from "../hooks/useDeepCompareMemoize";
import useSound from "use-sound";
import { sample } from "lodash";
import { messages, messageKeys, messageString } from "./linda/LindaMessage";
import AnimateWord from "./AnimateWord";
const sound = require("./linda/animalese.wav");

interface Props {
  msg: messageKeys;
  casesToOpen: number;
  lastAmount: number;
  bank: number;
}

const Linda: React.FC<Props> = ({ msg, casesToOpen, bank, lastAmount }) => {
  const memoMsg = useDeepCompareMemoize<messageString[]>(messages[msg]);
  const [start, setStart] = useState(false);
  const [active, setActive] = useState(false);

  const sentence = useMemo(() => {
    const picked = sample(memoMsg) as messageString;
    return picked({ casesToOpen, bank, lastAmount });
  }, [memoMsg, bank, casesToOpen, lastAmount]);
  console.log(sentence);

  const [playLinda, { stop: stopLinda }] = useSound(sound.default);

  useEffect(() => {
    if (!start) return;
    stopLinda();
    setActive(true);
    playLinda();
  }, [sentence, start, playLinda, stopLinda]);

  const handleStart = () => {
    setStart(true);
  };
  const handleDone = () => {
    stopLinda();
    setActive(false);
  };

  return (
    <div className="linda-total">
      {start ? (
        <>
          <div className="linda-container">
            <div className={classNames("linda", { active })}>
              <div className="part body"></div>
              <div className="part head">
                <div className="part main"></div>
                <div className="part mouth"></div>
              </div>
            </div>
          </div>
          <div className="linda-speak">
            <AnimateWord
              msg={sentence}
              active={active}
              handleDone={handleDone}
            />
            <div className="tuutje"></div>
          </div>
        </>
      ) : (
        <button onClick={handleStart}>Start</button>
      )}
    </div>
  );
};
export default Linda;
