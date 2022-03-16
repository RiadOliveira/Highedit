import unifyAndSetElementChildren from 'utils/unifyAndSetElementChildren';
import getExtremeTextsUsingPoints from 'utils/formattingCases/auxiliaries/getExtremeTextsUsingPoints';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import convertChildToLinkTag from './linkAuxiliaries/convertChildToLinkTag';
import { SelectionPoints } from '../formattingCases';

export const linkTag = (
  child: ChildNode,
  comparativeNode: Node,
  selectedText: string,
  link: string,
  points: SelectionPoints,
): Node | string => {
  const props = {
    child,
    points,
    link,
    selectedText,
  };

  if (child.nodeName !== 'SECTION') return convertChildToLinkTag(props);

  props.child = comparativeNode as ChildNode;
  const convertedChild = convertChildToLinkTag(props);

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

export const imageTag = (
  child: ChildNode,
  comparativeNode: Node,
  imageLink: string,
  { start }: SelectionPoints,
): Node | string => {
  const imageElement = document.createElement('img');
  imageElement.src = imageLink;

  const comparativeNodeTemplate = comparativeNode.firstChild?.parentElement;
  const { start: startText, end: endText } = getExtremeTextsUsingPoints(
    comparativeNode.textContent || '',
    { start, end: start },
    comparativeNodeTemplate || undefined,
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

export const saveFile = (textRef: HTMLPreElement): void => {
  html2canvas(textRef.parentElement as HTMLElement).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new JsPDF();
    pdf.addImage(imgData, 'JPEG', 0, 0, 0, 0);
    pdf.save('download.pdf');
  });
};
