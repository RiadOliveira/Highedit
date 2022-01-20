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

          findedNode = childNode;
          break;
        }

        if (findedNode !== selectedElement) updateElement(findedNode);
      }
    },
    [selectedElement, updateElement],
  );

  const handleNewLineAdd = useCallback((key: string) => {
    const inputRef = textInputRef.current;

    if (key === 'Enter' && inputRef) {
      setTimeout(() => {
        const childrenArray = Array.from(inputRef.childNodes);

        const findedChild = childrenArray.find(
          child => child.nodeName === 'DIV',
        );

        const divText = findedChild?.textContent;
        inputRef.removeChild(findedChild as Node);

        inputRef.innerHTML += `<br>${divText || '<br>'}`;

        const linesQuantity =
          childrenArray.filter(child => child.nodeName === '#text').length * 2;

        window.getSelection()?.setPosition(inputRef, linesQuantity);
      }, 1);
    }
  }, []);

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
          onKeyDown={({ key }) => handleNewLineAdd(key)}
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
