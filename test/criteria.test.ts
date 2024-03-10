import { DensityPercentageProps } from "./../src/types";
import { dynamicConditions } from "./../src/default-conditions";
import {
  IMPROVE_SCORE,
  densityKeywordsValidate,
  existKeywordInMetaDescription,
  imageValidation,
  keywordValidation,
  metaValidation,
} from "../src/criteria-validate";

import {
  GOOD_SCORE,
  POOR_SCORE,
  contentLengthValidate,
  titleValidate,
} from "../src/criteria-validate";

import {
  contentLength,
  densityKeywordsLogs,
  imageLogs,
  keywordExistInMeta,
  keywordLogs,
  metaLogs,
  titleLogs,
} from "../src/seo-logs";
import { generateExpectedResult } from "../src/criteria-validate";

describe("testing for keywordValidation: ", () => {
  const assessmentKey: string = keywordLogs.assessments.assessmentKey;
  const assessmentLabel: string = keywordLogs.assessments.assessmentLabel;

  describe("expected and received of keywordValidation: ", () => {
    test("exist keyword", () => {
      const extra = {
        isExistKeywordInTitle: true,
      };
      expect(keywordValidation(true)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          keywordLogs.goodStatus,
          extra,
          GOOD_SCORE,
          keywordLogs.assessments.scoreLabel.good(assessmentLabel),
          []
        )
      );
    });

    test("not exist keyword", () => {
      const extra = {
        isExistKeywordInTitle: false,
      };
      expect(keywordValidation(false)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          keywordLogs.poorExistKeyWord,
          extra,
          POOR_SCORE,
          keywordLogs.assessments.scoreLabel.poor(assessmentLabel),
          [keywordLogs.suggestion.keyword]
        )
      );
    });
  });

  // exception case
  describe("exception cases of keywordValidation: ", () => {
    test("input string value", () => {
      expect(() => {
        // @ts-ignore
        keywordValidation("string input");
      }).toThrow();
    });

    test("input number value", () => {
      expect(() => {
        // @ts-ignore
        keywordValidation(123);
      }).toThrow();
    });

    test("input empty value", () => {
      expect(() => {
        // @ts-ignore
        keywordValidation();
      }).toThrow();
    });

    test("input null value", () => {
      expect(() => {
        // @ts-ignore
        keywordValidation(null);
      }).toThrow();
    });

    test("input undefined value", () => {
      expect(() => {
        // @ts-ignore
        keywordValidation(undefined);
      }).toThrow();
    });
  });
});

