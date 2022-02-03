// Function to get text content of only text tags.
const isText = (child: Node | string): string => {
  if (typeof child === 'string') return child;
  if (child instanceof Node && child.nodeName === '#text') {
    return child.textContent || '';
  }

  return '';
};

const unifyAndSetElementChildren = (
  updatedChildren: (Node | string)[],
  element: HTMLElement,
): void => {
  // eslint-disable-next-line no-param-reassign
  element.innerHTML = '';

  for (let ind = 0; ind < updatedChildren.length; ind++) {
    const child = updatedChildren[ind];
    let finalText = isText(child);

    if (finalText) {
      // If has other tags with only text, and they aren't together.
      if (updatedChildren[ind + 1]) {
        for (let i = ind + 1; i < updatedChildren.length; i++, ind++) {
          const verify = isText(updatedChildren[i]);

          // Join texts.
          if (updatedChildren[i] && verify) finalText += verify;
          else break;
        }
      }

      // eslint-disable-next-line no-param-reassign
      element.innerHTML += finalText;
    } else element.appendChild(child as Node);
  }
};

export default unifyAndSetElementChildren;
