import { formatMoney } from "../../domain/Money";

interface StringParams {
  casesToOpen: number;
  bank: number;
  lastAmount: number;
  mine: number | undefined;
}

const PluralCase = (params: StringParams) =>
  params.casesToOpen === 1 ? "één koffer" : `${params.casesToOpen} koffers`;

export const messages = {
  start: [
    (params: StringParams) =>
      "Welkom bij miljoenenjacht, kies nu eerst je  eigen koffer",
  ],
  first6: [
    (params: StringParams) =>
      `Dan kunnen we nu echt beginnen!!\n Kies nu je eerste ${PluralCase(
        params
      )}, dan krijg je een aanbod van de bank!`,
  ],
  bank: [
    (params: StringParams) =>
      `Dan is het nu tijd voor de bank, spannend!!, wat zou het worden?!`,
  ],
  bankResult: [
    (params: StringParams) =>
      `${formatMoney(
        params.bank
      )}!! Dat is nog is een mooi aanbod, nou DEAL of niet?`,
  ],
  continue: [
    (params: StringParams) => `Nog  ${PluralCase(params)} tot de bank`,
  ],
  regular: [
    (params: StringParams) => `${formatMoney(params.lastAmount)}.`,
    (params: StringParams) => `${formatMoney(params.lastAmount)}, prima.`,
  ],
  expensive: [
    (params: StringParams) =>
      `Ai, ${formatMoney(params.lastAmount)}! Dat is een dure, balen!!`,
  ],
  cheap: [
    (params: StringParams) =>
      `Fijn zo'n goedkope ${formatMoney(params.lastAmount)}!!`,
  ],
  deal: [
    (params: StringParams) =>
      `${formatMoney(
        params.lastAmount
      )}!!!! Gefeliciteerd! Wat ga je er mee doen?`,
  ],
  checkOwn: [
    (params: StringParams) => `laten we nu kijken wat in je eigen koffer zit`,
  ],
  showOwn: [
    (params: StringParams) =>
      `${formatMoney(params.mine)}! Zat dat er gewoon heel de tijd al in, joh!`,
  ],
  end: [
    (params: StringParams) =>
      `${formatMoney(params.mine)}! Helemaal uitgespeeld, succes er mee`,
  ],
  noDeal: [
    (params: StringParams) =>
      `Gaan we nu weer lekker verder met ${params.casesToOpen} koffers`,
  ],
};

export type messageKeys = keyof typeof messages;
export type messageString = (params: StringParams) => string;