describe("testing function analyze the length of content criteria: ", () => {
  const assessmentKeyObj = contentLength.assessments;
  // common variable
  const assessmentKey: string = assessmentKeyObj.assessmentKey;
  const assessmentLabel: string = assessmentKeyObj.assessmentLabel;
  let suggestion: string[] = [];
  // limit of content
  const content = {
    minLength: 300,
    maxLength: 1200,
  };

  const outRage = {
    outOfMinLength: 299,
    outOfMaxLength: 1201,
  };

  describe("expected and received of contentLengthValidate: ", () => {
    test("input min length of case greater or equal min length and smaller or equal max length", () => {
      const minLength = content.minLength;
      // expect(contentLengthValidate(content.minLength, content)).toBe(true);
      expect(contentLengthValidate(minLength, content)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          contentLength.goodStatus,
          { titleLength: minLength },
          GOOD_SCORE,
          assessmentKeyObj.scoreLabel.good(assessmentLabel) as string,
          suggestion
        )
      );
    });

    test("input max length of case greater or equal min length and smaller or equal max length", () => {
      const maxLength = content.maxLength;

      // expect(contentLengthValidate(content.minLength, content)).toBe(true);
      expect(contentLengthValidate(maxLength, content)).toMatchObject(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          contentLength.goodStatus,
          { titleLength: maxLength },
          GOOD_SCORE,
          assessmentKeyObj.scoreLabel.good(assessmentLabel) as string,
          suggestion
        )
      );
    });

    test("the case out of max range content when length over the limit max length", () => {
      const outOfNMaxRange = outRage.outOfMaxLength;

      const assessmentKeyObj = contentLength.assessments;
      const assessmentLabel: string = assessmentKeyObj.assessmentLabel;

      expect(contentLengthValidate(outOfNMaxRange, content)).toMatchObject(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          contentLength.poorLongContent,
          { titleLength: outOfNMaxRange },
          POOR_SCORE,
          assessmentKeyObj.scoreLabel.poor(assessmentLabel) as string,
          [contentLength.suggestion]
        )
      );
    });

    test("the case out of min range content when length over the limit min length", () => {
      const outOfMinRange = outRage.outOfMinLength;
      const assessmentKeyObj = contentLength.assessments;

      expect(contentLengthValidate(outOfMinRange, content)).toMatchObject(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          contentLength.poorShortContent,
          { titleLength: outOfMinRange },
          POOR_SCORE,
          assessmentKeyObj.scoreLabel.poor(assessmentLabel) as string,
          [contentLength.suggestion]
        )
      );
    });
  });

  // exception cases of contentLengthValidate
  describe("exception cases of contentLengthValidate: ", () => {
    test("input string value", () => {
      expect(() => {
        // @ts-ignore
        contentLengthValidate("string input", content);
      }).toThrow();
    });

    test("input wrong data type for 2nd params of function contentLengthValue", () => {
      expect(() => {
        // @ts-ignore
        contentLengthValidate(123, 123);
      }).toThrow();
    });

    test("input empty value", () => {
      expect(() => {
        // @ts-ignore
        contentLengthValidate();
      }).toThrow();
    });

    test("input length negative number", () => {
      expect(() => {
        contentLengthValidate(-1, content);
      }).toThrow();
    });

    test("input negative number for content", () => {
      const content = {
        minLength: -300,
        maxLength: -1200,
      };

      expect(() => {
        contentLengthValidate(300, content);
      }).toThrow();
    });

    test('input "null" value for 2nd params', () => {
      expect(() => {
        // @ts-ignore
        contentLengthValidate(300, null);
      }).toThrow();
    });

    test("input empty object param", () => {
      expect(() => {
        // @ts-ignore
        contentLengthValidate(300, {});
      }).toThrow();
    });

    test("input undefined for content", () => {
      expect(() => {
        // @ts-ignore
        contentLengthValidate(300, undefined);
      }).toThrow();
    });
  });
});

