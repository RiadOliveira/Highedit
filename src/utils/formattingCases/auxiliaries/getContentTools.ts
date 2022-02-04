const getContentTools = (
  child: ChildNode,
): { updatedText: string[]; content: string } => {
  let content = '';

  if (!child.childNodes.length) {
    content = child.textContent || '';
  } else {
    const childrenArray = Array.from(child.childNodes);

    content = childrenArray
      .map(({ firstChild, textContent }) => {
        const subChildHTML = firstChild?.parentElement?.outerHTML;
        return subChildHTML || textContent;
      })
      .join('');
  }

  return {
    updatedText: [],
    content,
  };
};

export default getContentTools;
