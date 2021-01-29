import classNames from "classnames";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Linda.css";
import useInterval from "../hooks/useIterval";
import useDeepCompareMemoize from "../hooks/useDeepCompareMemoize";
import useSound from "use-sound";
const lindaSound = require("./linda/linda.mp3");

interface Props {
  msg: string;
}
const Linda: React.FC<Props> = ({ msg }) => {
  const [start, setStart] = useState(false);
  const memoMsg = useDeepCompareMemoize(msg);
  const [active, setActive] = useState(false);
  const letterMemo = useMemo(
    () => memoMsg.split("").map((char) => ({ char, visible: false })),
    [memoMsg]
  );
  const [letters, setLetters] = useState(letterMemo);

  const [playLinda, { stop: stopLinda }] = useSound(lindaSound.default);
  useEffect(() => {
    if (!start) return;
    setActive(true);
  }, [letterMemo, start]);
  useInterval(
    () => {
      const index = letters.findIndex((obj) => !obj.visible);
      if (index === -1) {
        stopLinda();
        setActive(false);
        return;
      }
      letters[index].visible = true;
      console.log(letters);
      setLetters([...letters]);
    },
    active ? 100 : null
  );

  const handleStart = () => {
    setStart(true);
    playLinda();
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
            <div className="tuutje"></div>
            <div className="msg">
              {letters.map((props, i) => (
                <Letter key={`letter-${i}`} {...props} />
              ))}
            </div>
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
  console.log("render letter");
  return <span className={classNames("letter", { visible })}>{char}</span>;
};
export default Linda;
