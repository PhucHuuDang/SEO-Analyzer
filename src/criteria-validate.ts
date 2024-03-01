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

const POOR_SCORE = 3;
const IMPROVE_SCORE = 6;
const GOOD_SCORE = 10;

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

  if (keywords) {
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

  switch (true) {
    case length < content.minLength:
      description = contentLength.poorShortContent;
      score = POOR_SCORE;
      scoreLabel = assessmentKeyObj.scoreLabel.poor(assessmentLabel) as string;
      suggestion = [contentLength.suggestion];
      break;
    case length > content.maxLength:
      description = contentLength.poorLongContent;
      score = POOR_SCORE;
      scoreLabel = assessmentKeyObj.scoreLabel.poor(assessmentLabel) as string;
      suggestion = [contentLength.suggestion];
      break;
    case length >= 300 && length <= 1200:
      description = contentLength.goodStatus;
      score = GOOD_SCORE;
      scoreLabel = assessmentKeyObj.scoreLabel.good(assessmentLabel) as string;
      break;
    default:
      // Default case
      break;
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
  title: TitleProps
) => {
  const assessmentLabelObj = titleLogs.assessments.assessmentLabel;
  const scoreLabelObj = titleLogs.scoreLabel;
  const { length, existKeywordsInTitle, checkPositionKeyword } =
    titleValueReturned;

  const { minLength, averageLength, maxLength } = title;

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

  switch (true) {
    case length < minLength || length > maxLength:
      description = titleLogs.poorLengthTitle;
      score = POOR_SCORE;
      scoreLabel = scoreLabelObj.poor(assessmentLabelObj.titleLength);
      suggestion = [titleLogs.suggestion.titleLength];
      break;
    case !existKeywordsInTitle:
      description = titleLogs.poorExistedKeyWord;
      assessmentLabel = assessmentLabelObj.existKeywordsInTitle;
      score = POOR_SCORE;
      scoreLabel = scoreLabelObj.poor(assessmentLabelObj.existKeywordsInTitle);
      suggestion = [titleLogs.suggestion.existKeywordsInTitle];
      break;
    case length >= averageLength && length <= maxLength && existKeywordsInTitle:
      description = titleLogs.goodStatus(length);
      assessmentLabel = assessmentLabelObj.titleLength;
      score = GOOD_SCORE;
      scoreLabel = scoreLabelObj.good(assessmentLabelObj.titleLength);
      break;
    case !checkPositionKeyword:
      description = titleLogs.improveStatus;
      assessmentLabel = assessmentLabelObj.checkPositionKeywordInTitle;
      score = IMPROVE_SCORE;
      scoreLabel = scoreLabelObj.improve(
        assessmentLabelObj?.checkPositionKeywordInTitle
      );
      break;
    default:
      // Default case
      break;
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

  switch (true) {
    case length < minLength || length > maxLength:
      description = metaLogs.poorShortLength(length);
      score = POOR_SCORE;
      scoreLabel = scoreLabelObj.poor(assessmentLabel);
      suggestion = [assessmentKeyObj.suggestion as string];
      break;
    case length >= goodMaxLength && length <= maxLength:
      description = metaLogs.improveOutRangeLength(length);
      score = IMPROVE_SCORE;
      scoreLabel = scoreLabelObj.improve(assessmentLabel);
      suggestion = [assessmentKeyObj.suggestion as string];
      break;
    case length >= improveLength && length <= goodMinLength:
      description = metaLogs.improveInRangeLength(length);
      score = IMPROVE_SCORE;
      scoreLabel = scoreLabelObj.improve(assessmentLabel);
      suggestion = [assessmentKeyObj.suggestion as string];
      break;
    case length >= goodMinLength && length <= goodMaxLength:
      description = metaLogs.goodLength(length);
      score = GOOD_SCORE;
      scoreLabel = scoreLabelObj.good(assessmentLabel);
      suggestion = [];
      break;
    default:
      // Default case
      break;
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
  if (value) {
    description = keywordExistInMeta.keywordValid;
    score = GOOD_SCORE;
    scoreLabel =
      keywordExistInMeta.assessments.scoreLabel.good(assessmentLabel);
  } else {
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
  densityKeyword: DensityPercentageProps
) => {
  const assessmentObj = densityKeywordsLogs.assessments;
  const { goodMinPercent, goodMaxPercent, improveMinPercent } = densityKeyword;

  const assessmentKey: string = assessmentObj.assessmentKey;
  const assessmentLabel: string = assessmentObj.assessmentLabel;
  let score: number = 3;
  let description: string = "";
  let scoreLabel: string = "";
  let suggestion: string[] = [];
  const extra: Record<string, any> = {
    densityKeywords: density,
  };

  switch (true) {
    case density >= goodMinPercent && density <= goodMaxPercent:
      description = densityKeywordsLogs.goodStatus(density);
      score = GOOD_SCORE;
      scoreLabel = assessmentObj.scoreLabel.good(assessmentLabel);
      break;
    case (density >= improveMinPercent && density < goodMinPercent) ||
      density > goodMaxPercent:
      description = densityKeywordsLogs.improveStatus(density);
      score = IMPROVE_SCORE;
      scoreLabel = assessmentObj.scoreLabel.improve(assessmentLabel);
      suggestion = [densityKeywordsLogs.suggestion];
      break;
    default:
      description = densityKeywordsLogs.poorStatus(density);
      score = IMPROVE_SCORE;
      scoreLabel = assessmentObj.scoreLabel.improve(assessmentLabel);
      suggestion = [densityKeywordsLogs.suggestion];
      break;
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

export const imageValidation = (images: ImageProps[], alt: boolean) => {
  const assessmentKey: string = imageLogs.assessments.assessmentKey;
  const assessmentLabel: string = imageLogs.assessments.assessmentLabel;
  let score: number = 3;
  let description: string = "";
  let scoreLabel: string = "";
  let suggestion: string[] = [];
  const extra: Record<string, any> = {};

  const isExistAlt = images.every((item) => item.alt);

  switch (true) {
    case images.length !== 0 && !alt:
      description = imageLogs.improveStatus;
      score = IMPROVE_SCORE;
      scoreLabel = imageLogs.assessments.scoreLabel.improve(assessmentLabel);
      suggestion = [imageLogs.suggestion.improveStatus];
      break;
    case images.length !== 0 && !isExistAlt:
      description = imageLogs.poorStatus;
      score = POOR_SCORE;
      scoreLabel = imageLogs.assessments.scoreLabel.poor(assessmentLabel);
      suggestion = [imageLogs.suggestion.poorStatus];
      break;
    case images.length !== 0 && isExistAlt && alt:
      description = imageLogs.goodStatus;
      score = GOOD_SCORE;
      scoreLabel = imageLogs.assessments.scoreLabel.good(assessmentLabel);
      break;
    default:
      description = imageLogs.poorInvalidImage;
      score = POOR_SCORE;
      scoreLabel = imageLogs.assessments.scoreLabel.poor(assessmentLabel);
      suggestion = [imageLogs.suggestion.poorInvalidImage];
      break;
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
