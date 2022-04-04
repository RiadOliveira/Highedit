import getExtremeTextsUsingPoints from 'utils/formattingCases/auxiliaries/getExtremeTextsUsingPoints';
import generateTemplateElementFromString from 'utils/formattingCases/auxiliaries/generateTemplateElementFromString';
import convertChildToLinkTag from './linkAuxiliaries/convertChildToLinkTag';
import { SelectionPoints } from '../formattingCases';

export const linkTag = (
  child: ChildNode,
  comparativeNode: Node,
  selectedText: string,
  link: string,
  points: SelectionPoints,
): Node => {
  const props = {
    child,
    points,
    link,
    selectedText,
  };

  if (child.nodeName !== 'DIV') return convertChildToLinkTag(props);

  props.child = comparativeNode as ChildNode;
  const convertedChild = convertChildToLinkTag(props);
  const templateChildren = Array.from(convertedChild.childNodes);

  const updatedChildren = Array.from(child.childNodes).map(subChild =>
    subChild !== comparativeNode ? subChild : templateChildren,
  );

  const childElement = child.firstChild?.parentElement as HTMLElement;
  childElement.replaceChildren(...updatedChildren.flat());

  return childElement;
};

export const imageTag = (
  child: ChildNode,
  comparativeNode: Node,
  imageLink: string,
  { start }: SelectionPoints,
): Node => {
  const imageElement = document.createElement('img');
  imageElement.src = imageLink;

  const comparativeNodeTemplate = comparativeNode.firstChild?.parentElement;
  const { start: startText, end: endText } = getExtremeTextsUsingPoints(
    comparativeNode.textContent || '',
    { start, end: start },
    comparativeNodeTemplate || undefined,
  );

  const finalText = `${startText}${imageElement.outerHTML}${endText}`;
  const templateElement = generateTemplateElementFromString(finalText);
  if (child.nodeName === '#text') return templateElement;

  if (child.nodeName !== 'DIV') {
    const childElement = child.firstChild?.parentElement as HTMLElement;

    childElement.innerHTML = finalText;
    return childElement;
  }

  child.replaceChild(templateElement, comparativeNode);
  return child;
};

export const saveFile = (
  textRef: HTMLPreElement,
  backgroundColor: string,
): void => {
  const documentElement = document.documentElement.cloneNode(true);

  const copyHTML = documentElement.firstChild?.parentElement as HTMLElement;
  Array.from(copyHTML.getElementsByTagName('script')).forEach(element =>
    element.remove(),
  );

  const copyElement = textRef.cloneNode(true).firstChild
    ?.parentElement as HTMLElement;
  copyElement.removeAttribute('contentEditable');

  copyElement.style.setProperty('width', '100%');
  copyElement.style.setProperty('height', '100%');
  copyElement.style.setProperty('overflow', 'auto');
  copyElement.style.setProperty('margin', '0px');
  copyElement.style.setProperty('background', backgroundColor);

  const copyBody = document.body.cloneNode(false);
  copyBody.appendChild(copyElement as HTMLElement);
  copyHTML.replaceChild(copyBody, copyHTML.getElementsByTagName('body')[0]);

  const downloadElement = document.createElement('a');
  downloadElement.setAttribute(
    'href',
    `data:text/plain;charset=utf-8,${encodeURIComponent(copyHTML.outerHTML)}`,
  );
  downloadElement.setAttribute('download', 'download.html');
  downloadElement.click();
};
