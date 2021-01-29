import classNames from "classnames";
import React from "react";
import "./Cases.css";

interface Props {
  allCases: number[];
  cases: Set<number>;
  pickCase: (num: number) => void;
}
const Cases: React.FC<Props> = ({ allCases: numbers, cases, pickCase }) => {
  return (
    <div className="cases">
      {numbers.map((n) => (
        <Case
          key={`case-${n}`}
          number={n}
          hidden={!cases.has(n)}
          pickCase={pickCase}
        />
      ))}
    </div>
  );
};

export default Cases;
interface CaseProps {
  number: number;
  hidden: boolean;
  pickCase: (num: number) => void;
}

const Case: React.FC<CaseProps> = ({ number, hidden, pickCase }) => {
  return (
    <div
      className={classNames("case", { hidden })}
      onClick={() => pickCase(number)}
    >
      <CaseSVG />
      <div className="number">{number}</div>
    </div>
  );
};

function CaseSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      viewBox="0 0 1000 1000"
      fill="orange"
    >
      <path
        d="M4224.8 4293.8c-21.1-3.8-86.1-17.2-143.6-28.7-348.4-70.8-713.9-340.7-892-662.3-111-195.2-156.9-384.7-172.3-685.2l-13.4-258.4h-978.1c-537.9 0-1043.2-9.6-1121.6-19.1-377.1-49.8-689.1-327.3-775.2-691-24.9-107.2-28.7-507.2-28.7-3074v-2953.4h9800V-1125c0 2566.8-3.8 2966.8-28.7 3074-86.1 363.7-398.1 641.2-775.2 691-78.5 9.6-583.8 19.1-1121.6 19.1h-980v235.4c1.9 415.4-120.6 723.5-396.2 999.1-174.2 174.2-335 275.6-555.1 348.4l-153.1 51.7-813.5 3.8c-447.8 2-830.6.1-851.7-3.7zm1579.1-947.5c212.5-95.7 304.3-283.3 275.6-566.6l-13.4-120.6h-2138v132.1c0 262.2 51.7 398.1 193.3 503.4 112.9 84.2 164.6 90 897.7 90 662.3 1.9 702.5 0 784.8-38.3z"
        transform="matrix(.1 0 0 -.1 0 511)"
      ></path>
    </svg>
  );
}
