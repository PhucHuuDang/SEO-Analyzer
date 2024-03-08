import {
  contentLength,
  densityKeywordsLogs,
  imageLogs,
  keywordExistInMeta,
  keywordLogs,
  metaLogs,
  titleLogs,
} from "./seo-logs";
import {
  ContentProps,
  DensityPercentageProps,
  ImageProps,
  MetaProps,
  TitleProps,
  TitleValidateProps,
} from "./types";

function generateAssessment(
  assessmentKey: string,
  assessmentLabel: string,
  score: number,
  description: string,
  scoreLabel: string,
  suggestion?: string[],
  extra?: Record<string, any>
) {
  return {
    assessmentKey,
    assessmentLabel,
    score,
    description,
    scoreLabel,
    suggestion,
    extra,
  };
}

export const POOR_SCORE = 3;
export const IMPROVE_SCORE = 6;
export const GOOD_SCORE = 10;

export function generateExpectedResult(
  assessmentKey: string,
  assessmentLabel: string,
  description: string,
  extra: Record<string, any>,
  score: number,
  scoreLabel: string,
  suggestion?: string[]

  // length: number,
  // content: ContentProps,
  // description: string
) {
  // const assessmentKeyObj = contentLength.assessments;
  // const assessmentLabel: string = assessmentKeyObj.assessmentLabel;
  // const suggestion: string[] = [];

  return {
    assessmentKey,
    assessmentLabel,
    description,
    extra,
    score,
    scoreLabel,
    suggestion,
  };
}

export const keywordValidation = (keywords: boolean) => {
  const assessmentKey: string = keywordLogs.assessments.assessmentKey;
  const assessmentLabel: string = keywordLogs.assessments.assessmentLabel;
  let score: number = 3;
  let description: string = "";
  let scoreLabel: string = "";
  let suggestion: string[] = [];
  const extra: Record<string, any> = {
    isExistKeywordInTitle: keywords ?? "Không có từ khoá chính",
  };

  if (keywords === undefined || keywords === null) {
    throw new Error("keywords is not defined");
  } else if (typeof keywords !== "boolean") {
    throw new Error("keywords is not a boolean type");
  } else if (keywords) {
    description = keywordLogs.goodStatus;
    score = GOOD_SCORE;
    scoreLabel = titleLogs.assessments.scoreLabel.good(
      assessmentLabel
    ) as string;
  } else {
    description = keywordLogs.poorExistKeyWord;
    score = POOR_SCORE;
    scoreLabel = titleLogs.assessments.scoreLabel.poor(assessmentLabel);
    suggestion = [keywordLogs.suggestion.keyword];
  }

  return generateAssessment(
    assessmentKey,
    assessmentLabel,
    score,
    description,
    scoreLabel,
    suggestion,
    extra
  );
};

export function contentLengthValidate(length: number, content: ContentProps) {
  const assessmentKeyObj = contentLength.assessments;

  const assessmentKey: string = assessmentKeyObj.assessmentKey;
  const assessmentLabel: string = assessmentKeyObj.assessmentLabel;
  let score: number = 3;
  let description: string = "";
  let scoreLabel: string = "";
  let suggestion: string[] = [];
  const extra: Record<string, any> = {
    titleLength: length,
  };

  const lengthObjConditions = Object.keys(content).length;

  if (!length || !content) {
    throw new Error("missing one of two params");
  } else if (typeof length !== "number") {
    throw new Error("length is not a number type");
  } else if (length < 0) {
    throw new Error("length can't be negative");
  } else if (
    typeof content !== "object" &&
    !Array.isArray(content) &&
    content !== null
  ) {
    throw new Error("content is not an object");
  } else if (content.minLength < 0 || content.maxLength < 0) {
    throw new Error("conditions are set can not be negative");
  } else if (lengthObjConditions !== 2) {
    throw new Error("this function need 2 conditions");
  } else if (length < content.minLength) {
    description = contentLength.poorShortContent;
    score = POOR_SCORE;
    scoreLabel = assessmentKeyObj.scoreLabel.poor(assessmentLabel) as string;
    suggestion = [contentLength.suggestion];
  } else if (length > content.maxLength) {
    description = contentLength.poorLongContent;
    score = POOR_SCORE;
    scoreLabel = assessmentKeyObj.scoreLabel.poor(assessmentLabel) as string;
    suggestion = [contentLength.suggestion];
  } else if (length >= content.minLength && length <= content.maxLength) {
    description = contentLength.goodStatus;
    score = GOOD_SCORE;
    scoreLabel = assessmentKeyObj.scoreLabel.good(assessmentLabel) as string;
  }

  return generateAssessment(
    assessmentKey,
    assessmentLabel,
    score,
    description,
    scoreLabel,
    suggestion,
    extra
  );
}

