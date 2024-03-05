import { seoLogsValidate } from "./criteria-results";
import {
  dynamicConditions,
  originalCondition,
  setDefaultCondition,
} from "./default-conditions";
import { deepMerge } from "./merge-objects";
import { htmlToText } from "./transform";
import {
  ConfigConditions,
  DeepMergeProps,
  ImageProps,
  Node,
  ValidateProps,
} from "./types";

// export let storedConfig: ConfigConditions = dynamicConditions;
export class CmsSEOChecker {
  private static totalContent: string = "";
  static altText: any[] = [];

  public static setContent(content: string) {
    this.totalContent = content;
  }

  public static getContent() {
    return this.totalContent;
  }

  private static extractImageAttributes(
    node: Node
  ): { src?: string; alt?: string; width?: string; height?: string }[] {
    const result: {
      src?: string;
      alt?: string;
      width?: string;
      height?: string;
    }[] = [];

    if (node.attributes?.src) {
      const { src, alt, width, height } = node.attributes;
      result.push({ src, alt, width, height });
    }

    if (node.children && node.children.length > 0) {
      for (const childNode of node.children) {
        const childResults = this.extractImageAttributes(childNode);
        result.push(...childResults);
      }
    }

    return result;
  }

  public static getData(
    data: any
    // ): { src?: string; alt?: string; width?: string; height?: string }[] {
  ): ImageProps[] {
    const valueReturned: any[] = [];
    if (Array.isArray(data)) {
      // get info image
      const result = data.map((value) => this.extractImageAttributes(value));
      const flatArray = result.filter(
        (subarray) => Object.keys(subarray).length > 0
      );

      valueReturned.push(...flatArray.flat());
      valueReturned.map((value) => value.alt && this.altText?.push(value.alt));

      return valueReturned;
    } else {
      return [];
    }
  }

  private static removeDiacritics(text: string) {
    return text
      .toLowerCase()
      .normalize("NFC")
      .replace(/[\u0300-\u036f]/g, "");
  }

  private static countWords(str: string) {
    const trimStr = str.trim();
    if (trimStr === "") {
      return 0;
    }
    const wordsArray = trimStr.split(/\s+/);
    const nonEmptyWordsArray = wordsArray.filter((word) => word !== "");

    return nonEmptyWordsArray.length;
  }

  private static processItem(item: Node) {
    if (item && item.nodeValue) {
      const result = htmlToText(item.nodeValue);

      return result;
    } else if (item && "children" in item && Array.isArray(item.children)) {
      const childrenResult: string[] = item.children.map((childItem) =>
        this.processItem(childItem)
      );

      return childrenResult.join("");
    }

    return "";
  }

  private static lengthChecked(data: any) {
    let parentTotalString: string = "";

    // let childrenTotalString: string = ''
    // console.log(data)

    if (Array.isArray(data)) {
      data.forEach((item: any) => {
        const result = this.processItem(item);
        parentTotalString = parentTotalString.concat(result);
      });
    }
    const totalWords = this.countWords(parentTotalString);

    this.setContent(parentTotalString);

    return totalWords;
  }

  private static keywordDensity(keyword: string) {
    if (!keyword) {
      return;
    }

    const normalizedKeywordsDensity = this.removeDiacritics(keyword);

    const content = this.getContent();
    const lowercasedText = content.toLowerCase();
    const keywordOccurrences = (
      lowercasedText.match(
        new RegExp(normalizedKeywordsDensity.toLowerCase(), "g")
      ) || []
    ).length;
    const totalWords = lowercasedText.split(/\s+/).length;
    const density = ((keywordOccurrences / totalWords) * 100).toFixed(2);

    return density;
  }

  private static loopData(data: any) {
    let dataReturned: any = [];
    for (const [_, value] of Object.entries(data)) {
      dataReturned = value;
    }

    return dataReturned;
  }

  private static titleTransformed(title: string, keyword: string) {
    const getTitle = this.removeDiacritics(title);
    const existKeywordInTile = getTitle.includes(keyword);

    const titleLength = getTitle.length;
    const checkPositionKeywordInTitle = keyword
      ? getTitle.startsWith(keyword)
      : "";

    return { titleLength, existKeywordInTile, checkPositionKeywordInTitle };
  }

  private static metaDescriptionTransformed(
    metaDescription: string,
    keyword: string
  ) {
    const getMetaDescription = this.removeDiacritics(metaDescription);

    const metaLength = this.countWords(getMetaDescription);
    const isExistKeywordInMetaDescription =
      getMetaDescription.includes(keyword);

    return {
      metaLength,
      isExistKeywordInMetaDescription,
    };
  }

  private static isKeywordInSlug(slug: string, keyword: string) {
    const isExistKeywordInSlug = slug?.includes(keyword);

    return isExistKeywordInSlug;
  }

  private static altTextValidation(altText: any[], keyword: string) {
    const isExistKeywordInAlt = altText?.includes(keyword);

    return isExistKeywordInAlt;
  }

  private static isExistKeyword(keyword: string) {
    if (keyword.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  public static analysis(data: any, config?: any) {
    if (config) {
      // dynamicConditions = config;
      setDefaultCondition(config);
    } else {
      setDefaultCondition(originalCondition);
    }

    const mergeObjParams: DeepMergeProps = deepMerge(data, dynamicConditions);

    if (!mergeObjParams) {
      return null;
    }

    const {
      lowercasedTitle,
      watchValueSlug,
      lowercasedMetaDescription,
      lowercasedKeywords,
      htmlToJsonData,
      keywordsDensity,
    } = mergeObjParams;

    const dataReturned = this.loopData(htmlToJsonData);

    const normalizedKeyword = this.removeDiacritics(lowercasedKeywords ?? "");
    const titleResult = this.titleTransformed(
      lowercasedTitle,
      normalizedKeyword
    );
    const contentLength = this.lengthChecked(dataReturned);
    const dataImageReturned = this.getData(dataReturned);
    const metaResult = this.metaDescriptionTransformed(
      lowercasedMetaDescription,
      normalizedKeyword
    );

    const isExistKeyword = this.isExistKeyword(normalizedKeyword)!;
    const isExistKeywordInSlug = this.isKeywordInSlug(
      watchValueSlug,
      normalizedKeyword
    );
    const isExistKeywordInAlt = this.altTextValidation(
      this.altText,
      normalizedKeyword
    );

    const keywordDensity = this.keywordDensity(keywordsDensity!) ?? "0";

    const valueReturned: ValidateProps = {
      titleResult,
      metaResult,
      isExistKeyword,
      isExistKeywordInSlug,
      isExistKeywordInAlt,
      contentLength,
      dataImageReturned,
      keywordDensity,
    };

    const resultValidated = seoLogsValidate(valueReturned, mergeObjParams);

    return resultValidated;
  }
}

// export { storedConfig };

// module.exports = CmsSEOChecker;
