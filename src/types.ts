export type Node = {
  nodeType: number;
  tag?: string;
  attributes?: {
    src?: string;
    alt?: string;
    width?: string;
    height?: string;
    href?: string;
  };
  children?: Node[];
  nodeValue?: string;
};

export type OutRange = {
  outOfMinLength?: number;
  outOfMaxLength?: number;
};

export type DeepMergeProps = {
  lowercasedTitle: string;
  watchValueSlug: string;
  lowercasedMetaDescription: string;
  lowercasedKeywords: string;
  htmlToJsonData: Node;
  keywordsDensity: string;

  title: TitleProps;
  content: ContentProps;
  meta: MetaProps;
  densityKeyword: DensityPercentageProps;
};

export type ConfigConditions = {
  title: TitleProps;
  content: ContentProps;
  meta: MetaProps;
  densityKeyword: DensityPercentageProps;
};

export type TitleProps = {
  minLength: number;
  averageLength: number;
  maxLength: number;

  outRage?: OutRange
};

export type ContentProps = {
  minLength: number;
  maxLength: number;

  outRage?: OutRange
};

export type MetaProps = {
  minLength: number;
  improveLength: number;
  goodMinLength: number;
  goodMaxLength: number;
  maxLength: number;
};

export type DensityPercentageProps = {
  goodMinPercent: number;
  goodMaxPercent: number;
  improveMinPercent: number;
};

export interface JsonNode {
  nodeType: number;
  nodeValue?: string;
  tag?: string;
  attributes?: Record<string, string>;
  children?: JsonNode[];
}

export interface Heading {
  title: string;
  key: string;
  children?: Heading[];
}

export type TitleValidateProps = {
  length: number;
  existKeywordsInTitle: boolean;
  checkPositionKeyword: boolean | string;
};

export interface ValidateProps {
  titleResult: TitleExtractedProps;
  metaResult: MetaExtractedProps;
  isExistKeyword: boolean;
  isExistKeywordInSlug: boolean;
  isExistKeywordInAlt: boolean;
  contentLength: number;
  dataImageReturned: ImageProps[];
  keywordDensity: string;
}

interface TitleExtractedProps {
  titleLength: number;
  existKeywordInTile: boolean;
  checkPositionKeywordInTitle: boolean | string;
}

interface MetaExtractedProps {
  metaLength: number;
  isExistKeywordInMetaDescription: boolean;
}

export interface ImageProps {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
}
