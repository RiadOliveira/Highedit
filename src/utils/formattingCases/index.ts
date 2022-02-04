import replaceTagName from '../replaceTagName';
import getContentTools from './auxiliaries/getContentTools';
import getExtremePointsWithTemplate from './auxiliaries/getExtremePointsWithTemplate';
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

// -----------------
// Styles formatting
// -----------------

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

export { tagFormat, styleFormat };