describe("testing for titleValidate", () => {
  const titleLimits = {
    minLength: 50,
    averageLength: 60,
    maxLength: 70,
  };

  const assessmentLabelObj = titleLogs.assessments.assessmentLabel;
  const assessmentKey: string = titleLogs.assessments.assessmentKey;
  const assessmentLabel = titleLogs.assessments.assessmentLabel;

  const scoreLabelObj = titleLogs.scoreLabel;

  const titleValuesReturned = (
    length: number,
    existKeywordsInTitle: boolean,
    checkPositionKeyword: boolean
  ) => {
    return {
      length,
      existKeywordsInTitle,
      checkPositionKeyword,
    };
  };

  const extraValuesReturned = (
    titleValueReturned: number,
    existKeywordsInTitle: boolean,
    checkPositionKeyword: boolean
  ) => {
    return {
      titleValueReturned: titleValueReturned,
      existKeywordsInTitle: existKeywordsInTitle,
      checkPositionKeyword: checkPositionKeyword,
    };
  };

  describe("expected and received of titleValidate: ", () => {
    test("case in range of minlength when length equal min length", () => {
      const titleValues = titleValuesReturned(50, true, true);
      const extra = extraValuesReturned(
        titleValues.length,
        titleValues.existKeywordsInTitle,
        titleValues.checkPositionKeyword
      );

      expect(titleValidate(titleValues, titleLimits)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel.titleLength,
          titleLogs.goodStatus(titleValues.length),
          extra,
          GOOD_SCORE,
          scoreLabelObj.good(assessmentLabelObj.titleLength),
          []
        )
      );
    });

    test("is keyword exist first in title", () => {
      const titleValues = titleValuesReturned(50, true, false);

      const extra = extraValuesReturned(
        titleValues.length,
        titleValues.existKeywordsInTitle,
        titleValues.checkPositionKeyword
      );

      expect(titleValidate(titleValues, titleLimits)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel.checkPositionKeywordInTitle,
          titleLogs.improveStatus,
          extra,
          IMPROVE_SCORE,
          scoreLabelObj.improve(
            assessmentLabelObj?.checkPositionKeywordInTitle
          ),
          []
        )
      );
    });

    test("is exist keyword in title", () => {
      const titleValues = titleValuesReturned(50, false, true);

      const extra = extraValuesReturned(
        titleValues.length,
        titleValues.existKeywordsInTitle,
        titleValues.checkPositionKeyword
      );

      expect(titleValidate(titleValues, titleLimits)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel.existKeywordsInTitle,
          titleLogs.poorExistedKeyWord,
          extra,
          POOR_SCORE,
          scoreLabelObj.poor(assessmentLabelObj.existKeywordsInTitle),
          [titleLogs.suggestion.existKeywordsInTitle]
        )
      );
    });

    test("length smaller than min length", () => {
      const titleValues = titleValuesReturned(49, true, true);

      const extra = extraValuesReturned(
        titleValues.length,
        titleValues.existKeywordsInTitle,
        titleValues.checkPositionKeyword
      );

      expect(titleValidate(titleValues, titleLimits)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel.titleLength,
          titleLogs.poorLengthTitle,
          extra,
          POOR_SCORE,
          scoreLabelObj.poor(assessmentLabelObj.titleLength),
          [titleLogs.suggestion.titleLength]
        )
      );
    });

    test("length greater than max length", () => {
      const titleValues = titleValuesReturned(100, true, true);

      const extra = extraValuesReturned(
        titleValues.length,
        titleValues.existKeywordsInTitle,
        titleValues.checkPositionKeyword
      );

      expect(titleValidate(titleValues, titleLimits)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel.titleLength,
          titleLogs.poorLengthTitle,
          extra,
          POOR_SCORE,
          scoreLabelObj.poor(assessmentLabelObj.titleLength),
          [titleLogs.suggestion.titleLength]
        )
      );
    });

    test("all of conditions wrong", () => {
      const titleValues = titleValuesReturned(100, false, false);

      const extra = extraValuesReturned(
        titleValues.length,
        titleValues.existKeywordsInTitle,
        titleValues.checkPositionKeyword
      );

      expect(titleValidate(titleValues, titleLimits)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel.titleLength,
          titleLogs.poorLengthTitle,
          extra,
          POOR_SCORE,
          scoreLabelObj.poor(assessmentLabelObj.titleLength),
          [titleLogs.suggestion.titleLength]
        )
      );
    });
  });

  // exception case
  describe("exception cases of title", () => {
    test("input empty value", () => {
      expect(() => {
        // @ts-ignore
        titleValidate();
      }).toThrow();
    });

    test("input titleLimits missing or undefined", () => {
      const titleValues = titleValuesReturned(50, true, true);

      expect(() => {
        // @ts-ignore
        titleValidate(titleValues);
      }).toThrow();
    });

    test("input wrong params data type expected of this function", () => {
      expect(() => {
        // @ts-ignore
        titleValidate(9, 9);
      }).toThrow();
    });

    test("missing one of the two params", () => {
      expect(() => {
        // @ts-ignore
        titleValidate(9);
      }).toThrow();
    });

    test("passing value negative title conditions", () => {
      const titleConditions = {
        minLength: -1,
        averageLength: -1,
        maxLength: -1,
      };

      const titleValues = titleValuesReturned(50, true, true);

      expect(() => {
        titleValidate(titleValues, titleConditions);
      }).toThrow();
    });

    test("passing wrong data type for param titleValuesReturned", () => {
      const titleValuesReturned = {
        length: "dang",
        existKeywordsInTitle: "9",
        checkPositionKeyword: 9,
      };

      expect(() => {
        // @ts-ignore
        titleValidate(titleValuesReturned, titleLimits);
      }).toThrow();
    });

    test("passing wrong data type for param titleConditions", () => {
      const titleConditions = {
        minLength: "dang",
        averageLength: "9",
        maxLength: 9,
      };

      const titleValues = titleValuesReturned(50, true, true);

      expect(() => {
        // @ts-ignore
        titleValidate(titleValues, titleConditions);
      }).toThrow();
    });

    test("first params not an object", () => {
      expect(() => {
        // @ts-ignore
        titleValidate(9, titleLimits);
      }).toThrow();
    });

    test("input titleValueReturned missing or undefined", () => {
      expect(() => {
        // @ts-ignore
        titleValidate(undefined, titleLimits);
      }).toThrow();
    });

    test("input titleLimits missing or undefined", () => {
      expect(() => {
        // @ts-ignore
        titleValidate(9, undefined);
      }).toThrow();
    });

    test("input titleValueReturned not an object", () => {
      expect(() => {
        // @ts-ignore
        titleValidate(50, titleLimits);
      }).toThrow();
    });

    test("input titleLimits not an object", () => {
      const titleValues = titleValuesReturned(50, true, true);

      expect(() => {
        // @ts-ignore
        titleValidate(titleValues, []);
      }).toThrow();
    });
  });
});

