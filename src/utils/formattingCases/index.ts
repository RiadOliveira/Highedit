import getExtremeTextsUsingPoints from './auxiliaries/getExtremeTextsUsingPoints';
import {
  fullTextSelected,
  partOfTextSelected,
} from './auxiliaries/withTagFunctions';

interface SelectionPoints {
  start: number;
  end: number;
}

interface Code {
  cssProp: string;
  value: string;
}

const justText = (
  child: ChildNode,
  { start, end }: SelectionPoints,
  { cssProp, value }: Code,
): string => {
  const updatedText: string[] = [];
  const content = child.textContent || '';

  const { start: startText, end: endText } = getExtremeTextsUsingPoints(
    content,
    { start, end },
  );

  const updatedElement = document.createElement('span');
  updatedElement.style.setProperty(cssProp, value);
  updatedElement.innerText = content.slice(start, end);

  if (startText) updatedText.push(startText);
  updatedText.push(updatedElement.outerHTML);
  if (endText) updatedText.push(endText);

  return updatedText.join('');
};

const withTag = (
  element: HTMLElement,
  selectedText: string,
  points: SelectionPoints,
  comparativeNode: Node,
  code: Code,
): string | Node => {
  const getFinalElement = (childElement: HTMLElement) => {
    const childText = comparativeNode.textContent || '';
    const isTextTag = comparativeNode.nodeName === 'SPAN';

    const handleWithTagProps = {
      childElement,
      childText,
      code,
    };
    const isFullText = selectedText === childText && isTextTag;

    if (isFullText) return fullTextSelected(handleWithTagProps);
    return partOfTextSelected(selectedText, handleWithTagProps, points);
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
  withTag,
};

export { styleFormat };
export type { SelectionPoints, Code };
