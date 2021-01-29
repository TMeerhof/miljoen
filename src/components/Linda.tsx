import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import "./Linda.css";
import useInterval from "../hooks/useIterval";
import useDeepCompareMemoize from "../hooks/useDeepCompareMemoize";
import useSound from "use-sound";
import { sample } from "lodash";
import { messages, messageKeys, messageString } from "./linda/LindaMessage";
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
  const letterMemo = useMemo(() => {
    const picked = sample(memoMsg) as messageString;
    return picked({ casesToOpen, bank, lastAmount })
      .split("")
      .map((char) => ({ char, visible: false }));
  }, [memoMsg, bank, casesToOpen]);

  const [letters, setLetters] = useState(letterMemo);
  const [playLinda, { stop: stopLinda }] = useSound(sound.default);

  useEffect(() => {
    if (!start) return;
    stopLinda();

    setActive(true);
    playLinda();
    setLetters(letterMemo);
  }, [letterMemo, start, playLinda, stopLinda]);
  useInterval(
    () => {
      const index = letters.findIndex((obj) => !obj.visible);
      if (index === -1) {
        stopLinda();
        setActive(false);
        return;
      }
      letters[index].visible = true;
      setLetters([...letters]);
    },
    active ? 50 : null
  );

  const handleStart = () => {
    setStart(true);
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
            <div className="msg">
              {letters.map((props, i) => (
                <Letter key={`letter-${i}`} {...props} />
              ))}
            </div>
            <div className="tuutje"></div>
          </div>
        </>
      ) : (
        <button onClick={handleStart}>Start</button>
      )}
    </div>
  );
};

interface CharProps {
  char: string;
  visible: boolean;
}
const Letter: React.FC<CharProps> = ({ char, visible }) => {
  return <span className={classNames("letter", { visible })}>{char}</span>;
};
export default Linda;