// test META
describe("analyze testing meta criteria: ", () => {
  const metaLimits = {
    minLength: 120,
    improveLength: 140,
    goodMinLength: 150,
    goodMaxLength: 160,
    maxLength: 170,
  };

  const assessmentKeyObj = metaLogs.assessments;
  const scoreLabelObj = assessmentKeyObj.scoreLabel;

  const assessmentKey: string = assessmentKeyObj.assessmentKey;
  const assessmentLabel: string = assessmentKeyObj.assessmentLabel;

  describe("expected and received of metaValidation: ", () => {
    test("case smaller or equal min length", () => {
      const metaLength = 120;

      const extra = {
        metaLength: metaLength,
      };
      expect(metaValidation(metaLength, metaLimits)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          metaLogs.poorShortLength(metaLength),
          extra,
          POOR_SCORE,
          scoreLabelObj.poor(assessmentLabel),
          [assessmentKeyObj.suggestion as string]
        )
      );
    });

    test("case of over max length ", () => {
      const metaLength = 180;

      const extra = {
        metaLength: metaLength,
      };
      expect(metaValidation(metaLength, metaLimits)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          metaLogs.poorShortLength(metaLength),
          extra,
          POOR_SCORE,
          scoreLabelObj.poor(assessmentLabel),
          [assessmentKeyObj.suggestion as string]
        )
      );
    });
    test("case in range of improve length when length equal improve length", () => {
      const metaLength = 140;

      const extra = {
        metaLength: metaLength,
      };

      expect(metaValidation(metaLength, metaLimits)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          metaLogs.improveInRangeLength(metaLength),
          extra,
          IMPROVE_SCORE,
          scoreLabelObj.improve(assessmentLabel),
          [assessmentKeyObj.suggestion as string]
        )
      );
    });

    test("case greater or equal good max length and smaller or equal max length", () => {
      const metaLength = 165;

      const extra = {
        metaLength: metaLength,
      };

      expect(metaValidation(metaLength, metaLimits)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          metaLogs.improveOutRangeLength(metaLength),
          extra,
          IMPROVE_SCORE,
          scoreLabelObj.improve(assessmentLabel),
          [assessmentKeyObj.suggestion as string]
        )
      );
    });

    test("case in range of good length when length greater or equal good length", () => {
      const metaLength = 150;

      const extra = {
        metaLength: metaLength,
      };

      expect(metaValidation(metaLength, metaLimits)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          metaLogs.goodLength(metaLength),
          extra,
          GOOD_SCORE,
          scoreLabelObj.good(assessmentLabel),
          []
        )
      );
    });

    test("case in range of good length when length greater or equal good length", () => {
      const metaLength = 155;

      const extra = {
        metaLength: metaLength,
      };

      expect(metaValidation(metaLength, metaLimits)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          metaLogs.goodLength(metaLength),
          extra,
          GOOD_SCORE,
          scoreLabelObj.good(assessmentLabel),
          []
        )
      );
    });

    // missed cases
    test("case equal to min length", () => {
      const metaLength = 120;

      const extra = {
        metaLength: metaLength,
      };

      expect(metaValidation(metaLength, metaLimits)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          metaLogs.poorShortLength(metaLength),
          extra,
          POOR_SCORE,
          scoreLabelObj.poor(assessmentLabel),
          [assessmentKeyObj.suggestion as string]
        )
      );
    });

    test("case equal to max length", () => {
      const metaLength = 170;

      const extra = {
        metaLength: metaLength,
      };

      expect(metaValidation(metaLength, metaLimits)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          metaLogs.improveOutRangeLength(metaLength),
          extra,
          IMPROVE_SCORE,
          scoreLabelObj.improve(assessmentLabel),
          [assessmentKeyObj.suggestion as string]
        )
      );
    });
  });

  // case exception META

  describe("exception cases of meta", () => {
    test("input empty value", () => {
      expect(() => {
        // @ts-expect-error
        metaValidation();
      }).toThrow();
    });

    test("case passing a param", () => {
      expect(() => {
        // @ts-ignore
        metaValidation(12);
      }).toThrow();
    });

    test("case passing a string value", () => {
      expect(() => {
        // @ts-ignore
        metaValidation("string", metaLimits);
      }).toThrow();
    });

    test("2nd params have other data type", () => {
      expect(() => {
        // @ts-ignore
        metaValidation(12, 12);
      }).toThrow();
    });

    test("2nd object param have over length fields", () => {
      const valuesLimited = {
        minLength: 120,
        improveLength: 140,
        goodMinLength: 150,
        goodMaxLength: 160,
        maxLength: 170,
        extraLength: 1,
      };
      expect(() => {
        metaValidation(12, valuesLimited);
      }).toThrow();
    });

    test("not allowed pass negative number", () => {
      expect(() => {
        metaValidation(-12, metaLimits);
      });
    });

    test("not allowed pass negative number", () => {
      const valuesLimited = {
        minLength: -120,
        improveLength: -140,
        goodMinLength: -150,
        goodMaxLength: -160,
        maxLength: -170,
      };

      expect(() => {
        metaValidation(9, valuesLimited);
      });
    });
  });
});

