const unifyDivsFromChildrenArray = (
  childReference: HTMLElement,
  updatedChildren: (Node | string)[],
  index: number,
): { joinedDivs: string; indexAddition: number } => {
  const childAlign = childReference?.style.getPropertyValue('text-align');
  const joinedDivs = [childReference?.innerHTML];
  let nextIndex = index + 1;

  if (updatedChildren[index + 1]) {
    for (nextIndex; nextIndex < updatedChildren.length; nextIndex++) {
      const iteratedChild = updatedChildren[nextIndex] as ChildNode;
      if (iteratedChild.nodeName !== 'DIV') break;

      const iteratedChildReference = iteratedChild.firstChild?.parentElement;
      const iteratedChildAlign =
        iteratedChildReference?.style.getPropertyValue('text-align');

      if (childAlign !== iteratedChildAlign) break;

      // Join texts.
      joinedDivs.push(iteratedChildReference?.innerHTML || '');
    }
  }

  const template = `<div style="text-align: ${childAlign};">?</div>`;
  return {
    joinedDivs: template.replace('?', joinedDivs.join('')),
    indexAddition: nextIndex - index - 1,
  };
};

export default unifyDivsFromChildrenArray;
