interface Selection {
  start: number;
  end: number;
}

interface Code {
  cssProp: string;
  value: string;
}

const getContentTools = ({
  textContent,
}: ChildNode): { updatedText: string[]; content: string } => ({
  updatedText: [],
  content: textContent || '',
});

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

const tagFormat = (
  { start, end }: Selection,
  selectedText: string,
  propertyName: string,
  child: ChildNode,
): string => {
  const { updatedText, content } = getContentTools(child);
  const styles = child.firstChild?.parentElement?.getAttribute('style');
  const hasTag = child.nodeName !== '#text';

  const childTagName = child.nodeName.toLowerCase();
  const sameTagName = propertyName === childTagName;

  if (hasTag && selectedText !== child.textContent?.trim()) {
    // Part of tag's text, removing its tag.
    const element = child.firstChild?.parentElement as HTMLElement;
    const template = element.outerHTML.replace(element.innerText, '?');
    const { start: startText, end: endText } = getExtremePointsWithTemplate(
      template,
      content,
      start,
      end,
    );

    if (startText) updatedText.push(startText);

    // Keep styles with another tag.
    if (styles) {
      const tagWhenRemove = styles?.includes('text-align') ? 'div' : 'span';
      const tagName = sameTagName ? tagWhenRemove : propertyName;

      updatedText.push(
        template.replaceAll(childTagName, tagName).replace('?', selectedText),
      );
    } else updatedText.push(selectedText);

    if (endText) updatedText.push(endText);
  } else {
    // All tag's text.
    if (start !== 0) updatedText.push(content.slice(0, start));

    // Remove the tag.
    if (sameTagName && !styles) updatedText.push(selectedText);
    else {
      // If has styles, keep them with another tag.
      const tagWhenRemove = styles?.includes('text-align') ? 'div' : 'span';
      const tagName = sameTagName ? tagWhenRemove : propertyName;

      updatedText.push(
        `<${tagName}${
          styles ? ` style="${styles}"` : ''
        }>${selectedText}</${tagName}>`,
      );
    }

    updatedText.push(content.slice(end));
  }

  return updatedText.join('');
};

// Styles formatting
const justText = (
  { start, end }: Selection,
  { cssProp, value }: Code,
  child: ChildNode,
): string => {
  const { updatedText, content } = getContentTools(child);

  if (start !== 0) updatedText.push(content.slice(0, start));

  const tagName = cssProp === 'text-align' ? 'div' : 'span';

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
  const childIndex = Array.from(element.children).findIndex(
    indexChild => indexChild === comparativeNode,
  );

  const childElement = element.children[childIndex].firstChild?.parentElement;

  if (childElement) {
    const { style } = childElement;
    const hasProp = style.getPropertyValue(cssProp);

    // If already has property, remove it.
    if (hasProp && value === hasProp) {
      style.removeProperty(cssProp);

      const { nodeName } = childElement;
      const verifyEmptyTag = nodeName === 'SPAN' || nodeName === 'DIV';

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
  const { style, innerText } = element;

  // If the property is align, modify all parent tag style.
  const elementText = cssProp === 'text-align' ? selectedText : innerText;

  switch (selectedText) {
    case elementText:
    case elementText.trim(): {
      // All text of the tag.
      const { nodeName } = element;
      const hasProp = style.getPropertyValue(cssProp);

      // If already has property, remove it.
      if (hasProp && value === hasProp) {
        style.removeProperty(cssProp);

        const verifyEmptyTag = nodeName === 'SPAN' || nodeName === 'DIV';

        const isEmptyTag = !element.getAttribute('style') && verifyEmptyTag;

        if (isEmptyTag) return elementText;
      } else style.setProperty(cssProp, value);

      return element;
    }

    default: {
      // Part of tag's text.
      let finalElement = '';

      if (style.getPropertyValue(cssProp)) {
        // Removing property.
        const { content, updatedText } = getContentTools(element);
        const { start: startText, end: endText } = getExtremePointsWithTemplate(
          element,
          content,
          start,
          end,
        );

        if (startText) updatedText.push(startText);
        updatedText.push(selectedText);
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