describe("testing for existKeywordInMetaDescription", () => {
  const assessmentKey: string = keywordExistInMeta.assessments.assessmentKey;
  const assessmentLabel: string =
    keywordExistInMeta.assessments.assessmentLabel;

  describe("expected and received of existKeywordInMetaDescription", () => {
    test(" exist exist keyword in meta description", () => {
      const extra: Record<string, any> = {
        isExistKeywordInMeta: true,
      };
      expect(existKeywordInMetaDescription(true)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          keywordExistInMeta.keywordValid,
          extra,
          GOOD_SCORE,
          keywordExistInMeta.assessments.scoreLabel.good(assessmentLabel),
          []
        )
      );
    });

    test(" not exist keyword in meta description", () => {
      const extra: Record<string, any> = {
        isExistKeywordInMeta: false,
      };
      expect(existKeywordInMetaDescription(false)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          keywordExistInMeta.keywordInValid,
          extra,
          IMPROVE_SCORE,
          metaLogs.assessments.scoreLabel.improve(assessmentLabel),
          [keywordExistInMeta.suggestion]
        )
      );
    });
  });

  // exceptions case

  describe("exception cases of existKeywordInMetaDescription", () => {
    test("input string value !== params type that was defined", () => {
      expect(() => {
        // @ts-ignore
        existKeywordInMetaDescription("string input");
      }).toThrow();
    });

    test("input number value !== params type that was defined", () => {
      expect(() => {
        // @ts-ignore
        existKeywordInMetaDescription(123);
      }).toThrow();
    });

    test("input empty value", () => {
      expect(() => {
        // @ts-ignore
        existKeywordInMetaDescription();
      }).toThrow();
    });

    // missed case

    test("value is undefined", () => {
      expect(() => {
        //@ts-ignore
        existKeywordInMetaDescription(undefined);
      }).toThrow();
    });

    test("value is null", () => {
      expect(() => {
        //@ts-ignore
        existKeywordInMetaDescription(null);
      }).toThrow();
    });
  });
});

