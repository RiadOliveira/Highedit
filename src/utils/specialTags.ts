const link = (
  child: ChildNode,
  comparativeNode: Node,
  selectedLink: string,
): string => {
  const childText = child.textContent || '';

  if (child.nodeName === 'A') return childText;

  const replaceToLink = (elementText: string) =>
    elementText.replace(
      selectedLink,
      `<a style="text-decoration: underline; color: blue;" href="${selectedLink}">${selectedLink}</a>`,
    );

  if (child.nodeName === '#text') return replaceToLink(childText);

  const parentElement = child.firstChild?.parentElement as HTMLElement;

  if (comparativeNode.nodeName === 'A') {
    const nodeText = comparativeNode.firstChild?.parentElement?.outerHTML || '';

    return parentElement.outerHTML.replace(
      nodeText,
      comparativeNode.textContent || '',
    );
  }

  return replaceToLink(parentElement.outerHTML);
};

export default {
  link,
};
