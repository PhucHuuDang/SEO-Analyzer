import {
  GOOD_SCORE,
  POOR_SCORE,
  contentLengthValidate,
} from "../src/criteria-validate";
import { contentLength } from "../src/seo-logs";
import { generateExpectedResult } from "../src/criteria-validate";
import { dynamicConditions } from "../src/default-conditions";

describe("check the length of content criteria", () => {
  const assessmentKeyObj = contentLength.assessments;

  // common variable
  const assessmentKey: string = assessmentKeyObj.assessmentKey;
  const assessmentLabel: string = assessmentKeyObj.assessmentLabel;
  let suggestion: string[] = [];

  test("case in range of minlength when length equal min length", () => {
    const minLength = dynamicConditions.content.minLength;

    // expect(contentLengthValidate(content.minLength, content)).toBe(true);
    expect(contentLengthValidate(minLength, dynamicConditions.content)).toEqual(
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

  test("the case in range of max length when length smaller or equal max length", () => {
    const maxLength = dynamicConditions.content.maxLength;

    // expect(contentLengthValidate(content.minLength, content)).toBe(true);
    expect(
      contentLengthValidate(maxLength, dynamicConditions.content)
    ).toMatchObject(
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
    const outOfNMaxRange = dynamicConditions.content?.outRage?.outOfMaxLength!;

    const assessmentKeyObj = contentLength.assessments;
    const assessmentLabel: string = assessmentKeyObj.assessmentLabel;

    expect(
      contentLengthValidate(outOfNMaxRange, dynamicConditions.content)
    ).toMatchObject(
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

  test("the case out of min range content when length over the limit max length", () => {
    const content = {
      minLength: 300,
      maxLength: 1200,
    };

    const outOfMinRange = dynamicConditions.content?.outRage?.outOfMinLength!;

    const assessmentKeyObj = contentLength.assessments;
    const assessmentLabel: string = assessmentKeyObj.assessmentLabel;

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