describe("testing for densityKeywordsValidate", () => {
  const assessmentObj = densityKeywordsLogs.assessments;

  const assessmentKey: string = assessmentObj.assessmentKey;
  const assessmentLabel: string = assessmentObj.assessmentLabel;

  const densityKeywordsPercentsLimited: DensityPercentageProps = {
    goodMinPercent: 2,
    goodMaxPercent: 3,
    improveMinPercent: 1.8,
  };

  describe("expected and received of densityKeywordsValidate", () => {
    test("case in range of good min percent when percent greater or equal good min percent", () => {
      const minPercent = 2;
      const extra = {
        densityKeywords: minPercent,
      };

      expect(
        densityKeywordsValidate(minPercent, densityKeywordsPercentsLimited)
      ).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          densityKeywordsLogs.goodStatus(minPercent),
          extra,
          GOOD_SCORE,
          assessmentObj.scoreLabel.good(assessmentLabel),
          []
        )
      );
    });

    test("case in range of good max percent when percent greater or equal good max percent", () => {
      const maxPercent = 3;
      const extra = {
        densityKeywords: maxPercent,
      };

      expect(
        densityKeywordsValidate(maxPercent, densityKeywordsPercentsLimited)
      ).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          densityKeywordsLogs.goodStatus(maxPercent),
          extra,
          GOOD_SCORE,
          assessmentObj.scoreLabel.good(assessmentLabel),
          []
        )
      );
    });

    test("case in range of improve min percent when percent greater or equal improve min percent", () => {
      const minPercent = 1.8;
      const extra = {
        densityKeywords: minPercent,
      };

      expect(
        densityKeywordsValidate(minPercent, densityKeywordsPercentsLimited)
      ).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          densityKeywordsLogs.improveStatus(minPercent),
          extra,
          IMPROVE_SCORE,
          assessmentObj.scoreLabel.improve(assessmentLabel),
          [densityKeywordsLogs.suggestion]
        )
      );
    });

    test("out of min range limits percent", () => {
      const outOfMinPercent = 1;
      const extra = {
        densityKeywords: outOfMinPercent,
      };

      expect(
        densityKeywordsValidate(outOfMinPercent, densityKeywordsPercentsLimited)
      ).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          densityKeywordsLogs.poorStatus(outOfMinPercent),
          extra,
          IMPROVE_SCORE,
          assessmentObj.scoreLabel.improve(assessmentLabel),
          [densityKeywordsLogs.suggestion]
        )
      );
    });

    test("out of max range limits percent", () => {
      const outOfMaxPercent = 4;
      const extra = {
        densityKeywords: outOfMaxPercent,
      };

      expect(
        densityKeywordsValidate(outOfMaxPercent, densityKeywordsPercentsLimited)
      ).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          densityKeywordsLogs.improveStatus(outOfMaxPercent),
          extra,
          IMPROVE_SCORE,
          assessmentObj.scoreLabel.improve(assessmentLabel),
          [densityKeywordsLogs.suggestion]
        )
      );
    });

    test("out of max range limits percent", () => {
      const outOfMaxRange = 4;
      const extra = {
        densityKeywords: outOfMaxRange,
      };

      expect(
        densityKeywordsValidate(outOfMaxRange, densityKeywordsPercentsLimited)
      ).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          densityKeywordsLogs.improveStatus(outOfMaxRange),
          extra,
          IMPROVE_SCORE,
          assessmentObj.scoreLabel.improve(assessmentLabel),
          [densityKeywordsLogs.suggestion]
        )
      );
    });
  });

  // exception case
  describe("exception cases of densityKeywordsValidate", () => {
    test("input a string to first param", () => {
      expect(() => {
        densityKeywordsValidate(
          // @ts-ignore
          "string input",
          densityKeywordsPercentsLimited
        );
      }).toThrow();
    });

    test("pass more than 3 values for 2nd param", () => {
      const densityKeywordPercentsLimited = {
        goodMinPercent: 2,
        goodMaxPercent: 3,
        improveMinPercent: 1.8,
        extraFields: 1,
      };

      expect(() => {
        densityKeywordsValidate(10, densityKeywordPercentsLimited);
      }).toThrow();
    });

    test("input empty object for one or two params", () => {
      expect(() => {
        // @ts-ignore
        densityKeywordsValidate();
      }).toThrow();
    });

    test("input for 2nd params wrong value that expected", () => {
      expect(() => {
        // @ts-ignore
        densityKeywordsValidate(10, 1);
      }).toThrow();
    });

    test("input density percent negative", () => {
      expect(() => {
        densityKeywordsValidate(-1, densityKeywordsPercentsLimited);
      }).toThrow();
    });

    test("test case negative number of densityKeywordsPercentsLimited", () => {
      expect(() => {
        const densityKeywordsPercentsLimitedNegative = {
          goodMinPercent: -2,
          goodMaxPercent: -3,
          improveMinPercent: -1.8,
        };
        densityKeywordsValidate(10, densityKeywordsPercentsLimitedNegative);
      });
    });

    test("input density percent negative", () => {
      expect(() => {
        densityKeywordsValidate(-1, densityKeywordsPercentsLimited);
      }).toThrow();
    });
  });
});

