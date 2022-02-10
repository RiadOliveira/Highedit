import { SelectionPoints } from 'utils/formattingCases';
import getContentFromChild from 'utils/formattingCases/auxiliaries/getContentFromChild';
import getExtremeTextsUsingPoints from 'utils/formattingCases/auxiliaries/getExtremeTextsUsingPoints';

const alreadyHasTag = (
  child: ChildNode,
  linkElement: HTMLAnchorElement,
  startText: string,
  endText: string,
): string => {
  const firstChild = child.firstChild as ChildNode;
  const parentElement = firstChild.parentElement as HTMLElement;
  const { style } = parentElement;

  const spanDecoration = style.getPropertyValue('text-decoration');
  const spanColor = style.getPropertyValue('color');

  // Removing link tag.
  if (firstChild.nodeName === 'A') {
    if (spanDecoration === 'underline') style.removeProperty('text-decoration');
    if (spanColor === 'blue') style.removeProperty('color');

    if (!parentElement.getAttribute('style')) return child.textContent || '';

    const textNode = firstChild.firstChild as ChildNode;
    child.replaceChild(textNode, firstChild);

    return getContentFromChild(child);
  }

  // Setting link tag.
  if (!spanDecoration) style.setProperty('text-decoration', 'underline');
  if (!spanColor) style.setProperty('color', 'blue');

  parentElement.replaceChild(linkElement, firstChild);

  return `${startText}${parentElement.outerHTML}${endText}`;
};

const convertChildToLinkTag = (
  child: ChildNode,
  points: SelectionPoints,
  selectedLink: string,
): string => {
  const linkElement = document.createElement('a');
  linkElement.href = selectedLink;
  linkElement.innerText = selectedLink;

  const template = child.firstChild?.parentElement || undefined;
  const { start, end } = getExtremeTextsUsingPoints(
    child.textContent || '',
    points,
    template,
  );

  if (child.nodeName === 'SPAN') {
    return alreadyHasTag(child, linkElement, start, end);
  }

  // Only text.
  const spanElement = document.createElement('span');
  spanElement.style.setProperty('color', 'blue');
  spanElement.style.setProperty('text-decoration', 'underline');
  spanElement.appendChild(linkElement);

  return `${start}${spanElement.outerHTML}${end}`;
};

export default convertChildToLinkTag;
