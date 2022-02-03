import replaceTagName from './replaceTagName';

interface Selection {
  start: number;
  end: number;
}

interface Code {
  cssProp: string;
  value: string;
}

// -----------
// Auxiliaries
// -----------

const getContentTools = (
  child: ChildNode,
): { updatedText: string[]; content: string } => {
  let content = '';

  if (!child.childNodes.length) {
    content = child.textContent || '';
  } else {
    const childrenArray = Array.from(child.childNodes);

    content = childrenArray
      .map(({ firstChild, textContent }) => {
        const subChildHTML = firstChild?.parentElement?.outerHTML;
        return subChildHTML || textContent;
      })
      .join('');
  }

  return {
    updatedText: [],
    content,
  };
};

// Used when removes a style/tag on some part of text.
const getExtremePointsWithTemplate = (
  template: HTMLElement | string,
  content: string,
  start: number,
  end: number,
): { start: string; end: string } => {
  const verifiedTemplate =
    typeof template === 'string'
      ? template
      : template.outerHTML.replace(template.innerText, '?');

  const finalTexts = {
    start: '',
    end: '',
  };

  const startText = content.slice(0, start);
  if (start !== 0 && startText.trim()) {
    finalTexts.start = verifiedTemplate.replace('?', startText);
  }

  const endText = content.slice(end);
  if (end !== content.length && endText.trim()) {
    finalTexts.end = verifiedTemplate.replace('?', endText);
  }

  return finalTexts;
};

const handleHasTagWithoutFullText = (
  childElement: HTMLElement,
  childText: string,
  selectedText: string,
  { cssProp, value }: Code,
  { start, end }: Selection,
) => {
  const { style } = childElement;
  const propertyValue = style.getPropertyValue(cssProp);
  const updatedText: string[] = [];

  const { start: startText, end: endText } = getExtremePointsWithTemplate(
    childElement,
    childText,
    start,
    end,
  );

  if (startText) updatedText.push(startText);

  // If has different value (or no value), update it, else, remove all styles.
  if (propertyValue !== value) {
    const tagName = cssProp === 'text-align' ? 'section' : 'span';
    updatedText.push(
      `<${tagName} style="${cssProp}:${value};">${selectedText}</${tagName}>`,
    );
  } else updatedText.push(selectedText);

  if (endText) updatedText.push(endText);

  return updatedText.join('');
};

// --------------------
// Formatting functions
// --------------------

const tagFormat = (
  child: ChildNode,
  selectedText: string,
  propertyName: string,
  { start, end }: Selection,
): string => {
  const childElement = child.firstChild?.parentElement;

  const styles = childElement?.getAttribute('style');
  const hasTag = child.nodeName !== '#text';

  const childTagName = child.nodeName.toLowerCase();
  const sameTagName = propertyName === childTagName;

  const childText = child.textContent || '';
  const childInnerHTML = childElement?.innerHTML || '';
  const childOuterHTML = childElement?.outerHTML || '';

  if (hasTag && selectedText.trim() !== childInnerHTML.trim()) {
    // Part of tag's text, removing its tag.
    const { updatedText, content } = getContentTools(child);

    const element = child.firstChild?.parentElement as HTMLElement;
    const template = element.outerHTML.replace(childInnerHTML, '?');
    const { start: startText, end: endText } = getExtremePointsWithTemplate(
      template,
      content,
      start,
      end,
    );

    if (startText) updatedText.push(startText);

    // Keep styles with another tag.
    if (styles) {
      const tagWhenRemove = styles?.includes('text-align') ? 'section' : 'span';
      const tagName = sameTagName ? tagWhenRemove : propertyName;

      updatedText.push(
        template.replaceAll(childTagName, tagName).replace('?', selectedText),
      );
    } else updatedText.push(selectedText);

    if (endText) updatedText.push(endText);
    return updatedText.join('');
  }

  // All tag's text.
  if (!hasTag) {
    return childText.replace(
      selectedText,
      `<${propertyName}>${selectedText}</${propertyName}>`,
    );
  }

  if (!sameTagName) {
    return replaceTagName(childOuterHTML, childTagName, propertyName);
  }

  if (!styles) return selectedText;

  const tagName = styles?.includes('text-align') ? 'section' : 'span';
  return `<${tagName} style="${styles}">${selectedText}</${tagName}>`;
};

// Styles formatting
const justText = (
  child: ChildNode,
  { start, end }: Selection,
  { cssProp, value }: Code,
): string => {
  const { updatedText, content } = getContentTools(child);

  if (start !== 0) updatedText.push(content.slice(0, start));

  const tagName = cssProp === 'text-align' ? 'section' : 'span';

  updatedText.push(
    `<${tagName} style="${cssProp}:${value};">${content.slice(
      start,
      end,
    )}</${tagName}>`,
  );
  updatedText.push(content.slice(end));

  return updatedText.join('');
};

const hasTag = (
  element: HTMLElement,
  selectedText: string,
  points: Selection,
  code: Code,
  comparativeNode: Node,
  isChild: boolean,
): string | Node => {
  let childElement = element;
  let childText = element.innerText;

  if (isChild) {
    childElement = comparativeNode.firstChild?.parentElement as HTMLElement;
    childText = comparativeNode.textContent || '';
  }

  const finalElement = handleHasTagWithoutFullText(
    childElement,
    childText,
    selectedText,
    code,
    points,
  );

  if (!isChild) return finalElement;

  const childContent = childElement.outerHTML;
  return element.outerHTML.replace(childContent, finalElement);
};

export default {
  tag: tagFormat,
  style: {
    justText,
    hasTag,
  },
};
