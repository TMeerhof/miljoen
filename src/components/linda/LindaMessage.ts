import { formatMoney } from '../../domain/Money';
import { sample } from 'lodash';

interface StringParams {
  casesToOpen: number;
  bank: number;
  lastAmount: number;
  mine: number | undefined;
}

const PluralCase = (params: StringParams) =>
  params.casesToOpen === 1 ? 'één koffer' : `${params.casesToOpen} koffers`;

export const messages = {
  start: (params: StringParams) => {
    return sample([
      'Welkom bij miljoenenjacht, kies nu eerst je  eigen koffer',
    ]);
  },
  first6: (params: StringParams) => {
    return sample([
      `Dan kunnen we nu echt beginnen!!\n Kies nu je eerste ${PluralCase(
        params
      )}, dan krijg je een aanbod van de bank!`,
    ]);
  },
  bank: (params: StringParams) => {
    return sample([
      `Dan is het nu tijd voor de bank, spannend!!, wat zou het worden?!`,
    ]);
  },
  bankResult: (params: StringParams) => {
    return sample([
      `${formatMoney(
        params.bank
      )}!! Dat is nog is een mooi aanbod, nou DEAL of niet?`,
    ]);
  },
  continue: (params: StringParams) => {
    return sample([`Nog ${PluralCase(params)} tot de bank`]);
  },
  regular: (params: StringParams) => {
    return sample([
      `${formatMoney(params.lastAmount)}.`,
      `${formatMoney(params.lastAmount)}, prima.`,
    ]);
  },
  expensive: (params: StringParams) => {
    return sample([
      `Ai, ${formatMoney(params.lastAmount)}! Dat is een dure, balen!!`,
    ]);
  },
  cheap: (params: StringParams) => {
    return sample([`Fijn zo'n goedkope ${formatMoney(params.lastAmount)}!!`]);
  },
  deal: (params: StringParams) => {
    return sample([
      `${formatMoney(
        params.lastAmount
      )} DEAL!!!! Gefeliciteerd! Wat ga je er mee doen?`,
      `${formatMoney(
        params.lastAmount
      )} DEAL!!!! Nou jij wordt de nieuwe investeerder van LessonUp`,
    ]);
  },
  checkOwn: (params: StringParams) => {
    return sample([
      `laten we nu kijken wat in je koffer zit`,
      `Nog ff snel in dat doosje van je kijken`,
    ]);
  },
  showOwn: (params: StringParams) => {
    return sample([
      `Roffel de boffel de roffel, het issssss: ${formatMoney(
        params.mine
      )}! zo he`,
      `${formatMoney(params.mine)}! Zat dat er gewoon heel de tijd al in, joh!`,
    ]);
  },
  end: (params: StringParams) => {
    return sample([
      `${formatMoney(
        params.mine
      )} in je koffer! Heb je daar nu zo lang op gewacht`,
      `${formatMoney(params.mine)}! Helemaal uitgespeeld, succes er mee`,
      `${formatMoney(params.mine)}! Kon je niet kiezen, wat jammer?`,
    ]);
  },
  noDeal: (params: StringParams) => {
    return sample([
      `Gaan we nu weer lekker verder met ${PluralCase(params)}`,
      `Niet?! Maak is een keus joh, nou ja over ${PluralCase(
        params
      )} nog een kans`,
    ]);
  },
};

export type messageKeys = keyof typeof messages;
export type messageString = (params: StringParams) => string;
