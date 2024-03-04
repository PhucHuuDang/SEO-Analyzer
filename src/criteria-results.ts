import {
  contentLengthValidate,
  densityKeywordsValidate,
  existKeywordInMetaDescription,
  imageValidation,
  keywordValidation,
  metaValidation,
  titleValidate,
} from "./criteria-validate";
import { assessmentLevels } from "./default-conditions";
import { DeepMergeProps, TitleValidateProps, ValidateProps } from "./types";

export function seoLogsValidate(result: ValidateProps, data: DeepMergeProps) {
  const assessments: any[] = [];
  const titleValueReturned: TitleValidateProps = {
    length: result?.titleResult?.titleLength,
    existKeywordsInTitle: result?.titleResult?.existKeywordInTile,
    checkPositionKeyword: result?.titleResult?.checkPositionKeywordInTitle,
  };
  const { title, content, meta, densityKeyword } = data;

  const densityCasted = parseFloat(result?.keywordDensity);
  const contentLength = contentLengthValidate(result?.contentLength, content);
  const titleValidated = titleValidate(titleValueReturned, title);

  const keywordsResult = keywordValidation(result?.isExistKeyword);
  const metaResult = metaValidation(result?.metaResult.metaLength, meta);
  const isExistKeywordInMetaDescription = existKeywordInMetaDescription(
    result?.metaResult?.isExistKeywordInMetaDescription
  );
  const densityKeywordsResult = densityKeywordsValidate(
    densityCasted,
    densityKeyword
  );
  const imageResult = imageValidation(
    result?.dataImageReturned,
    result?.isExistKeywordInAlt
  );

  assessments.push(
    contentLength,
    titleValidated,
    keywordsResult,
    metaResult,
    isExistKeywordInMetaDescription,
    densityKeywordsResult,
    imageResult
  );

  const score = assessments.reduce((acc, cur) => {
    return acc + cur.score;
  }, 0);

  const overRall = (score: any) => {
    let scoreLabel = "";
    const { POOR, BASIC, GOOD, VERY_GOOD, EXCELLENT } = assessmentLevels;

    switch (true) {
      case score <= 23:
        scoreLabel = POOR;
        break;
      case score >= 23 && score <= 49:
        scoreLabel = BASIC;
        break;
      case score >= 50 && score <= 69:
        scoreLabel = GOOD;
        break;
      case score >= 70 && score <= 89:
        scoreLabel = VERY_GOOD;
        break;
      case score >= 90 && score <= 100:
        scoreLabel = EXCELLENT;
        break;
      default:
        break;
    }

    // if (score <= 23) {
    //   scoreLabel = "Bài viết đạt trạng thái TỆ";
    // } else if (score >= 23 && score <= 49) {
    //   scoreLabel = "Bài viết đạt trạng thái CƠ BẢN, cần cải thiện";
    // } else if (score >= 50 && score <= 69) {
    //   scoreLabel = "Bài viết đạt trạng thái TỐT";
    // } else if (score >= 70 && score <= 89) {
    //   scoreLabel = "Bài viết đạt trạng thái RẤT TỐT";
    // } else if (score >= 90 && score <= 100) {
    //   scoreLabel = "Bài viết đạt trạng thái XUẤT SẮC";
    // }

    return {
      score,
      scoreLabel,
    };
  };

  const analyzedResult = { assessments, overRall: overRall(score) };

  return analyzedResult;
}
