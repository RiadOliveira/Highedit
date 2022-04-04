import React, { useCallback, useEffect, useState } from 'react';
import properties, { Property, PropertyName } from 'utils/properties';

import SideBarButton from 'components/SideBarButton';
import getUpdatedNodes from 'utils/getUpdatedNodes/index';
import generateElementsUsingArrayPositions2By2 from 'utils/generateElementsUsingArrayPositions2By2';
import getSelectedNodes from 'utils/getSelectedNodes';
import handleSpecialTagsWithModal from 'utils/specialTags/handleSpecialTagsWithModal';

import { useElement } from 'hooks/element';
import { useModal } from 'hooks/modal';
import { saveFile } from 'utils/specialTags';
import { ButtonPair, Container } from './styles';

interface SideBarProps {
  inputRef: React.RefObject<HTMLPreElement>;
  setUpdatedText: (updatedChildren: Node[]) => void;
}

const SideBar: React.FC<SideBarProps> = ({ inputRef, setUpdatedText }) => {
  const [activeProps, setActiveProps] = useState<PropertyName[]>([]);
  const { selectedElement, updateElement } = useElement();
  const { showModal } = useModal();

  // To handle selection change and highlight props of selected text.
  useEffect(() => {
    if (!selectedElement) return;

    const props: PropertyName[] = [];
    const textInput = inputRef.current;

    const { parentElement, firstChild } = selectedElement;
    if (firstChild?.nodeName === 'A') props.push('a');

    const isChild = parentElement !== textInput;
    if (isChild && parentElement?.nodeName === 'DIV') {
      const { style } = parentElement as HTMLElement;
      props.push(style.getPropertyValue('text-align') as PropertyName);
    }

    const elementStyle = firstChild?.parentElement?.getAttribute('style');

    // Gets all style props that a text has.
    properties.forEach(property => {
      if (property.type === 'style') {
        const {
          name,
          code: { value },
        } = property;

        if (elementStyle?.includes(value)) props.push(name);
      }
    });

    setActiveProps(props);
  }, [inputRef, selectedElement]);

  const handleButtonClick = useCallback(
    (property: Property) => {
      const textRef = inputRef.current as HTMLPreElement;

      if (property.name === 'save') {
        showModal({
          actionFunction: backgroundColor => saveFile(textRef, backgroundColor),
          type: 'input',
          inputType: 'color',
          initialValue: '#00112e',
          text: 'Insira a cor de fundo:',
        });

        return;
      }

      const selection = window.getSelection() as Selection;
      const selectedText = selection.toString();
      const isImage = property.name === 'img';

      if (!selectedText && !isImage) return;

      const childrenArray = Array.from(textRef.childNodes);
      const selectedNodes = getSelectedNodes(selection, childrenArray, isImage);

      // In order to not copy addresses of original object.
      const parsedProperty: Property = { ...property } as Property;
      const { code } = property;
      if (code && typeof code !== 'string') parsedProperty.code = { ...code };

      const { anchorOffset: start, focusOffset: end } = selection;
      const [firstNode] = selectedNodes;
      const { children } = firstNode;
      const firstSelectedNode = children ? children[0] : firstNode;

      handleSpecialTagsWithModal(
        parsedProperty,
        firstSelectedNode,
        showModal,
        () => {
          const selectionPoints = {
            start: Math.min(start, end),
            end: Math.max(start, end),
          };

          const props = {
            textRef,
            childrenArray,
            selectedNodes,
            property: parsedProperty,
            selectionPoints,
          };

          setUpdatedText(getUpdatedNodes(props));
        },
      );

      if (!textRef.onfocus) textRef.focus();

      // Resets all activeProps and selectedElement.
      setActiveProps([]);
      updateElement(undefined);
    },
    [inputRef, setUpdatedText, showModal, updateElement],
  );

  return (
    <Container>
      {generateElementsUsingArrayPositions2By2(
        properties,
        ButtonPair,
        property => (
          <SideBarButton
            key={property.name}
            name={property.name}
            Icon={property.icon || property.name}
            active={activeProps.includes(property.name as PropertyName)}
            onClick={() => handleButtonClick(property)}
          />
        ),
      )}
    </Container>
  );
};

export default SideBar;
