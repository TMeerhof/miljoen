import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import useInterval from '../hooks/useIterval';
import './AnimateWord.css';

interface Props {
  active: boolean;
  msg: string;
  handleDone: () => void;
}

const notVisible = (char: CharProps) => !char.visible;

const AnimateWord: React.FC<Props> = ({ active, msg, handleDone }) => {
  const sentenceMemo: CharProps[][] = useMemo(() => {
    const words = msg.split(' ');
    return words.map((chars) =>
      chars.split('').map((char) => ({ char, visible: false }))
    );
  }, [msg]);

  useEffect(() => {
    setSentence(sentenceMemo);
  }, [sentenceMemo]);

  const [sentence, setSentence] = useState(sentenceMemo);

  useInterval(
    () => {
      const wordIndex = sentence.findIndex((word) => word.some(notVisible));
      if (wordIndex === -1) {
        handleDone();
        return;
      }
      const charIndex = sentence[wordIndex].findIndex(notVisible);
      sentence[wordIndex][charIndex].visible = true;
      setSentence([...sentence]);
    },
    active ? 40 : null
  );

  return (
    <div className="msg">
      {sentence.map((chars, i) => (
        <>
          <Word chars={chars} key={`word-${i}`} />
          <span className="letter"> </span>
        </>
      ))}
    </div>
  );
};

export default AnimateWord;

interface WordProps {
  chars: CharProps[];
}
const Word: React.FC<WordProps> = ({ chars }) => {
  return (
    <div className="word">
      {chars.map((props, i) => (
        <Letter key={`letter-${i}`} {...props} />
      ))}
    </div>
  );
};

interface CharProps {
  char: string;
  visible: boolean;
}
const Letter: React.FC<CharProps> = ({ char, visible }) => {
  return char === '\n' ? (
    <span className="break-line"></span>
  ) : (
    <span className={classNames('letter', { visible })}>{char}</span>
  );
};
