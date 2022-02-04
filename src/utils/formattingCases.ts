import replaceTagName from './replaceTagName';

interface Selection {
  start: number;
  end: number;
}

interface Code {
  cssProp: string;
  value: string;
}

interface HandleHasTagFunctionProps {
  childElement: HTMLElement;
  childText: string;
  code: Code;
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
  if (start !== 0 && startText) {
    finalTexts.start = verifiedTemplate.replace('?', startText);
  }

  const endText = content.slice(end);
  if (end !== content.length && endText) {
    finalTexts.end = verifiedTemplate.replace('?', endText);
  }

  return finalTexts;
};

const hasTagFullTextSelected = (
  isAlign: boolean,
  {
    childElement: element,
    childText,
    code: { cssProp, value },
  }: HandleHasTagFunctionProps,
): string => {
  // All text of the tag.
  const { nodeName, style } = element;
  const hasProp = style.getPropertyValue(cssProp);

  // If already has property, remove it.
  if (hasProp && value === hasProp) {
    style.removeProperty(cssProp);

    const verifyEmptyTag = nodeName === 'SPAN' || nodeName === 'SECTION';
    const isEmptyTag = !element.getAttribute('style') && verifyEmptyTag;

    if (isEmptyTag) return childText;
  } else {
    if (isAlign && (nodeName === 'SPAN' || nodeName === 'A')) {
      const updatedElement = document.createElement('section');

      updatedElement.style.setProperty(cssProp, value);
      updatedElement.appendChild(element);

      return updatedElement.outerHTML;
    }

    style.setProperty(cssProp, value);
  }

  return element.outerHTML;
};

const hasTagPartOfTextSelected = (
  selectedText: string,
  {
    childElement,
    childText,
    code: { cssProp, value },
  }: HandleHasTagFunctionProps,
  { start, end }: Selection,
) => {
  const { start: startText, end: endText } = getExtremePointsWithTemplate(
    childElement,
    childText,
    start,
    end,
  );

  const { style } = childElement;
  const propertyValue = style.getPropertyValue(cssProp);

  if (propertyValue !== value) style.setProperty(cssProp, value);
  else style.removeProperty(cssProp);
  const childStyles = childElement.getAttribute('style');

  if (!childStyles) return `${startText}${selectedText}${endText}`;

  const tagName = cssProp === 'text-align' ? 'section' : 'span';

  const updatedElement = document.createElement(tagName);
  updatedElement.innerText = selectedText;
  updatedElement.setAttribute('style', childStyles);

  return `${startText}${updatedElement.outerHTML}${endText}`;
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
  comparativeNode: Node,
  code: Code,
): string | Node => {
  const getFinalElement = (childElement: HTMLElement) => {
    const childText = comparativeNode.textContent || '';
    const isTextTag = comparativeNode.nodeName === 'SPAN';
    const isAlign = code.cssProp === 'text-align';

    const handleHasTagProps: HandleHasTagFunctionProps = {
      childElement,
      childText,
      code,
    };
    const isFullText = selectedText === childText && (isTextTag || isAlign);

    if (isFullText) return hasTagFullTextSelected(isAlign, handleHasTagProps);
    return hasTagPartOfTextSelected(selectedText, handleHasTagProps, points);
  };

  if (element.nodeName === 'SPAN') return getFinalElement(element);

  const finalElement = (() => {
    if (comparativeNode.nodeName === '#text') {
      return justText(comparativeNode as ChildNode, points, code);
    }

    const childElement = comparativeNode.firstChild?.parentElement;
    return getFinalElement(childElement as HTMLElement);
  })();

  const updatedElement = document.createElement('template');
  updatedElement.innerHTML = finalElement;
  element.replaceChild(updatedElement.content, comparativeNode);

  return element;
};

const styleFormat = {
  justText,
  hasTag,
};

export { tagFormat, styleFormat };