describe("testing for function imageValidation: ", () => {
  const assessmentKey: string = imageLogs.assessments.assessmentKey;
  const assessmentLabel: string = imageLogs.assessments.assessmentLabel;

  const images = [
    {
      src: "https://www.google.com.vn/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
      alt: "Google logo",
      width: 272,
      height: 92,
    },
  ];

  const extra: Record<string, any> = {};

  describe("expected and received of imageValidation", () => {
    test("array images length !== 0 and alt existed", () => {
      expect(imageValidation(images, false)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          imageLogs.improveStatus,
          extra,
          IMPROVE_SCORE,
          imageLogs.assessments.scoreLabel.improve(assessmentLabel),
          [imageLogs.suggestion.improveStatus]
        )
      );
    });

    test("array with one image", () => {
      const imagesWithOneImage = [
        {
          src: "https://www.google.com.vn/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
          alt: "Google logo",
          width: 272,
          height: 92,
        },
      ];

      expect(imageValidation(imagesWithOneImage, true)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          imageLogs.goodStatus,
          extra,
          GOOD_SCORE,
          imageLogs.assessments.scoreLabel.good(assessmentLabel),
          []
        )
      );
    });

    test("array images length !== 0 and one of array images are checked the alt not exist", () => {
      const imagesWithoutAlt = [
        {
          src: "https://www.google.com.vn/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
          width: 272,
          height: 92,
        },
      ];
      expect(imageValidation(imagesWithoutAlt, true)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          imageLogs.poorStatus,
          extra,
          POOR_SCORE,
          imageLogs.assessments.scoreLabel.poor(assessmentLabel),
          [imageLogs.suggestion.poorStatus]
        )
      );
    });

    test("array images length !== 0 and the alt exist in all of images", () => {
      expect(imageValidation(images, true)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          imageLogs.goodStatus,
          extra,
          GOOD_SCORE,
          imageLogs.assessments.scoreLabel.good(assessmentLabel),
          []
        )
      );
    });

    test("array images length === 0", () => {
      expect(imageValidation([], true)).toEqual(
        generateExpectedResult(
          assessmentKey,
          assessmentLabel,
          imageLogs.poorInvalidImage,
          extra,
          POOR_SCORE,
          imageLogs.assessments.scoreLabel.poor(assessmentLabel),
          [imageLogs.suggestion.poorInvalidImage]
        )
      );
    });
  });

  describe("exception cases of imageValidation", () => {
    test("input empty param for function imageValidation", () => {
      expect(() => {
        // @ts-ignore
        imageValidation();
      }).toThrow();
    });

    test("images params is passed null value", () => {
      expect(() => {
        // @ts-ignore
        imageValidation(null, true);
      }).toThrow();
    });

    test("null and undefined for 2 params", () => {
      expect(() => {
        // @ts-ignore
        imageValidation(null, undefined);
      }).toThrow();
    });

    test("undefined and null for 2 params", () => {
      expect(() => {
        // @ts-ignore
        imageValidation(undefined, null);
      }).toThrow();
    });

    test("isExistKeywordInAlt param is passed null value", () => {
      expect(() => {
        // @ts-ignore
        imageValidation(images, null);
      }).toThrow();
    });

    test("pass images params not type of array", () => {
      expect(() => {
        // @ts-ignore
        imageValidation("string input", true);
      }).toThrow();
    });

    test("value of images array is not object data type", () => {
      expect(() => {
        // @ts-ignore
        imageValidation(["string input"], true);
      }).toThrow();
    });
    test("pass second param not type of boolean test to push ", () => {
      expect(() => {
        // @ts-ignore
        imageValidation(images, "string input");
      }).toThrow();
    });
  });
});
