const getContentFromChild = (iteratedChild: ChildNode): string => {
  if (iteratedChild.nodeName === '#text') {
    return iteratedChild.textContent || '';
  }

  const childElement = iteratedChild.firstChild?.parentElement;
  return childElement?.outerHTML || '';
};

export default getContentFromChild;
