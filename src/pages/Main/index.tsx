import React, { useCallback, useEffect, useRef } from 'react';
import SideBar from 'components/SideBar';
import { useElement } from 'hooks/element';
import { Container, EditableArea, TextArea } from './styles';

const placeHolder =
  '<div style="color:#8e8e8e;">Insira o conteúdo aqui...</div>';

const Main: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLDivElement>(null);

  const { selectedElement, updateElement } = useElement();

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

      if (inputRef.innerHTML === '<br>') inputRef.innerHTML = '';
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

        let findedNode: ChildNode | undefined;

        // eslint-disable-next-line no-restricted-syntax
        for (const node of nodes) {
          if (node === comparativeNode) {
            findedNode = node;
            break;
          }

          const childNode = Array.from(node.childNodes).find(
            child => child === comparativeNode,
          );

          if (childNode) {
            findedNode = childNode;
            break;
          }
        }

        if (findedNode !== selectedElement) updateElement(findedNode);
      }
    },
    [selectedElement, updateElement],
  );

  const handleEnterPress = useCallback(
    (childNodes: NodeListOf<ChildNode>, inputRef: HTMLDivElement) => {
      const childrenArray = Array.from(childNodes);

      const findedChild = childrenArray.find(child => child.nodeName === 'DIV');

      const divText = findedChild?.textContent;
      inputRef.removeChild(findedChild as Node);

      // eslint-disable-next-line no-param-reassign
      inputRef.innerHTML += `<br>${divText || '<br>'}`;

      const linesQuantity =
        childrenArray.filter(child => child.nodeName === '#text').length * 2;

      window.getSelection()?.setPosition(inputRef, linesQuantity);
    },
    [],
  );

  const handleBackspacePress = useCallback(
    (childNodes: NodeListOf<ChildNode>, inputRef: HTMLDivElement) => {
      const selection = window.getSelection();

      if (selection && selection.focusNode && selection.anchorOffset === 0) {
        const index = Array.from(childNodes).findIndex(
          child => child === selection.focusNode,
        );
        const findedChild = childNodes[index];
        const previousChild = childNodes[index - 2]; // Exists <br> tag in middle.

        if (previousChild && previousChild.nodeName === '#text') {
          const { textContent } = findedChild;

          setTimeout(() => {
            const previousText = previousChild.textContent as string;

            previousChild.textContent += textContent as string;
            inputRef.removeChild(findedChild);
            selection.setPosition(previousChild, previousText.length);
          }, 1);
        }
      }
    },
    [],
  );

  const handleLineChange = useCallback(
    (key: string) => {
      const inputRef = textInputRef.current;

      if (inputRef) {
        const { childNodes } = inputRef;

        if (key === 'Enter')
          setTimeout(() => handleEnterPress(childNodes, inputRef), 1);
        else if (key === 'Backspace')
          handleBackspacePress(childNodes, inputRef);
      }
    },
    [handleBackspacePress, handleEnterPress],
  );

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
          onKeyDown={({ key }) => handleLineChange(key)}
          onSelect={({ currentTarget: { childNodes } }) =>
            handleContentSelect(Array.from(childNodes))
          }
        />
      </EditableArea>

      <SideBar
        inputRef={textInputRef}
        setTextProperty={updatedText => setTextProperty(updatedText)}
      />
    </Container>
  );
};

export default Main;
