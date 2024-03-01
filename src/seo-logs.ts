export const score = {
  poor: 3,
  improve: 6,
  good: 10,
};

const generateAssessmentObject = (
  assessmentKey: string,
  assessmentLabel: string | any,
  scoreLabel: any,
  suggestion?: { [key: string]: string | number } | string[] | string
) => {
  return {
    assessmentKey,
    assessmentLabel,
    scoreLabel,
    suggestion,
  };
};

export const scoreLabel = {
  poor: (criteria: string) => `Tiêu chí ${criteria} đang ở mức tệ`,
  improve: (criteria: string) => `Tiêu chí ${criteria} Cần cải thiện`,
  good: (criteria: string) => `Tiêu chí ${criteria} đạt trạng thái tốt`,
};

export const contentLength = {
  assessments: generateAssessmentObject(
    "content_length",
    "Độ dài nội dung",
    scoreLabel,
    "Nội dung cần nằm trong khoảng 300-1200 từ để đạt tốt"
  ),

  suggestion: "Nội dung cần nằm trong khoảng 300-1200 từ để đạt tốt",

  poorShortContent: "Bài viết quá ngắn dưới 300 từ",
  poorLongContent: "Bài viết quá dài trên 1200 từ",
  goodStatus: "Bài viết của bạn đạt trạng thái tốt trong độ dài lý tưởng",
};

export const titleLogs = {
  assessments: generateAssessmentObject(
    "title_length",
    {
      titleLength: "Độ dài tiêu đề",
      existKeywordsInTitle: "Từ khoá chính",
      checkPositionKeywordInTitle: "Vị trí từ khoá chính",
    },
    scoreLabel
  ),

  scoreLabel: scoreLabel,

  suggestion: {
    titleLength: "Tiêu đề cần nằm trong khoảng 60-70 ký tự",
    existKeywordsInTitle: "Tiêu đề cần chứa từ khoá chính",
    checkPositionKeywordInTitle: "Từ khoá chính nên được đặt ở đầu tiêu đề",
  },

  poorLengthTitle: "Tiêu đề cần nằm trong khoảng 60-70 ký tự",
  poorExistedKeyWord: "Tiêu đề không chứa từ khoá chính",
  improveStatus: "Từ khoá chính nên được đặt ở đầu tiêu đề",
  goodStatus: (length: number) =>
    `Tiêu đề chứa từ khoá chính và có độ dài lý tưởng ${length}`,
};

export const keywordLogs = {
  assessments: generateAssessmentObject("keyword", "Từ khoá", scoreLabel),

  suggestion: {
    keyword: "Từ khoá chính nên xuất hiện trong tiêu đề và mô tả meta",
  },

  poorExistKeyWord: "Từ khoá chính không được xác định",
  goodStatus: "Từ khoá chính đã được xác định",
};

export const keywordExistInMeta = {
  assessments: generateAssessmentObject(
    "keyword_exist_in_meta",
    "Từ khoá chính trong mô tả meta",
    scoreLabel
  ),

  suggestion: "Từ khoá chính nên xuất hiện trong mô tả meta",

  keywordValid: "Mô tả meta chứa từ khoá chính",
  keywordInValid: "Mô tả meta không chứa từ khoá chính",
};

export const metaLogs = {
  assessments: generateAssessmentObject(
    "meta_length",
    "Mô tả meta",
    scoreLabel,
    "Mô tả meta cần nằm trong khoảng 150-160 từ để đạt tốt"
  ),

  poorShortLength: (length: number) =>
    `Mô tả meta (${length}) cần nằm trong khoảng 150-160 từ`,
  improveOutRangeLength: (length: number) =>
    `Cần cải thiện độ dài của mô tả meta, độ dài hiện tại ${length}`,
  improveInRangeLength: (length: number) =>
    `Mô tả meta cần trong khoảng 150-160 từ để đạt tốt, độ dài hiện tại là ${length}`,
  goodLength: (length: number) => `Mô tả meta có độ dài phù hợp ${length}`,
};

export const densityKeywordsLogs = {
  assessments: generateAssessmentObject(
    "density_keywords",
    "Tần suất sử dụng từ khoá",
    scoreLabel
  ),

  suggestion: "Tần suất sử dụng từ khoá cần nằm trong khoảng 2-3% để đạt tốt",

  poorStatus: (percent: number) => `Tần suất sử dụng từ khoá thấp ${percent}`,
  improveStatus: (percent: number) =>
    `Tuần suất sử dụng từ khoá là ${percent.toFixed(
      2
    )} cần nằm trong khoảng 2 đến 3%`,
  goodStatus: (percent: number) => `Tần suất sử dụng từ từ khoá tốt ${percent}`,
};

export const imageLogs = {
  assessments: generateAssessmentObject("image", "Image", scoreLabel),

  suggestion: {
    poorInvalidImage: "Bài viết này không có hình ảnh",
    poorStatus: "Một trong số image không có thẻ Alt, cần thêm thẻ alt",
    improveStatus: "Image cần bao gồm thẻ alt và chứ từ khoá chính",
    goodStatus: "Image bao gồm thẻ alt và chứ từ khoá chính",
  },

  poorInvalidImage: "Bài viết không có hình ảnh nào",
  poorStatus: "Một trong số image không có thẻ Alt",
  improveStatus: "Thẻ Alt không bao gồm từ khoá chính",
  goodStatus: "Image bao gồm thẻ alt và chứ từ khoá chính",
};
