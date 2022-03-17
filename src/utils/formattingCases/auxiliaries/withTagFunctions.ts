import { Code, SelectionPoints } from '..';
import getExtremeTextsUsingPoints from './getExtremeTextsUsingPoints';

interface HandleWithTagFunctionProps {
  childElement: HTMLElement;
  childText: string;
  code: Code;
}

const fullTextSelected = ({
  childElement: element,
  childText,
  code: { cssProp, value },
}: HandleWithTagFunctionProps): string => {
  // All text of the tag.
  const { nodeName, style } = element;
  const hasProp = style.getPropertyValue(cssProp);

  // If already has property, remove it.
  if (hasProp && value === hasProp) {
    style.removeProperty(cssProp);

    const verifyEmptyTag = nodeName === 'SPAN' || nodeName === 'DIV';
    const isEmptyTag = !element.getAttribute('style') && verifyEmptyTag;

    if (isEmptyTag) return childText;
  } else style.setProperty(cssProp, value);

  return element.outerHTML;
};

const partOfTextSelected = (
  selectedText: string,
  {
    childElement,
    childText,
    code: { cssProp, value },
  }: HandleWithTagFunctionProps,
  points: SelectionPoints,
): string => {
  const { start: startText, end: endText } = getExtremeTextsUsingPoints(
    childText,
    points,
    childElement,
  );

  const { style } = childElement;
  const propertyValue = style.getPropertyValue(cssProp);

  if (propertyValue !== value) style.setProperty(cssProp, value);
  else style.removeProperty(cssProp);
  const childStyles = childElement.getAttribute('style');

  if (!childStyles) return `${startText}${selectedText}${endText}`;

  const updatedElement = document.createElement('span');
  updatedElement.innerText = selectedText;
  updatedElement.setAttribute('style', childStyles);

  return `${startText}${updatedElement.outerHTML}${endText}`;
};

export { fullTextSelected, partOfTextSelected };
