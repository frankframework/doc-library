import { ElementClass, ElementInfo } from './frankdoc.types';

export type ElementsWithInfo = ElementClass & ElementInfo;
export type LinkData = {
  text: string;
  href?: string;
  element?: ElementsWithInfo;
};
type TransformedJavadocPart = string | LinkData;
export type TransformedJavadoc = TransformedJavadocPart[];

// eslint-disable-next-line sonarjs/slow-regex
export const markdownLinkRegex = /\[([^\]]+)]\(([^)]+)\)/g; // old regex: /\[(.*?)\]\((.+?)\)/g
export const tagsRegex = /<[^>]*>?/gm;
export const linkRegex = /(?:{@link\s(.*?)})/g;

export function transformAsHtml(
  javadoc: string,
  elements: Record<string, ElementsWithInfo>,
  hasCustomLinkTransform: boolean,
): TransformedJavadoc {
  let transformed = javadoc
    .replaceAll(markdownLinkRegex, '<a target="_blank" href="$2" alt="$1">$1</a>')
    .replaceAll(String.raw`\"`, '"');

  if (hasCustomLinkTransform) {
    return transformAsCustomHtml(transformed, elements);
  }

  transformed = transformed.replaceAll(linkRegex, (_, captureGroup) => {
    const linkData = getLinkData(captureGroup, elements);
    if (linkData.href) return defaultLinkTransformation(linkData);
    return linkData.text;
  });
  return [transformed];
}

export function transformAsText(javadoc: string, elements: Record<string, ElementsWithInfo>): TransformedJavadoc {
  const text = javadoc
    .replaceAll(markdownLinkRegex, '$1($2)')
    .replaceAll(tagsRegex, '')
    .replaceAll(linkRegex, (_: string, captureGroup: string) => {
      const linkData = getLinkData(captureGroup, elements);
      return linkData.text;
    })
    .replaceAll(String.raw`\"`, '"');
  return [text];
}

export function defaultLinkTransformation(linkData: LinkData): string {
  return `<a href="#/${linkData.href}">${linkData.text}</a>`;
}

/**
 * Creates LinkData object from `@link` taglet's data
 * @param captureGroup cature group received from regex matching with the `@link` taglet,
 * e.g. 'PipeLineSession pipeLineSession' for `{@link PipeLineSession pipeLineSession}`
 * @param elements
 */
export function getLinkData(captureGroup: string, elements: Record<string, ElementsWithInfo>): LinkData {
  const hashPosition = captureGroup.indexOf('#'),
    isMethod = hashPosition !== -1,
    elementString = isMethod ? captureGroup.split('#')[0] : captureGroup;

  if (elementString === '') {
    return { text: getInternalMethodReference(captureGroup, hashPosition) };
  }

  const elementParts = elementString.split(' '); //first part is the class name, 2nd part the written name
  const name = parseLinkName(elementParts, isMethod, captureGroup);

  const element = findElement(elements, elementParts[0]);
  if (!element) return { text: name };
  return { href: element.className, text: name, element };
}

function transformAsCustomHtml(javadoc: string, elements: Record<string, ElementsWithInfo>): TransformedJavadoc {
  const transformedParts: TransformedJavadocPart[] = [];
  let lastIndex = 0;
  for (const match of javadoc.matchAll(linkRegex)) {
    const [string, captureGroup] = match;
    const linkData = getLinkData(captureGroup, elements);
    transformedParts.push(javadoc.slice(lastIndex, match.index), linkData.href ? linkData : linkData.text);
    lastIndex = match.index + string.length;
  }
  if (lastIndex < javadoc.length - 1) transformedParts.push(javadoc.slice(lastIndex));
  return transformedParts;
}

/** Handle links to internal class methods  */
function getInternalMethodReference(captureGroup: string, hashPosition: number): string {
  const method = captureGroup.slice(hashPosition),
    methodParts = method.split(' ');
  return methodParts.length === 2
    ? methodParts[1] // 'methodName label' -> 'label'
    : method.slice(1, method.indexOf('('));
}

function parseLinkName(elementParts: string[], isMethod: boolean, captureGroup: string): string {
  const elementName = elementParts.at(-1)!; // element name/label
  if (isMethod) {
    const method = captureGroup.split('#')[1],
      methodNameOrLabel = method.slice(method.indexOf(') ') + 1).trim();
    return methodNameOrLabel.includes(' ') ? method.split(' ')[1] : `${elementName}.${methodNameOrLabel}`;
  }
  return elementName;
}

function findElement(elements: Record<string, ElementsWithInfo>, name: string): ElementsWithInfo | null {
  if (Object.keys(elements).length === 0) return null;
  const element = elements[name] ?? Object.values(elements).find((element) => element.className === name);
  if (element) return element;

  console.warn(`could not find element [${name}]`);
  return null;
}