export const titleValidate = (
  // length: number,
  // existKeywordsInTitle: boolean,
  // checkPositionKeyword: string | boolean,
  titleValueReturned: TitleValidateProps,
  titleConditions: TitleProps
) => {
  const assessmentLabelObj = titleLogs.assessments.assessmentLabel;
  const scoreLabelObj = titleLogs.scoreLabel;
  const { length, existKeywordsInTitle, checkPositionKeyword } =
    titleValueReturned;

  const { minLength, averageLength, maxLength } = titleConditions;

  const assessmentKey: string = titleLogs.assessments.assessmentKey;
  let assessmentLabel: string = assessmentLabelObj.titleLength;
  let score: number = 3;
  let description: string = "";
  let scoreLabel: string = "";
  let suggestion: string[] = [];
  const extra: Record<string, any> = {
    titleValueReturned: length,
    existKeywordsInTitle: existKeywordsInTitle,
    checkPositionKeyword: checkPositionKeyword,
  };

  if (!titleValueReturned || !titleConditions) {
    throw new Error("missing one of two params");
  } else if (
    typeof titleValueReturned !== "object" &&
    !Array.isArray(titleValueReturned)
  ) {
    throw new Error("the first param is not an object");
  } else if (
    typeof titleConditions !== "object" &&
    !Array.isArray(titleConditions)
  ) {
    throw new Error("the second param is not an object");
  } else if (minLength < 0 || averageLength < 0 || maxLength < 0) {
    throw new Error(
      "conditions (minLength or averageLength or maxLength) are set can't be negative"
    );
  } else if (
    typeof length !== "number" ||
    typeof existKeywordsInTitle !== "boolean" ||
    typeof checkPositionKeyword !== "boolean"
  ) {
    throw new Error(
      "One or more parameters have incorrect types: length, existKeywordsInTitle, or checkPositionKeyword"
    );
  } else if (
    typeof minLength !== "number" ||
    typeof averageLength !== "number" ||
    typeof maxLength !== "number"
  ) {
    throw new Error(
      "One or more parameters have incorrect types: minLength, averageLength, or maxLength"
    );
  } else if (length < minLength || length > maxLength) {
    description = titleLogs.poorLengthTitle;
    score = POOR_SCORE;
    scoreLabel = scoreLabelObj.poor(assessmentLabelObj.titleLength);
    suggestion = [titleLogs.suggestion.titleLength];
  } else if (!existKeywordsInTitle) {
    description = titleLogs.poorExistedKeyWord;
    assessmentLabel = assessmentLabelObj.existKeywordsInTitle;
    score = POOR_SCORE;
    scoreLabel = scoreLabelObj.poor(assessmentLabelObj.existKeywordsInTitle);
    suggestion = [titleLogs.suggestion.existKeywordsInTitle];
  } else if (
    length >= minLength &&
    length <= maxLength &&
    existKeywordsInTitle &&
    checkPositionKeyword
  ) {
    description = titleLogs.goodStatus(length);
    assessmentLabel = assessmentLabelObj.titleLength;
    score = GOOD_SCORE;
    scoreLabel = scoreLabelObj.good(assessmentLabelObj.titleLength);
  } else if (!checkPositionKeyword) {
    description = titleLogs.improveStatus;
    assessmentLabel = assessmentLabelObj.checkPositionKeywordInTitle;
    score = IMPROVE_SCORE;
    scoreLabel = scoreLabelObj.improve(
      assessmentLabelObj?.checkPositionKeywordInTitle
    );
  }

  return generateAssessment(
    assessmentKey,
    assessmentLabel,
    score,
    description,
    scoreLabel,
    suggestion,
    extra
  );
};

