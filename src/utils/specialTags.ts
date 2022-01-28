const link = (
  child: ChildNode,
  comparativeNode: Node,
  selectedLink: string,
): string => {
  const comparativeElement = comparativeNode.firstChild?.parentElement;
  const nodeText = comparativeElement?.outerHTML || '';

  // Removing tag.
  if (child.nodeName === 'A') {
    const hasAlign = comparativeElement?.style.getPropertyValue('text-align');
    const withoutTagName = hasAlign ? 'div' : 'span';

    return nodeText
      .replace('<a', `<${withoutTagName}`)
      .replace('a>', `${withoutTagName}>`);
  }

  // Replace selectedText to a link.
  const replaceToLink = (elementText: string) => {
    const isPropertyTag = comparativeNode.nodeName !== 'SPAN';
    const textToReplace = isPropertyTag ? selectedLink : nodeText;

    let textColor = 'color: blue; ';
    let textDecoration = 'text-decoration: underline; ';
    let extraStyles = '';

    if (!isPropertyTag) {
      const elementStyles = comparativeElement?.getAttribute('style');
      extraStyles = elementStyles || '';

      if (extraStyles.includes('color')) textColor = '';
      if (extraStyles.includes('text-decoration')) textDecoration = '';
    }

    const finalStyle = textDecoration + textColor + extraStyles;

    return elementText.replace(
      textToReplace,
      `<a style="${finalStyle}" href="${selectedLink}">${selectedLink}</a>`,
    );
  };

  // If has just text, replace the selected part for the link.
  const childText = child.textContent || '';
  if (child.nodeName === '#text') return replaceToLink(childText);

  // If has a tag (h1, h2, h3, h4, span, div).
  // ----------------------------------------

  const parentElement = child.firstChild?.parentElement as HTMLElement;

  // Removing subtag 'A' if already has.
  if (comparativeNode.nodeName === 'A') {
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
