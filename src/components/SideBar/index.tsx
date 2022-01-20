import React, { useCallback, useEffect, useState } from 'react';
import SideBarButton from 'components/SideBarButton';
import { useElement } from 'hooks/element';
import { ButtonPair, Container } from './styles';
import properties, { Property, SelectableProp } from '../../utils/properties';
import cases from '../../utils/formattingCases';

interface SideBarProps {
  inputRef: React.RefObject<HTMLDivElement>;
  setTextProperty: (updatedChildren: (Node | string)[]) => void;
}

const SideBar: React.FC<SideBarProps> = ({ inputRef, setTextProperty }) => {
  const [activeProps, setActiveProps] = useState<SelectableProp[]>([]);
  const { selectedElement, updateElement } = useElement();

  useEffect(() => {
    if (selectedElement && selectedElement.nodeName !== 'text') {
      const props: SelectableProp[] = [];
      const { nodeName, parentElement, firstChild } = selectedElement;

      const isChild = selectedElement.parentElement !== inputRef.current;

      if (nodeName !== 'SPAN') {
        props.push(nodeName.toLowerCase() as SelectableProp);
      } else if (isChild) {
        props.push(parentElement?.nodeName.toLowerCase() as SelectableProp);
      }

      let elementStyle = firstChild?.parentElement?.getAttribute('style');

      if (isChild) {
        elementStyle += parentElement?.getAttribute('style') || '';
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
        const { anchorOffset: start, focusOffset: end, anchorNode } = selection;
        const points = { start, end };
        const parentNode = anchorNode?.parentNode;

        const comparativeNode: Node | null | undefined =
          parentNode !== textRef ? parentNode : anchorNode;

        textRef.childNodes.forEach(child => {
          const isChild = Array.from(child.childNodes).includes(
            comparativeNode as ChildNode,
          );

          if (comparativeNode !== child && !isChild) {
            inputNodes.push(child);
            return;
          }

          switch (property.type) {
            case 'tag':
              inputNodes.push(cases.tag(points, property.name, child));
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
                if (isChild) {
                  hasTag.isChild(element, comparativeNode as Node, code);
                  inputNodes.push(element);
                  return;
                }

                inputNodes.push(
                  hasTag.notChild(element, selection.toString(), points, code),
                );
              }
            }
          }
        });
      }

      setActiveProps([]);
      updateElement(undefined);

      return inputNodes;
    },
    [inputRef, updateElement],
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
