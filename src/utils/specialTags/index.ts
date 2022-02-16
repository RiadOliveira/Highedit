import unifyAndSetElementChildren from 'utils/unifyAndSetElementChildren';
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

export default {
  linkTag,
};
