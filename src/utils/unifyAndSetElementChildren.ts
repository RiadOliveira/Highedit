/* eslint-disable no-param-reassign */

import unifyDivsFromChildrenArray from './unifyDivsFromChildrenArray';

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
  element.innerHTML = '';

  for (let ind = 0; ind < updatedChildren.length; ind++) {
    const child = updatedChildren[ind];
    const finalText = [isText(child)];

    if (!finalText[0] && typeof child !== 'string') {
      if (child.nodeName !== 'DIV') element.appendChild(child as Node);
      else {
        const { joinedDivs, indexAddition } = unifyDivsFromChildrenArray(
          child.firstChild?.parentElement as HTMLElement,
          updatedChildren,
          ind,
        );

        ind += indexAddition;
        element.innerHTML += joinedDivs;
      }
    } else {
      // If has other tags with only text, and they aren't together.
      if (updatedChildren[ind + 1]) {
        for (let i = ind + 1; i < updatedChildren.length; i++, ind++) {
          const verify = isText(updatedChildren[i]);

          // Join texts.
          if (updatedChildren[i] && verify) finalText.push(verify);
          else break;
        }
      }

      element.innerHTML += finalText.join('');
    }
  }
};

export default unifyAndSetElementChildren;
