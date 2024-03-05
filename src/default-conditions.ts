import { ConfigConditions } from "./types";

export const originalCondition: ConfigConditions = {
  title: {
    minLength: 50,
    averageLength: 60,
    maxLength: 70,
  },

  content: {
    minLength: 300,
    maxLength: 1200,

    outRage: {
      outOfMinLength: 299,
      outOfMaxLength: 1201,
    },
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
export let dynamicConditions: ConfigConditions = originalCondition;

export function setDefaultCondition(newConditions: ConfigConditions) {
  return newConditions && (dynamicConditions = newConditions);
}

export const assessmentLevels = {
  POOR: "Bài viết đạt trạng thái TỆ",
  BASIC: "Bài viết đạt trạng thái CƠ BẢN, cần cải thiện",
  GOOD: "Bài viết đạt trạng thái TỐT",
  VERY_GOOD: "Bài viết đạt trạng thái RẤT TỐT",
  EXCELLENT: "Bài viết đạt trạng thái XUẤT SẮC",
};
