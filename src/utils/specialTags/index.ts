import unifyAndSetElementChildren from 'utils/unifyAndSetElementChildren';
import getExtremeTextsUsingPoints from 'utils/formattingCases/auxiliaries/getExtremeTextsUsingPoints';
import convertChildToLinkTag from './linkAuxiliaries/convertChildToLinkTag';
import { SelectionPoints } from '../formattingCases';

const linkTag = (
  child: ChildNode,
  comparativeNode: Node,
  selectedLink: string,
  points: SelectionPoints,
): Node | string => {
  if (child.nodeName !== 'SECTION') {
    return convertChildToLinkTag(child, points, selectedLink);
  }

  const convertedChild = convertChildToLinkTag(
    comparativeNode as ChildNode,
    points,
    selectedLink,
  );

  const templateElement = document.createElement('template');
  templateElement.innerHTML = convertedChild;
  const templateChildren = Array.from(templateElement.content.childNodes);

  const updatedChildren = Array.from(child.childNodes).map(subChild =>
    subChild !== comparativeNode ? subChild : templateChildren,
  );

  const childElement = child.firstChild?.parentElement as HTMLElement;
  unifyAndSetElementChildren(updatedChildren.flat(), childElement);

  return childElement;
};

const imageTag = (
  child: ChildNode,
  comparativeNode: Node,
  imageLink: string,
  { start }: SelectionPoints,
): Node | string => {
  const imageElement = document.createElement('img');
  imageElement.src = imageLink;

  const { start: startText, end: endText } = getExtremeTextsUsingPoints(
    child.textContent || '',
    { start, end: start },
  );
  const finalText = `${startText}${imageElement.outerHTML}${endText}`;

  if (child.nodeName === '#text') return finalText;

  const childElement = child.firstChild?.parentElement as HTMLElement;
  if (child.nodeName !== 'SECTION') {
    childElement.innerHTML = finalText;
    return childElement;
  }

  const template = document.createElement('template');
  template.innerHTML = finalText;

  child.replaceChild(template.content, comparativeNode);
  return child;
};

export default {
  linkTag,
  imageTag,
};
