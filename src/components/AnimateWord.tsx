import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import useInterval from "../hooks/useIterval";

interface Props {
  active: boolean;
  msg: string;
  handleDone: () => void;
}

const AnimateWord: React.FC<Props> = ({ active, msg, handleDone }) => {
  const letterMemo = useMemo(() => {
    return msg.split("").map((char) => ({ char, visible: false }));
  }, [msg]);
  useEffect(() => {
    setLetters(letterMemo);
  }, [letterMemo]);
  const [letters, setLetters] = useState(letterMemo);

  useInterval(
    () => {
      const index = letters.findIndex((obj) => !obj.visible);
      if (index === -1) {
        handleDone();
        return;
      }
      letters[index].visible = true;
      setLetters([...letters]);
    },
    active ? 50 : null
  );

  return (
    <div className="msg">
      <Words chars={letters} />
    </div>
  );
};

export default AnimateWord;

interface WordProps {
  chars: CharProps[];
}
const Words: React.FC<WordProps> = ({ chars }) => {
  return (
    <>
      {chars.map((props, i) => (
        <Letter key={`letter-${i}`} {...props} />
      ))}
    </>
  );
};

interface CharProps {
  char: string;
  visible: boolean;
}
const Letter: React.FC<CharProps> = ({ char, visible }) => {
  return <span className={classNames("letter", { visible })}>{char}</span>;
};
