import { formatMoney } from "../../domain/Money";

interface StringParams {
  casesToOpen: number;
  bank: number;
  lastAmount: number;
}

export const messages = {
  start: [
    (params: StringParams) =>
      "Welkom bij miljoenenjacht, kies nu je  eigen koffer",
  ],
  first6: [
    (params: StringParams) =>
      "Dan kunnen we nu echt beginnen!! Kies nu eerste zes koffers, dan krijg je een aanbod van de bank",
  ],
  bank: [
    (params: StringParams) =>
      `${formatMoney(
        params.lastAmount
      )}. Dan is het nu tijd voor de bank, spannend, wat zou het worden?!`,
  ],
  bankResult: [
    (params: StringParams) =>
      `${formatMoney(
        params.bank
      )}!! Dat is nog is een mooi aanbod, nou DEAL of niet?`,
  ],
  continue: [
    (params: StringParams) =>
      `Gaan we nu weer lekker verder met ${params.casesToOpen} koffers`,
  ],
  regular: [
    (params: StringParams) =>
      `${formatMoney(params.lastAmount)}. Nog ${params.casesToOpen} koffers`,
  ],
  expensive: [
    (params: StringParams) =>
      `Ai, ${formatMoney(params.lastAmount)}! Dat is een dure, balen!!. Nog ${
        params.casesToOpen
      } koffers tot de bank`,
  ],
  cheap: [
    (params: StringParams) =>
      `Fijn zo'n goedkope ${formatMoney(params.lastAmount)}!! Nog ${
        params.casesToOpen
      } koffers, kom op`,
  ],
};

export type messageKeys = keyof typeof messages;
export type messageString = (params: StringParams) => string;
