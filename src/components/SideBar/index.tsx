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
      const { nodeName } = selectedElement;

      const isChild = selectedElement.parentElement !== inputRef.current;

      if (nodeName !== 'SPAN') {
        props.push(nodeName.toLowerCase() as SelectableProp);
      } else if (isChild) {
        props.push(
          selectedElement.parentElement?.nodeName.toLowerCase() as SelectableProp,
        );
      }

      let elementStyle =
        selectedElement?.firstChild?.parentElement?.getAttribute('style');

      if (isChild) {
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
          const isChild = Array.from(child.childNodes).includes(
            comparativeNode as ChildNode,
          );

          if (comparativeNode !== child && !isChild) {
            inputNodes.push(child);
            return;
          }

          const content = child.textContent || '';
          const updatedText: string[] = [];

          if (property.type === 'tag')
            inputNodes.push(cases.tag({ start, end }, property.name, child));
          else {
            const { code } = property;

            const hasJustText = parentNode === textRef;

            if (parentNode === textRef) {
              inputNodes.push(
                cases.style.justText({ start, end }, code, child),
              );
              return;
            }

            // Already has tag.
            const element = child.firstChild?.parentElement;

            if (element) {
              if (!isChild) {
                cases.style.hasTag.notChild(
                  { child, code },
                  selection.toString(),
                );
              } else {
                cases.style.hasTag.isChild(
                  { child, code },
                  comparativeNode as Node,
                );
              }

              inputNodes.push(element);
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
