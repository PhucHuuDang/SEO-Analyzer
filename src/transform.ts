import { get } from "lodash-es";
import _isEmpty from "lodash-es/isEmpty";
import { JsonNode } from "./types";

export const toArray = <T = any>(data?: T | T[]): T[] => {
  if (!data) {
    return [];
  }

  return Array.isArray(data) ? data : [data];
};

export const getNestedChildren = (
  data: any[],
  parentId: number | null,
  parentFieldKey: string,
  transform?: (item: any) => any
): any[] => {
  const out: any = [];

  for (const i in data) {
    const itemParentId = get(data[i], parentFieldKey) ?? null;
    if (itemParentId === parentId) {
      const children = getNestedChildren(
        data,
        data[i].id,
        parentFieldKey,
        transform
      );

      const dataPush: any = transform
        ? transform(data[i])
        : {
            ...data[i],
          };

      if (children.length) {
        dataPush.children = children;
      }

      out.push(dataPush);
    }
  }

  return out;
};

export const toSlug = (str: string): string =>
  str
    .toLowerCase()
    .normalize("NFD") // chuyển về dạng tổ hợp
    .replace(/[\u0300-\u036f]/g, "") // xóa các ký tự dấu tổ hợp
    .replace(/[đĐ]/g, (m) => (m === "đ" ? "d" : "D")) // chuyển chữ đ/Đ thành d/D
    .replace(/([^0-9a-z\s])/g, "") // xóa các ký tự đặc biệt
    .replace(/\s+/g, "-");

export const getAllChildren = (data: any[], parentId: number): any[] => {
  const children: any[] = [];
  // grab the children
  const posts: any[] = [];
  for (const item of data) {
    if (item.parentId === parentId) {
      posts.push(item);
    }
  }

  // now grab the grand children
  for (const child of posts) {
    // recursion!! hurrah
    const gChildren = getAllChildren(data, child.id);

    // merge the grand children into the children array
    if (!_isEmpty(gChildren)) {
      children.push(...gChildren);
    }
  }

  // merge in the direct descendants we found earlier
  children.push(...posts);

  return children;
};

export const titleCase = (value: string) =>
  value
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(" ");

export const htmlToText = (htmlString: string): string =>
  htmlString.replace(/<[^>]+>/g, "").replace(/\n/g, " ");

export const normalizeString = (str: string) => {
  if (!str) {
    return "";
  }

  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const getPageOffset = (
  page: number | string,
  limit: number | string
) => {
  const offset = +page > 1 ? (+page - 1) * +limit : 0;

  return offset;
};

export const toDateFromTimestamp = (timestamp: number) =>
  new Date(timestamp * 1000);

export function base64EncodeUnicode(str: string) {
  // first we use encodeURIComponent to get percent-encoded Unicode,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(
    encodeURIComponent(str).replace(
      /%([0-9A-F]{2})/g,
      function toSolidBytes(_match, p1) {
        // return String.fromCharCode(('0x' + p1) as any)
        return String.fromCharCode(parseInt(p1, 16));
      }
    )
  );
}

export function base64DecodeUnicode(str: string) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}

export function htmlToJson(htmlString: string): Record<string, any> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  const elementAttributesToJson = (element: Element): Record<string, string> =>
    Array.from(element.attributes).reduce((acc: any, attribute) => {
      acc[attribute.name] = attribute.value;

      return acc;
    }, {});

  const elementToJson = (element: Element): Record<string, any> => {
    const children = Array.from(element.childNodes)
      .map((child) => {
        if (child.nodeType === 1) {
          // Element node
          return elementToJson(child as Element);
        } else if (child.nodeType === 3) {
          // Text node
          const trimmedText = child.nodeValue?.trim();
          if (trimmedText !== "") {
            // Include text content as a separate object within children
            return {
              nodeType: child.nodeType,
              nodeValue: child.nodeValue,
            };
          }
        }

        return null;
      })
      .filter(Boolean);

    return {
      nodeType: element.nodeType,
      tag: element.tagName.toLowerCase(),
      attributes: elementAttributesToJson(element),
      children,
    };
  };

  return elementToJson(doc.body as Element);
}

export function jsonToHtml(json: JsonNode): string {
  if (json.nodeType === 3 && json.nodeValue) {
    // Text node
    return json.nodeValue;
  }

  const attributes = json.attributes
    ? Object.keys(json.attributes)
        .map((attribute) => `${attribute}="${json.attributes?.[attribute]}"`)
        .join(" ")
    : "";

  const attributeString = attributes ? ` ${attributes}` : "";

  const childrenHtml = json.children
    ? json.children.map((child) => jsonToHtml(child)).join("")
    : "";

  if (json.tag === "text") {
    return childrenHtml;
  }

  return `<${json.tag}${attributeString}>${childrenHtml}</${json.tag}>`;
}

export const previewLocalFile = (file: File): string => {
  return URL.createObjectURL(file);
};
