import getContentTools from './auxiliaries/getContentTools';
import {
  withTagFullTextSelected,
  withTagPartOfTextSelected,
} from './auxiliaries/withTagStyleFunctions';

interface Selection {
  start: number;
  end: number;
}

interface Code {
  cssProp: string;
  value: string;
}

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

const withTag = (
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

    const handleWithTagProps = {
      childElement,
      childText,
      code,
    };
    const isFullText = selectedText === childText && (isTextTag || isAlign);

    if (isFullText) return withTagFullTextSelected(isAlign, handleWithTagProps);
    return withTagPartOfTextSelected(selectedText, handleWithTagProps, points);
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
