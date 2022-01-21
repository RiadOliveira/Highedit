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

const getExtremePointsFromTemplate = (
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
  if (start !== 0 && startText.trim())
    finalTexts.start = verifiedTemplate.replace('?', startText);

  const endText = content.slice(end);
  if (end !== content.length && endText.trim())
    finalTexts.end = verifiedTemplate.replace('?', endText);

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
    // Part of tag's text.
    const element = child.firstChild?.parentElement as HTMLElement;
    const template = element.outerHTML.replace(element.innerText, '?');
    const { start: startText, end: endText } = getExtremePointsFromTemplate(
      template,
      content,
      start,
      end,
    );

    if (startText) updatedText.push(startText);

    if (styles) {
      const tagName = sameTagName ? 'span' : propertyName;

      updatedText.push(
        template.replaceAll(childTagName, tagName).replace('?', selectedText),
      );
    } else updatedText.push(selectedText);

    if (endText) updatedText.push(endText);
  } else {
    // All tag's text.
    if (start !== 0) updatedText.push(content.slice(0, start));

    if (sameTagName && !styles) updatedText.push(selectedText);
    else {
      const tagName = sameTagName ? 'span' : propertyName;

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

  updatedText.push(
    `<span style="${cssProp}:${value};">${content.slice(start, end)}</span>`,
  );
  updatedText.push(content.slice(end));

  return updatedText.join('');
};

const hasTagIsChild = (
  // Child of a created element.
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

    if (hasProp && value === hasProp) {
      style.removeProperty(cssProp);

      const isEmptySpan =
        !childElement.getAttribute('style') && childElement.nodeName === 'SPAN';

      if (isEmptySpan) childElement.outerHTML = childElement.innerText;
    } else style.setProperty(cssProp, value);
  }

  return element;
};

const hasTagNotChild = (
  element: HTMLElement,
  selectedText: string,
  { start, end }: Selection,
  { cssProp, value }: Code,
): string | Node => {
  const elementText = element.innerText;

  switch (selectedText) {
    case elementText:
    case elementText.trim(): {
      // All text of the tag.
      const hasProp = element.style.getPropertyValue(cssProp);

      if (hasProp && value === hasProp) {
        element.style.removeProperty(cssProp);

        const isEmptySpan =
          !element.getAttribute('style') && element.nodeName === 'SPAN';

        if (isEmptySpan) return elementText;
      } else element.style.setProperty(cssProp, value);

      return element;
    }

    default: {
      // Part of tag's text.
      let finalElement = '';

      if (element.style.getPropertyValue(cssProp)) {
        // Removing property.
        const { content, updatedText } = getContentTools(element);
        const { start: startText, end: endText } = getExtremePointsFromTemplate(
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
