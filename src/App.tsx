import React, { useCallback, useEffect, useRef, useState } from 'react';
import SideBar from 'components/SideBar';
import { Container, EditableArea, TextArea } from './styles';

const placeHolder =
  '<div style="color:#8e8e8e;">Insira o conteúdo aqui...</div>';

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLDivElement>(null);

  const [selectedElement, setSelectedElement] = useState<ChildNode | undefined>(
    undefined,
  );

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.innerHTML = placeHolder;
    }
  }, []);

  const handleInputChange = useCallback(() => {
    const inputRef = textInputRef.current;
    const divRef = containerRef.current;

    if (inputRef && divRef) {
      inputRef.style.height = 'auto';
      inputRef.style.height = `${inputRef.scrollHeight - 5}px`;
      divRef.scrollTo({ top: inputRef.scrollHeight - 5 });
    }
  }, []);

  const handleInputFocus = useCallback(() => {
    const inputRef = textInputRef.current;

    if (inputRef && inputRef.innerHTML === placeHolder) {
      inputRef.innerHTML = '';
      window.getSelection()?.setPosition(inputRef, 0);
    }
  }, []);

  const handleInputBlur = useCallback(() => {
    const inputRef = textInputRef.current;

    if (inputRef && inputRef.innerHTML === '') {
      inputRef.innerHTML = placeHolder;
    }
  }, []);

  const setTextProperty = useCallback((updatedChildren: (Node | string)[]) => {
    const inputRef = textInputRef.current;

    if (inputRef) {
      inputRef.innerHTML = '';

      updatedChildren.forEach(child => {
        if (typeof child === 'string') {
          inputRef.innerHTML += child;
        } else {
          inputRef.appendChild(child);
        }
      });
    }
  }, []);

  const handleContentSelect = useCallback(
    (nodes: ChildNode[]) => {
      const selection = window.getSelection();
      const textRef = textInputRef.current;

      if (selection && textRef) {
        const parentNode = selection.anchorNode?.parentNode;
        const comparativeNode: Node | null | undefined =
          parentNode !== textRef ? parentNode : selection.anchorNode;

        const findedNode = nodes.find(node => node === comparativeNode);
        if (findedNode !== selectedElement) setSelectedElement(findedNode);
      }
    },
    [selectedElement],
  );

  return (
    <Container ref={containerRef}>
      <h1>Highedit</h1>

      <EditableArea>
        <TextArea
          ref={textInputRef}
          contentEditable
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onSelect={({ currentTarget: { childNodes } }) =>
            handleContentSelect(Array.from(childNodes))
          }
        />
      </EditableArea>

      <SideBar
        inputRef={textInputRef}
        setTextProperty={updatedText => setTextProperty(updatedText)}
        selectedElement={selectedElement}
      />
    </Container>
  );
};

export default App;
