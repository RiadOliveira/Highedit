const link = (
  child: ChildNode,
  comparativeNode: Node,
  selectedLink: string,
): string => {
  const childText = child.textContent || '';

  // Removing tag.
  if (child.nodeName === 'A') return childText;

  // Replace selectedText to a link.
  const replaceToLink = (elementText: string) =>
    elementText.replace(
      selectedLink,
      `<a style="text-decoration: underline; color: blue;" href="${selectedLink}">${selectedLink}</a>`,
    );

  // If has just text, replace the selected part for the link.
  if (child.nodeName === '#text') return replaceToLink(childText);

  // If has a tag (h1, h2, h3, h4, span, div).
  // ----------------------------------------

  const parentElement = child.firstChild?.parentElement as HTMLElement;

  // Removing subtag 'A' if already has.
  if (comparativeNode.nodeName === 'A') {
    const nodeText = comparativeNode.firstChild?.parentElement?.outerHTML || '';

    return parentElement.outerHTML.replace(
      nodeText,
      comparativeNode.textContent || '',
    );
  }

  // Adding subtag 'A'.
  return replaceToLink(parentElement.outerHTML);
};

export default {
  link,
};
