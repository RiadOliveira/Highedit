interface Selection {
  start: number;
  end: number;
}

interface Code {
  cssProp: string;
  value: string;
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
  // Child of a created element.
  element: HTMLElement,
  comparativeNode: Node,
  { cssProp, value }: Code,
): void => {
  const childIndex = Array.from(element.children).findIndex(
    indexChild => indexChild === comparativeNode,
  );

  const childElement = element.children[childIndex].firstChild?.parentElement;

  if (childElement) {
    const { style } = childElement;
    const hasProp = style.getPropertyValue(cssProp);

    if (hasProp && value === hasProp) style.removeProperty(cssProp);
    else style.setProperty(cssProp, value);
  }
};

const hasTagNotChild = (
  element: HTMLElement,
  selectedText: string,
  { start, end }: Selection,
  { cssProp, value }: Code,
): string | Node => {
  switch (selectedText) {
    case element.innerText: {
      // All text of the tag.
      const hasProp = element.style.getPropertyValue(cssProp);

      if (hasProp && value === hasProp) {
        element.style.removeProperty(cssProp);

        if (!element.getAttribute('style')) {
          return element.innerText;
        }
      } else {
        element.style.setProperty(cssProp, value);
      }

      return element;
    }

    default: {
      // Part of tag's text.
      let finalElement = '';

      if (element.style.getPropertyValue(cssProp)) {
        const { content, updatedText } = getContentTools(element);
        const template = element.outerHTML.replace(element.innerText, '?');

        if (start !== 0) {
          updatedText.push(template.replace('?', content.slice(0, start)));
        }

        updatedText.push(content.slice(start, end + 1));

        if (end !== content.length) {
          updatedText.push(template.replace('?', content.slice(end + 1)));
        }

        finalElement = updatedText.join('');
      } else {
        finalElement = element.innerHTML.replace(
          selectedText,
          `<span style="${cssProp}:${value};">${selectedText}</span>`,
        );
      }

      return finalElement;
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
