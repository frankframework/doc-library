import { transformAsHtml, transformAsText } from '@frankframework/doc-library-core';
import type { ElementsWithInfo, LinkData } from '@frankframework/doc-library-core';
import { useMemo } from 'react';

type InnerHTML = {
  __html: string;
};

function javadocTransform(
  javadoc: string | undefined,
  elements: Record<string, ElementsWithInfo> | null,
  asText = true,
  // eslint-disable-next-line no-unused-vars
  linkTemplate?: (link: LinkData) => string,
): string {
  if (javadoc === '') javadoc = '-';
  if (!javadoc || !elements) return '';

  const hasCustomLinkTransform = !!linkTemplate;
  const javadocParts = asText
    ? transformAsText(javadoc, elements)
    : transformAsHtml(javadoc, elements, hasCustomLinkTransform);

  return javadocParts
    .map((part) => (hasCustomLinkTransform && typeof part === 'object' ? linkTemplate(part as LinkData) : part))
    .join('');
}

export function useJavadocTransform(
  javadoc: string | undefined,
  elements: Record<string, ElementsWithInfo> | null,
  asText = false,
  // eslint-disable-next-line no-unused-vars
  linkTemplate?: (link: LinkData) => string,
): InnerHTML {
  return useMemo(
    (): InnerHTML => ({
      __html: javadocTransform(javadoc, elements, asText, linkTemplate),
    }),
    [javadoc, elements, asText, linkTemplate],
  );
}