export const metaValidation = (length: number, meta: MetaProps) => {
  const assessmentKeyObj = metaLogs.assessments;
  const scoreLabelObj = assessmentKeyObj.scoreLabel;
  const { minLength, improveLength, goodMinLength, goodMaxLength, maxLength } =
    meta;

  const assessmentKey: string = assessmentKeyObj.assessmentKey;
  const assessmentLabel: string = assessmentKeyObj.assessmentLabel;
  let score: number = 3;
  let description: string = "";
  let scoreLabel: string = "";
  let suggestion: string[] = [];
  const extra: Record<string, any> = {
    metaLength: length,
  };

  const metaLimitsLength = Object.keys(meta).length;

  // exception case
  if (!length || !meta) {
    throw new Error("missing 1 of 2 params");
  } else if (typeof length !== "number") {
    throw new Error("length is not a number type");
  } else if (metaLimitsLength !== 5) {
    throw new Error("meta is not enough or too much");
  } else if (typeof meta !== "object") {
    throw new Error("meta is not an object");
  } else if (length < 0) {
    throw new Error("length can't be negative");
  } else if (
    minLength < 10 ||
    maxLength < 10 ||
    goodMinLength < 10 ||
    goodMaxLength < 10
  ) {
    throw new Error("conditions are set can't be less than 10");
  } else if (length <= minLength || length > maxLength) {
    description = metaLogs.poorShortLength(length);
    score = POOR_SCORE;
    scoreLabel = scoreLabelObj.poor(assessmentLabel);
    suggestion = [assessmentKeyObj.suggestion as string];
  } else if (length >= goodMaxLength && length <= maxLength) {
    description = metaLogs.improveOutRangeLength(length);
    score = IMPROVE_SCORE;
    scoreLabel = scoreLabelObj.improve(assessmentLabel);
    suggestion = [assessmentKeyObj.suggestion as string];
  } else if (length >= improveLength && length < goodMinLength) {
    description = metaLogs.improveInRangeLength(length);
    score = IMPROVE_SCORE;
    scoreLabel = scoreLabelObj.improve(assessmentLabel);
    suggestion = [assessmentKeyObj.suggestion as string];
  } else if (length >= goodMinLength && length <= goodMaxLength) {
    description = metaLogs.goodLength(length);
    score = GOOD_SCORE;
    scoreLabel = scoreLabelObj.good(assessmentLabel);
    suggestion = [];
  }

  return generateAssessment(
    assessmentKey,
    assessmentLabel,
    score,
    description,
    scoreLabel,
    suggestion,
    extra
  );
};

export const existKeywordInMetaDescription = (value: boolean) => {
  const assessmentKey: string = keywordExistInMeta.assessments.assessmentKey;
  const assessmentLabel: string =
    keywordExistInMeta.assessments.assessmentLabel;
  let score: number = 3;
  let description: string = "";
  let scoreLabel: string = "";
  let suggestion: string[] = [];
  const extra: Record<string, any> = {
    isExistKeywordInMeta: value,
  };

  if (value === undefined) {
    throw new Error("value is not defined");
  } else if (value === null) {
    throw new Error("value is null");
  } else if (typeof value !== "boolean") {
    throw new Error("value is not a boolean type");
  } else if (value === true) {
    description = keywordExistInMeta.keywordValid;
    score = GOOD_SCORE;
    scoreLabel =
      keywordExistInMeta.assessments.scoreLabel.good(assessmentLabel);
  } else if (value === false) {
    description = keywordExistInMeta.keywordInValid;
    score = IMPROVE_SCORE;
    scoreLabel = metaLogs.assessments.scoreLabel.improve(assessmentLabel);
    suggestion = [keywordExistInMeta.suggestion];
  }

  return generateAssessment(
    assessmentKey,
    assessmentLabel,
    score,
    description,
    scoreLabel,
    suggestion,
    extra
  );
};

