import _ from "lodash";
const money = [
  0.01,
  0.2,
  0.5,
  1,
  5,
  10,
  20,
  50,
  100,
  500,
  1000,
  2500,
  5000,
  10000,
  25000,
  50000,
  100000,
  200000,
  300000,
  400000,
  500000,
  750000,
  1000000,
  2000000,
  2500000,
  5000000,
];

const money2 = [100, 500, 1000, 2500, 5000, 10000];

const boxes = _.range(1, money.length + 1);

export function startMoney() {
  return [...money];
}

export function startCases() {
  return [...boxes];
}
