import React, { useCallback, useEffect, useRef } from 'react';
import SideBar from 'components/SideBar';
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
      inputRef.innerHTML = '';
      window.getSelection()?.setPosition(inputRef, 0);
    }
  }, []);

  const handleInputBlur = useCallback(() => {
    const inputRef = textInputRef.current;

    if (inputRef && inputRef.innerHTML === '') inputRef.innerHTML = placeHolder;
  }, []);

  const setTextProperty = useCallback((updatedChildren: (Node | string)[]) => {
    const inputRef = textInputRef.current;

    if (inputRef) {
      inputRef.innerHTML = '';

      const isText = (child: Node | string): string => {
        if (typeof child === 'string') return child;
        if (child instanceof Node && child.nodeName === '#text')
          return child.textContent || '';

        return '';
      };

      for (let ind = 0; ind < updatedChildren.length; ind++) {
        const child = updatedChildren[ind];
        let finalText = isText(child);

        if (finalText) {
          if (updatedChildren[ind + 1]) {
            for (let i = ind + 1; i < updatedChildren.length; i++, ind++) {
              const verify = isText(updatedChildren[i]);

              if (updatedChildren[i] && verify) finalText += verify;
              else break;
            }
          }

          inputRef.innerHTML += finalText;
        } else inputRef.appendChild(child as Node);
      }
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
    (childNodes: NodeListOf<ChildNode>, inputRef: HTMLPreElement) => {
      const selection = window.getSelection() as Selection;

      const { anchorOffset: start, focusNode: node } = selection;

      if (node && node.textContent && node.parentNode) {
        const cuttedString = node.textContent.slice(
          start,
          node.textContent.length,
        );

        const { length } = node.textContent as string;
        const { nodeName, parentNode } = node;

        const withoutTag =
          nodeName === '#text' && parentNode.nodeName === 'PRE';

        setTimeout(() => {
          const childrenArray = Array.from(childNodes);

          if (cuttedString) {
            let index = 0;

            if (withoutTag)
              index = childrenArray.findIndex(
                child => child.nodeName === 'DIV',
              );
            else index = childrenArray.findIndex(child => child === node) + 2;

            inputRef.removeChild(childrenArray[index] as Node);

            const lastChar = cuttedString?.charAt(cuttedString.length - 1);
            const selectedChild = childrenArray[index - 1];

            selectedChild.textContent += `\n${
              lastChar !== '\n' ? cuttedString : ''
            }`;

            const selectedNode = withoutTag
              ? selectedChild
              : selectedChild.firstChild;

            selection.setPosition(
              selectedNode,
              length - cuttedString.length + 1,
            );
          } else {
            childrenArray.forEach(
              child => child.nodeName === 'DIV' && inputRef.removeChild(child),
            );

            node.textContent += '\n\n';
            selection.setPosition(node, length + 1);
          }
        }, 1);
      }
    },
    [],
  );

  const handleBackspacePress = useCallback(
    (childNodes: NodeListOf<ChildNode>, inputRef: HTMLPreElement) => {
      const { focusNode } = window.getSelection() as Selection;
      const content = focusNode?.firstChild?.parentElement?.innerText;

      if (
        content?.charAt(content.length - 1) === '\n' &&
        focusNode?.nodeName === '#text'
      ) {
        const childrenArray = Array.from(childNodes);
        const index = childrenArray.findIndex(child => child.nodeName === 'BR');

        inputRef.removeChild(childrenArray[index]);
        childrenArray[index - 1].textContent += '\n';
      }
    },
    [],
  );

  const handleLineChange = useCallback(
    (key: string) => {
      const inputRef = textInputRef.current;

      if (inputRef) {
        const { childNodes } = inputRef;

        if (key === 'Enter') handleEnterPress(childNodes, inputRef);
        else if (key === 'Backspace')
          setTimeout(() => handleBackspacePress(childNodes, inputRef), 1);
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