export const densityKeywordsValidate = (
  density: number,
  densityKeywordPercentsLimited: DensityPercentageProps
) => {
  var sizeParamObj = Object.keys(densityKeywordPercentsLimited).length;

  const assessmentObj = densityKeywordsLogs.assessments;
  const { goodMinPercent, goodMaxPercent, improveMinPercent } =
    densityKeywordPercentsLimited;

  const assessmentKey: string = assessmentObj.assessmentKey;
  const assessmentLabel: string = assessmentObj.assessmentLabel;
  let score: number = 3;
  let description: string = "";
  let scoreLabel: string = "";
  let suggestion: string[] = [];
  const extra: Record<string, any> = {
    densityKeywords: density,
  };

  if (typeof density !== "number") {
    throw new Error("first param is not a number");
  } else if (typeof densityKeywordPercentsLimited !== "object") {
    throw new Error("second param is not an object contain 3 keys percents");
  } else if (
    typeof densityKeywordPercentsLimited === "object" &&
    sizeParamObj !== 3
  ) {
    throw new Error("densityKeywordPercentsLimited is not enough or too much");
  } else if (!density || !densityKeywordPercentsLimited) {
    throw new Error("missing one of two params");
  } else if (density < 0) {
    throw new Error("density can't be negative");
  } else if (
    goodMinPercent < 0 ||
    goodMaxPercent < 0 ||
    improveMinPercent < 0
  ) {
    throw new Error("conditions are set can't be negative");
  } else if (density >= goodMinPercent && density <= goodMaxPercent) {
    description = densityKeywordsLogs.goodStatus(density);
    score = GOOD_SCORE;
    scoreLabel = assessmentObj.scoreLabel.good(assessmentLabel);
  } else if (
    (density >= improveMinPercent && density < goodMinPercent) ||
    density > goodMaxPercent
  ) {
    description = densityKeywordsLogs.improveStatus(density);
    score = IMPROVE_SCORE;
    scoreLabel = assessmentObj.scoreLabel.improve(assessmentLabel);
    suggestion = [densityKeywordsLogs.suggestion];
  } else {
    description = densityKeywordsLogs.poorStatus(density);
    score = IMPROVE_SCORE;
    scoreLabel = assessmentObj.scoreLabel.improve(assessmentLabel);
    suggestion = [densityKeywordsLogs.suggestion];
  }

  return generateAssessment(
    assessmentKey,
    assessmentLabel,
    score,
    description,
    scoreLabel,
    suggestion,
    extra
  );
};

export const imageValidation = (
  images: ImageProps[],
  isExistKeywordInAlt: boolean
) => {
  const assessmentKey: string = imageLogs.assessments.assessmentKey;
  const assessmentLabel: string = imageLogs.assessments.assessmentLabel;
  let score: number = 3;
  let description: string = "";
  let scoreLabel: string = "";
  let suggestion: string[] = [];
  const extra: Record<string, any> = {};

  const isExistAlt = images?.every((item) => item.alt);

  if (!images || isExistKeywordInAlt === undefined) {
    throw new Error("missing one of two params");
  } else if (!Array.isArray(images)) {
    throw new Error("images is not an array");
  } else if (
    !images.every(
      (item) =>
        typeof item === "object" && !Array.isArray(item) && item !== null
    )
  ) {
    throw new Error("images is not an array of objects");
  } else if (typeof isExistKeywordInAlt !== "boolean") {
    throw new Error("isExistKeywordInAlt is not a boolean type");
  }
  if (images.length !== 0 && !isExistKeywordInAlt) {
    description = imageLogs.improveStatus;
    score = IMPROVE_SCORE;
    scoreLabel = imageLogs.assessments.scoreLabel.improve(assessmentLabel);
    suggestion = [imageLogs.suggestion.improveStatus];
  } else if (images.length !== 0 && isExistKeywordInAlt && !isExistAlt) {
    description = imageLogs.poorStatus;
    score = POOR_SCORE;
    scoreLabel = imageLogs.assessments.scoreLabel.poor(assessmentLabel);
    suggestion = [imageLogs.suggestion.poorStatus];
  } else if (images.length !== 0 && isExistKeywordInAlt && isExistAlt) {
    description = imageLogs.goodStatus;
    score = GOOD_SCORE;
    scoreLabel = imageLogs.assessments.scoreLabel.good(assessmentLabel);
  } else if (images.length === 0 && isExistKeywordInAlt) {
    description = imageLogs.poorInvalidImage;
    score = POOR_SCORE;
    scoreLabel = imageLogs.assessments.scoreLabel.poor(assessmentLabel);
    suggestion = [imageLogs.suggestion.poorInvalidImage];
  }

  return generateAssessment(
    assessmentKey,
    assessmentLabel,
    score,
    description,
    scoreLabel,
    suggestion,
    extra
  );
};
