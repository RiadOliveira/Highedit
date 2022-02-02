import replaceTagName from './replaceTagName';

interface Selection {
  start: number;
  end: number;
}

interface Code {
  cssProp: string;
  value: string;
}

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
  if (start !== 0 && startText) {
    finalTexts.start = verifiedTemplate.replace('?', startText);
  }

  const endText = content.slice(end);
  if (end !== content.length && endText) {
    finalTexts.end = verifiedTemplate.replace('?', endText);
  }

  return finalTexts;
};

const tagFormat = (
  { start, end }: Selection,
  selectedText: string,
  propertyName: string,
  child: ChildNode,
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
  { start, end }: Selection,
  { cssProp, value }: Code,
  child: ChildNode,
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

// Child of a created element.
const hasTagIsChild = (
  element: HTMLElement,
  comparativeNode: Node,
  { cssProp, value }: Code,
): string | Node => {
  const comparativeNodeContent =
    comparativeNode.firstChild?.parentElement?.outerHTML;

  const childIndex = Array.from(element.children).findIndex(
    ({ outerHTML }) => outerHTML === comparativeNodeContent,
  );

  const childElement = element.children[childIndex].firstChild?.parentElement;

  if (childElement) {
    const { style } = childElement;
    const hasProp = style.getPropertyValue(cssProp);

    // If already has property, remove it.
    if (hasProp && value === hasProp) {
      style.removeProperty(cssProp);

      const { nodeName } = childElement;
      const verifyEmptyTag = nodeName === 'SPAN' || nodeName === 'SECTION';
      const isEmptyTag = !childElement.getAttribute('style') && verifyEmptyTag;

      if (isEmptyTag) childElement.outerHTML = childElement.innerText;
    } else style.setProperty(cssProp, value);
  }

  return element;
};

// Has tag, but it's just text selected, without children tags.
const hasTagNotChild = (
  element: HTMLElement,
  selectedText: string,
  { start, end }: Selection,
  { cssProp, value }: Code,
): string | Node => {
  const { style, innerText: elementText } = element;

  // If the property is align, modify all parent tag style.
  const isAlign = cssProp === 'text-align';

  switch (selectedText) {
    case elementText:
    case elementText.trim(): {
      // All text of the tag.
      const { nodeName } = element;
      const hasProp = style.getPropertyValue(cssProp);

      // If already has property, remove it.
      if (hasProp && value === hasProp) {
        style.removeProperty(cssProp);

        const verifyEmptyTag = nodeName === 'SPAN' || nodeName === 'SECTION';
        const isEmptyTag = !element.getAttribute('style') && verifyEmptyTag;

        if (isEmptyTag) return elementText;
      } else {
        if (isAlign && (nodeName === 'SPAN' || nodeName === 'A')) {
          const updatedElement = document.createElement('section');

          updatedElement.style.setProperty(cssProp, value);
          updatedElement.appendChild(element);

          return updatedElement;
        }

        style.setProperty(cssProp, value);
      }

      return element;
    }

    default: {
      // Part of tag's text.
      let finalElement = '';
      const propertyValue = style.getPropertyValue(cssProp);

      if (propertyValue) {
        const { content, updatedText } = getContentTools(element);
        const { start: startText, end: endText } = getExtremePointsWithTemplate(
          element,
          content,
          start,
          end,
        );

        if (startText) updatedText.push(startText);

        // If has different value, update it, else, remove all styles.
        if (propertyValue !== value) {
          const tagName = isAlign ? 'section' : 'span';
          updatedText.push(
            `<${tagName} style="${cssProp}:${value};">${selectedText}</${tagName}>`,
          );
        } else updatedText.push(selectedText);

        if (endText) updatedText.push(endText);

        finalElement = updatedText.join('');
      } else {
        // Adding property.
        finalElement = element.outerHTML.replace(
          selectedText,
          `<span style="${cssProp}:${value};">${selectedText}</span>`,
        );
      }

      return finalElement;
    }
  }
};

export default {
  tag: tagFormat,
  style: {
    justText,
    hasTag: {
      isChild: hasTagIsChild,
      notChild: hasTagNotChild,
    },
  },
};
