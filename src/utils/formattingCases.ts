interface Selection {
  start: number;
  end: number;
}

interface Code {
  cssProp: string;
  value: string;
}

interface StyleHasTagProps {
  code: Code;
  element: HTMLElement;
}

const getContentTools = ({
  textContent,
}: ChildNode): { updatedText: string[]; content: string } => ({
  updatedText: [],
  content: textContent || '',
});

const tagFormat = (
  { start, end }: Selection,
  propertyName: string,
  child: ChildNode,
): string => {
  const { updatedText, content } = getContentTools(child);

  if (start >= 0 && end >= 0) {
    const styles = child.firstChild?.parentElement?.getAttribute('style');

    if (start !== 0) {
      updatedText.push(content.slice(0, start));
    }

    const sameTagName = propertyName === child.nodeName.toLowerCase();
    const tagContent = content.slice(start, end);

    if (sameTagName && !styles) {
      updatedText.push(tagContent);
    } else {
      const tagName = sameTagName ? 'span' : propertyName;

      updatedText.push(
        `<${tagName}${
          styles ? ` style="${styles}"` : ''
        }>${tagContent}</${tagName}>`,
      );
    }

    updatedText.push(content.slice(end));
  }

  return updatedText.join('');
};

// Styles formatting
const justText = (
  { start, end }: Selection,
  { cssProp, value }: Code,
  child: ChildNode,
): string => {
  const { updatedText, content } = getContentTools(child);

  if (start !== 0) {
    updatedText.push(content.slice(0, start));
  }

  updatedText.push(
    `<span style="${cssProp}:${value};">${content.slice(start, end)}</span>`,
  );
  updatedText.push(content.slice(end));

  return updatedText.join('');
};

const hasTagIsChild = (
  // Child of a create element.
  { element, code: { cssProp, value } }: StyleHasTagProps,
  comparativeNode: Node,
): void => {
  const childIndex = Array.from(element.children).findIndex(
    indexChild => indexChild === comparativeNode,
  );

  const childElement =
    element.children[childIndex].firstChild?.parentElement ||
    document.createElement('span');

  const hasProp = childElement.style.getPropertyValue(cssProp);

  if (hasProp && value === hasProp) {
    childElement.style.removeProperty(cssProp);
  } else {
    childElement.style.setProperty(cssProp, value);
  }
};

const hasTagNotChild = (
  { element, code: { cssProp, value } }: StyleHasTagProps,
  selectedText: string,
): void => {
  switch (selectedText) {
    case element.innerText: {
      // All text of the tag.
      const hasProp = element.style.getPropertyValue(cssProp);

      if (hasProp && value === hasProp) {
        element.style.removeProperty(cssProp);
      } else {
        element.style.setProperty(cssProp, value);
      }
      break;
    }

    default: {
      // Part of tag's text.
      // eslint-disable-next-line no-param-reassign
      element.innerHTML = element.innerHTML.replace(
        selectedText,
        `<span style="${cssProp}:${value};">${selectedText}</span>`,
      );
    }
  }
};

export default {
  tag: tagFormat,
  style: {
    justText,
    hasTag: {
      isChild: hasTagIsChild,
      notChild: hasTagNotChild,
    },
  },
};
