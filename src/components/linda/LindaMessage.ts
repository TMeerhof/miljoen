import { formatMoney } from '../../domain/Money';
import { sample } from 'lodash';

interface StringParams {
  casesToOpen: number;
  bank: number;
  lastAmount: number;
  mine: number | undefined;
}

interface FactoryParams extends StringParams {
  formatAmount: string;
  formatBank: string;
  formatMine: string;
  pluralCase: string;
}

const PluralCase = (params: StringParams) =>
  params.casesToOpen === 1 ? 'één koffer' : `${params.casesToOpen} koffers`;

type FactoryParamsFunction = (params: FactoryParams) => string | undefined;
const sentenceFactory = (
  params: StringParams,
  FactoryParamsFunction: FactoryParamsFunction
) => {
  const factory: FactoryParams = {
    ...params,
    formatBank: formatMoney(params.bank),
    formatAmount: formatMoney(params.lastAmount),
    formatMine: formatMoney(params.mine),
    pluralCase: PluralCase(params),
  };
  return FactoryParamsFunction(factory);
};

export const messages = {
  start: (params: StringParams) =>
    sentenceFactory(params, (p) => {
      return sample([
        'Welkom bij miljoenenjacht LessonUppers, kies nu eerst jouw eigen koffer.',
        'Welkom bij miljoenenjacht, Ik heb er zin in! Kies nu eerst de koffer.',
        'Welkom bij miljoenenjacht, doe je best, dan is het volgende bedrijfsuitje op Bonaire, kies nu eerst je eigen koffer.',
      ]);
    }),
  first6: (params: StringParams) =>
    sentenceFactory(params, (p) => {
      return sample([
        `Dan kunnen we nu echt beginnen!!\n Kies nu je eerste ${p.pluralCase}, dan krijg je een aanbod van de bank!`,
        `Kies nu je eerste ${p.pluralCase}, dan gaan we voor het eerst van de bank horen!`,
      ]);
    }),
  bank: (params: StringParams) =>
    sentenceFactory(params, (p) => {
      return sample([
        `Dan is het nu tijd voor de bank, spannend!!, wat zou het worden?!`,
        `Oh volgens mij wil je bank een aanbod doen, wat zou het worden?`,
        `Heb je die bank weer, lijkt Daan wel met dat gedoe over geld.`,
      ]);
    }),
  bankResult: (params: StringParams) =>
    sentenceFactory(params, (p) => {
      return sample([
        `${p.formatBank}!! nou DEAL of niet?`,
        `Oh, daar zou ik wel even over na moeten denken! Deal of niet?`,
        `Zo he, daar zou Jasper veel speciaalbiertjes van kunnen kopen. Nou gun je het hem?`,
        `Deal of niet? Het lijkt pipedrive wel.`,
      ]);
    }),
  continue: (params: StringParams) =>
    sentenceFactory(params, (p) => {
      return sample([
        `Nog ${p.pluralCase} tot de bank.`,
        `Nog ${p.pluralCase} tot we weer wat horen.`,
        `Nog ${p.pluralCase}, kom op!`,
      ]);
    }),
  cheap: (params: StringParams) =>
    sentenceFactory(params, (p) => {
      return sample([
        `Fijn zo'n goedkope ${p.formatAmount}!!`,
        `${p.formatAmount} dat is lekker, vindt de Bank verschrikkelijk.`,
        `${p.formatAmount}, ongeveer wat Tim zou vragen aan docenten voor LessonUp als het aan hem lag.`,
      ]);
    }),
  lowerHalfAmount: (params: StringParams) =>
    sentenceFactory(params, (p) => {
      return sample([
        `${p.formatAmount}.`,
        `${p.formatAmount}, prima!`,
        `${p.formatAmount}, kan erger.`,
        `${p.formatAmount}, Gemiddelde deal van Grietje is groter.`,
      ]);
    }),
  upperHalfAmount: (params: StringParams) =>
    sentenceFactory(params, (p) => {
      return sample([
        `${p.formatAmount}. Lisa zou dat een mooie dealbedrag vinden.`,
        `${p.formatAmount}, kan erger.`,
      ]);
    }),
  expensive: (params: StringParams) =>
    sentenceFactory(params, (p) => {
      return sample([
        `Ai, ${p.formatAmount}! Dat is een dure, balen!!`,
        `Godsknokke, dat is zonder van die ${p.formatAmount}.`,
      ]);
    }),
  deal: (params: StringParams) =>
    sentenceFactory(params, (p) => {
      return sample([
        `${p.formatBank} DEAL!!!! Gefeliciteerd! Wat ga je er mee doen?`,
        `${p.formatBank} DEAL!!!! Nou jij wordt de nieuwe investeerder van LessonUp.`,
      ]);
    }),
  checkOwn: (params: StringParams) =>
    sentenceFactory(params, (p) => {
      return sample([
        `laten we nu kijken wat in je koffer zit.`,
        `Nog ff snel in dat doosje van je kijken.`,
      ]);
    }),
  showOwn: (params: StringParams) =>
    sentenceFactory(params, (p) => {
      return sample([
        `Roffel de boffel de roffel, het issssss: ${p.formatMine}! zo he.`,
        `${p.formatMine}! Zat dat er gewoon heel de tijd al in, joh!`,
      ]);
    }),
  end: (params: StringParams) =>
    sentenceFactory(params, (p) => {
      return sample([
        `${p.formatAmount} in je koffer! Heb je daar nu zo lang op gewacht`,
        `${p.formatAmount}! Helemaal uitgespeeld, succes er mee`,
        `${p.formatAmount}! Kon je niet kiezen, wat jammer?`,
      ]);
    }),
  noDeal: (params: StringParams) =>
    sentenceFactory(params, (p) => {
      return sample([
        `Gaan we nu weer lekker verder met ${p.pluralCase}`,
        `Ok jammer, ik dacht echt dat dit hem ging woorden, ${p.pluralCase} te gaan.`,
        `Niet?! Maak is eens een keus joh, nou ja over ${p.pluralCase} nog een kans`,
      ]);
    }),
};

export type messageKeys = keyof typeof messages;
export type messageString = (params: StringParams) => string;
