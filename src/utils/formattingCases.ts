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
  child: ChildNode;
}

const tagFormat = (
  { start, end }: Selection,
  propertyName: string,
  child: ChildNode,
): string => {
  const updatedText: string[] = [];
  const content = child.textContent || '';

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
  const updatedText: string[] = [];
  const content = child.textContent || '';

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
  { child, code: { cssProp, value } }: StyleHasTagProps,
  comparativeNode: Node,
): void => {
  const element = child.firstChild?.parentElement || new HTMLElement();

  const childIndex = Array.from(element.children).findIndex(
    indexChild => indexChild === comparativeNode,
  );

  const childElement = element.children[childIndex].firstChild?.parentElement;

  if (childElement) {
    const hasProp = childElement.style.getPropertyValue(cssProp);

    if (hasProp && value === hasProp) {
      childElement.style.removeProperty(cssProp);
    } else {
      childElement.style.setProperty(cssProp, value);
    }
  }
};

const hasTagNotChild = (
  { child, code: { cssProp, value } }: StyleHasTagProps,
  selectedText: string,
): void => {
  const element = child.firstChild?.parentElement || new HTMLElement();

  if (selectedText !== element.innerText) {
    element.innerHTML = element.innerHTML.replace(
      selectedText,
      `<span style="${cssProp}:${value};">${selectedText}</span>`,
    );
  } else {
    const hasProp = element.style.getPropertyValue(cssProp);

    if (hasProp && value === hasProp) {
      element.style.removeProperty(cssProp);
    } else {
      element.style.setProperty(cssProp, value);
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
