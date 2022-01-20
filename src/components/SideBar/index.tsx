import React, { useCallback, useEffect, useState } from 'react';
import SideBarButton from 'components/SideBarButton';
import { ButtonPair, Container } from './styles';
import properties, { Property, SelectableProp } from '../../utils/properties';

interface SideBarProps {
  inputRef: React.RefObject<HTMLDivElement>;
  setTextProperty: (updatedChildren: (Node | string)[]) => void;
  selectedElement: ChildNode | undefined;
}

const SideBar: React.FC<SideBarProps> = ({
  inputRef,
  setTextProperty,
  selectedElement,
}) => {
  const [activeProps, setActiveProps] = useState<SelectableProp[]>([]);

  useEffect(() => {
    if (selectedElement && selectedElement.nodeName !== 'text') {
      const props: SelectableProp[] = [];
      const { nodeName } = selectedElement;

      const itsChild = selectedElement.parentElement !== inputRef.current;

      if (nodeName !== 'SPAN') {
        props.push(nodeName.toLowerCase() as SelectableProp);
      } else if (itsChild) {
        props.push(
          selectedElement.parentElement?.nodeName.toLowerCase() as SelectableProp,
        );
      }

      let elementStyle =
        selectedElement?.firstChild?.parentElement?.getAttribute('style');

      if (itsChild) {
        elementStyle +=
          selectedElement.parentElement?.getAttribute('style') || '';
      }

      properties.forEach(subprops =>
        subprops.forEach(property => {
          if (property.type === 'style') {
            const {
              name,
              code: { value },
            } = property;

            if (elementStyle?.includes(value)) props.push(name);
          }
        }),
      );

      setActiveProps(props);
    }
  }, [inputRef, selectedElement]);

  const getNodes = useCallback(
    (property: Property): (Node | string)[] => {
      const selection = window.getSelection();
      const textRef = inputRef.current;

      const inputNodes: (Node | string)[] = [];

      if (selection && textRef) {
        const start = selection.anchorOffset;
        const end = selection.focusOffset;
        const parentNode = selection.anchorNode?.parentNode;

        const comparativeNode: Node | null | undefined =
          parentNode !== textRef ? parentNode : selection.anchorNode;

        textRef.childNodes.forEach(child => {
          const itsChild = Array.from(child.childNodes).includes(
            comparativeNode as ChildNode,
          );

          if (comparativeNode !== child && !itsChild) {
            inputNodes.push(child);
            return;
          }

          const content = child.textContent || '';
          const updatedText: string[] = [];

          if (property.type === 'tag') {
            if (start >= 0 && end >= 0) {
              const { name } = property;
              const styles =
                child.firstChild?.parentElement?.getAttribute('style');

              if (start !== 0) {
                updatedText.push(content.slice(0, start));
              }

              const sameTagName = name === child.nodeName.toLowerCase();
              const tagContent = content.slice(start, end);

              if (sameTagName && !styles) {
                updatedText.push(tagContent);
              } else {
                const tagName = sameTagName ? 'span' : name;

                updatedText.push(
                  `<${tagName}${
                    styles ? ` style="${styles}"` : ''
                  }>${tagContent}</${tagName}>`,
                );
              }

              updatedText.push(content.slice(end));

              inputNodes.push(updatedText.join(''));
            }
          } else {
            const { cssProp, value } = property.code;

            if (parentNode === textRef) {
              // Has just text.
              if (start !== 0) {
                updatedText.push(content.slice(0, start));
              }

              updatedText.push(
                `<span style="${cssProp}:${value};">${content.slice(
                  start,
                  end,
                )}</span>`,
              );
              updatedText.push(content.slice(end));

              inputNodes.push(updatedText.join(''));
              return;
            }

            // Already has tag.
            const element = child.firstChild?.parentElement;

            if (element) {
              if (!itsChild) {
                const selectedText = selection.toString();

                element.innerHTML = element.innerHTML.replace(
                  selectedText,
                  `<span style="${cssProp}:${value};">${selectedText}</span>`,
                );
              } else {
                const childIndex = Array.from(element.children).findIndex(
                  indexChild => indexChild === comparativeNode,
                );

                const childElement =
                  element.children[childIndex].firstChild?.parentElement;

                if (childElement) {
                  const hasProp = childElement.style.getPropertyValue(cssProp);

                  if (hasProp && value === hasProp) {
                    childElement.style.removeProperty(cssProp);
                  } else {
                    childElement.style.setProperty(cssProp, value);
                  }
                }
              }

              inputNodes.push(element);
            }
          }
        });
      }

      setActiveProps([]);

      return inputNodes;
    },
    [inputRef],
  );

  const handleButtonClick = useCallback(
    (property: Property) => {
      if (!inputRef.current?.onfocus) {
        inputRef.current?.focus();
      }

      setTextProperty(getNodes(property));
    },
    [getNodes, inputRef, setTextProperty],
  );

  return (
    <Container>
      {properties.map(positions => (
        <ButtonPair key={positions[0].name + positions[1].name}>
          {positions.map((position: Property) => (
            <SideBarButton
              key={position.name}
              name={position.name}
              Icon={position.type === 'style' ? position.icon : undefined}
              active={activeProps.includes(position.name as SelectableProp)}
              onClick={() => handleButtonClick(position)}
            />
          ))}
        </ButtonPair>
      ))}
    </Container>
  );
};

export default SideBar;
