import React, { useCallback, useEffect, useState } from 'react';
import SideBarButton from 'components/SideBarButton';
import { useElement } from 'hooks/element';
import properties, { Property, PropertyName } from 'utils/properties';
import cases from 'utils/formattingCases';
import specialFunctions from 'utils/specialTags';
import { ButtonPair, Container } from './styles';

interface SideBarProps {
  inputRef: React.RefObject<HTMLPreElement>;
  setUpdatedText: (updatedChildren: (Node | string)[]) => void;
}

const SideBar: React.FC<SideBarProps> = ({ inputRef, setUpdatedText }) => {
  const [activeProps, setActiveProps] = useState<PropertyName[]>([]);
  const { selectedElement, updateElement } = useElement();

  // To handle selection change and highlight props of selected text.
  useEffect(() => {
    if (selectedElement && selectedElement.nodeName !== 'text') {
      const props: PropertyName[] = [];
      const { nodeName, parentElement, firstChild } = selectedElement;

      const isChild = selectedElement.parentElement !== inputRef.current;

      // To verify and get tags applied and highlighted it (Except div and span).
      if (nodeName !== 'SPAN' && nodeName !== 'DIV')
        props.push(nodeName.toLowerCase() as PropertyName);
      else if (isChild) {
        props.push(parentElement?.nodeName.toLowerCase() as PropertyName);
      }

      let elementStyle = firstChild?.parentElement?.getAttribute('style');

      // To get parent's styles highlighted too.
      if (isChild) elementStyle += parentElement?.getAttribute('style') || '';

      // Gets all style props that a text has.
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

  // Function to return all nodes, including the updated node with the property pressed.
  const getNodes = useCallback(
    (property: Property): (Node | string)[] => {
      const selection = window.getSelection();
      const textRef = inputRef.current;

      // Will store all nodes.
      const inputNodes: (Node | string)[] = [];

      if (selection && textRef) {
        const { anchorOffset: start, focusOffset: end, anchorNode } = selection;
        const points = {
          start: Math.min(start, end),
          end: Math.max(start, end),
        };
        const parentNode = anchorNode?.parentNode;

        // Gets selectedNode without error.
        const comparativeNode: Node | null | undefined =
          parentNode !== textRef ? parentNode : anchorNode;

        // Iterate through all children of the created text.
        textRef.childNodes.forEach(child => {
          const isChild = Array.from(child.childNodes).includes(
            comparativeNode as ChildNode,
          );

          // If the child isn't the selected, return it without changes.
          if (comparativeNode !== child && !isChild) {
            inputNodes.push(child);
            return;
          }

          switch (property.type) {
            case 'tag':
              inputNodes.push(
                cases.tag(points, selection.toString(), property.name, child),
              );
              break;

            case 'special':
              inputNodes.push(
                specialFunctions.link(
                  child,
                  comparativeNode as Node,
                  selection.toString(),
                ),
              );
              break;

            default: {
              const { code } = property;
              const {
                style: { hasTag, justText },
              } = cases;

              if (parentNode === textRef) {
                inputNodes.push(justText(points, code, child));
                return;
              }

              const element = child.firstChild?.parentElement;

              if (element) {
                if (isChild)
                  inputNodes.push(
                    hasTag.isChild(element, comparativeNode as Node, code),
                  );
                else
                  inputNodes.push(
                    hasTag.notChild(
                      element,
                      selection.toString(),
                      points,
                      code,
                    ),
                  );
              }
            }
          }
        });
      }

      // Resets all activeProps and selectedElement.
      setActiveProps([]);
      updateElement(undefined);

      return inputNodes;
    },
    [inputRef, updateElement],
  );

  const handleButtonClick = useCallback(
    (property: Property) => {
      if (!inputRef.current?.onfocus) inputRef.current?.focus();
      setUpdatedText(getNodes(property));
    },
    [getNodes, inputRef, setUpdatedText],
  );

  return (
    <Container>
      {properties.map(positions => (
        <ButtonPair key={positions[0].name + positions[1].name}>
          {positions.map((position: Property) => (
            <SideBarButton
              key={position.name}
              name={position.name}
              Icon={position.icon || position.name}
              active={activeProps.includes(position.name as PropertyName)}
              onClick={() => handleButtonClick(position)}
            />
          ))}
        </ButtonPair>
      ))}
    </Container>
  );
};

export default SideBar;
