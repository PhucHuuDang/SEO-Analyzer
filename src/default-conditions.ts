import { ConfigConditions } from "./types";

export const defaultCondition: ConfigConditions = {
  title: {
    minLength: 50,
    averageLength: 60,
    maxLength: 70,
  },
  content: {
    minLength: 300,
    maxLength: 1200,
  },
  meta: {
    minLength: 120,
    improveLength: 140,
    goodMinLength: 150,
    goodMaxLength: 160,
    maxLength: 170,
  },

  densityKeyword: {
    goodMinPercent: 2,
    goodMaxPercent: 3,
    improveMinPercent: 1.8,
  },
};
