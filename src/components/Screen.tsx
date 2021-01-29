import React from "react";
import "./Screen.css";

interface Props {
  msg: string;
}

const Screen: React.FC<Props> = ({ msg }) => {
  return <div className="screen">{msg}</div>;
};

export default Screen;
