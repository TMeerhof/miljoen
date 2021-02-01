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
  msg: messageKeys[];
  casesToOpen: number;
  lastAmount: number;
  bank: number;
  mine: number | undefined;
}

const Linda: React.FC<Props> = ({
  msg,
  casesToOpen,
  bank,
  lastAmount,
  mine,
}) => {
  const msgList = useDeepCompareMemoize<messageKeys[]>(msg);
  const [start, setStart] = useState(false);
  const [active, setActive] = useState(false);

  const sentence = useMemo(() => {
    return msgList.reduce((memo, key) => {
      const options = messages[key];
      const picked = sample(options) as messageString;
      return [memo, picked({ casesToOpen, bank, lastAmount, mine })].join(" ");
    }, "");
  }, [msgList, bank, casesToOpen, lastAmount, mine]);

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
          {!start ? (
            <button onClick={handleStart}>Start</button>
          ) : (
            <AnimateWord
              msg={sentence}
              active={active}
              handleDone={handleDone}
            />
          )}
          <div className="tuutje"></div>
        </div>
      </>
    </div>
  );
};
export default Linda;
