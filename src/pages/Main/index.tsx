import React, { useCallback, useEffect, useRef } from 'react';
import SideBar from 'components/SideBar';
import unifyAndSetElementChildren from 'utils/unifyAndSetElementChildren';

import { useElement } from 'hooks/element';
import { Container, EditableArea, TextArea } from './styles';

const placeHolder =
  '<div style="color:#8e8e8e;">Insira o conteúdo aqui...</div>';

const Main: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLPreElement>(null);

  const { selectedElement, updateElement } = useElement();

  useEffect(() => {
    if (textInputRef.current) textInputRef.current.innerHTML = placeHolder;
  }, []);

  const handleInputChange = useCallback(() => {
    const inputRef = textInputRef.current;
    const divRef = containerRef.current;

    if (inputRef && divRef) {
      inputRef.style.height = 'auto';
      inputRef.style.height = `${inputRef.scrollHeight - 5}px`;
      divRef.scrollTo({ top: inputRef.scrollHeight - 5 });

      if (inputRef.innerHTML === '<br>') inputRef.innerHTML = '';
    }
  }, []);

  const handleInputFocus = useCallback(() => {
    const inputRef = textInputRef.current;

    if (inputRef && inputRef.innerHTML === placeHolder) {
      inputRef.innerHTML = ' ';
      setTimeout(
        () => window.getSelection()?.setPosition(inputRef.firstChild, 0),
        1,
      );
    }
  }, []);

  const handleInputBlur = useCallback(() => {
    const inputRef = textInputRef.current;

    if (inputRef && inputRef.innerHTML === '') inputRef.innerHTML = placeHolder;
  }, []);

  const setUpdatedText = useCallback((updatedChildren: (Node | string)[]) => {
    const inputRef = textInputRef.current;
    if (inputRef) unifyAndSetElementChildren(updatedChildren, inputRef);
    window.getSelection()?.setPosition(inputRef); // Reset position.
  }, []);

  const handleContentSelect = useCallback(() => {
    const { anchorNode } = window.getSelection() as Selection;
    const { nodeName, parentNode } = anchorNode as Node;

    if (nodeName === 'PRE') return; // Initial Selection.
    if (nodeName === '#text' && parentNode?.nodeName === 'PRE') return;

    const textRef = textInputRef.current;

    if (textRef) {
      const selectedNode = (() => {
        if (parentNode?.nodeName !== 'A') return parentNode;

        return parentNode.parentNode;
      })() as Node;

      // If it's a different element, update it.
      if (selectedNode !== selectedElement) updateElement(selectedNode);
    }
  }, [selectedElement, updateElement]);

  return (
    <Container ref={containerRef}>
      <h1>Highedit</h1>

      <EditableArea>
        <TextArea
          ref={textInputRef}
          contentEditable
          onInput={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onSelect={handleContentSelect}
        />
      </EditableArea>

      <SideBar
        inputRef={textInputRef}
        setUpdatedText={updatedText => setUpdatedText(updatedText)}
      />
    </Container>
  );
};

export default Main;
