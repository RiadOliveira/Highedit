import getExtremePointsWithTemplate from './getExtremePointsWithTemplate';

interface Code {
  cssProp: string;
  value: string;
}

interface Selection {
  start: number;
  end: number;
}

interface HandleWithTagFunctionProps {
  childElement: HTMLElement;
  childText: string;
  code: Code;
}

const withTagFullTextSelected = (
  isAlign: boolean,
  {
    childElement: element,
    childText,
    code: { cssProp, value },
  }: HandleWithTagFunctionProps,
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

const withTagPartOfTextSelected = (
  selectedText: string,
  {
    childElement,
    childText,
    code: { cssProp, value },
  }: HandleWithTagFunctionProps,
  { start, end }: Selection,
): string => {
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

export { withTagFullTextSelected, withTagPartOfTextSelected };
