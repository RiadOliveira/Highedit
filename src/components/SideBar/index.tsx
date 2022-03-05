import React, { useCallback, useEffect, useState } from 'react';
import properties, { Property, PropertyName } from 'utils/properties';

import SideBarButton from 'components/SideBarButton';
import getUpdatedNodes from 'utils/getUpdatedNodes/index';
import generateElementsUsingArrayPositions2By2 from 'utils/generateElementsUsingArrayPositions2By2';
import getSelectedNodes from 'utils/getSelectedNodes';
import handleSpecialTagsWithModal from 'utils/specialTags/handleSpecialTagsWithModal';

import { useElement } from 'hooks/element';
import { useModal } from 'hooks/modal';
import { ButtonPair, Container } from './styles';

interface SideBarProps {
  inputRef: React.RefObject<HTMLPreElement>;
  setUpdatedText: (updatedChildren: (Node | string)[]) => void;
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
    const { parentElement, firstChild, nodeName } = selectedElement;

    const isSpecialTag = nodeName !== 'SPAN' && nodeName !== 'SECTION';
    if (isSpecialTag) props.push(nodeName.toLowerCase() as PropertyName);

    const isChild = parentElement !== textInput || firstChild?.nodeName === 'A';
    if (isChild) props.push(firstChild?.nodeName.toLowerCase() as PropertyName);

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
      const selection = window.getSelection() as Selection;
      const selectedText = selection.toString();

      const textRef = inputRef.current as HTMLPreElement;
      const childrenArray = Array.from(textRef.childNodes);
      const isImage = property.name === 'img';

      if (!selectedText && !isImage) setUpdatedText(childrenArray);
      else {
        const selectedNodes = getSelectedNodes(
          selection,
          childrenArray,
          isImage,
        );

        const { anchorOffset: start, focusOffset: end } = selection;
        const parsedProperty: Property = { ...property };

        const firstNode = selectedNodes[0];
        const firstSelectedNode = firstNode.children
          ? firstNode.children[0]
          : firstNode;

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
      }

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
