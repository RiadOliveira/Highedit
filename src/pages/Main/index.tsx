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

  const setUpdatedText = useCallback((updatedChildren: (Node | string)[]) => {
    const inputRef = textInputRef.current;

    if (inputRef) {
      inputRef.innerHTML = '';

      // Function to get text content of only text tags.
      const isText = (child: Node | string): string => {
        if (typeof child === 'string') return child;
        if (child instanceof Node && child.nodeName === '#text')
          return child.textContent || '';

        return '';
      };

      // Iterate over children
      for (let ind = 0; ind < updatedChildren.length; ind++) {
        const child = updatedChildren[ind];
        let finalText = isText(child);

        if (finalText) {
          // If has other tags with only text, and they aren't together.
          if (updatedChildren[ind + 1]) {
            for (let i = ind + 1; i < updatedChildren.length; i++, ind++) {
              const verify = isText(updatedChildren[i]);

              // Join texts.
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

        // Gets selectedNode without error.
        const comparativeNode: Node | null | undefined =
          parentNode !== textRef ? parentNode : selection.anchorNode;

        let findedNode: ChildNode | undefined;

        // eslint-disable-next-line no-restricted-syntax
        for (const node of nodes) {
          // Loop to find which node is (Can be child).
          if (node === comparativeNode) {
            findedNode = node;
            break;
          }

          // In case that the element is a child of the node.
          const childNode = Array.from(node.childNodes).find(
            child => child === comparativeNode,
          );

          if (childNode) {
            findedNode = childNode;
            break;
          }
        }

        // If it's a different element, update it.
        if (findedNode !== selectedElement) updateElement(findedNode);
      }
    },
    [selectedElement, updateElement],
  );

  // Function to insert '\n' instead of create a new <div> and <br>. (To facilitate texts handling)
  const handleEnterPress = useCallback(
    (childNodes: NodeListOf<ChildNode>, inputRef: HTMLPreElement) => {
      const selection = window.getSelection() as Selection;
      const { anchorOffset: start, focusNode: node } = selection;

      if (node && node.textContent && node.parentNode) {
        const cuttedString = node.textContent.slice(
          start,
          node.textContent.length,
        ); // If has string after the point where Enter was pressed.

        const { length } = node.textContent as string;
        const { nodeName, parentNode } = node;

        const withoutTag =
          nodeName === '#text' && parentNode.nodeName === 'PRE';

        // Timeout to exclude the create <div>.
        setTimeout(() => {
          const childrenArray = Array.from(childNodes);

          if (cuttedString) {
            let index = 0;

            /* If has tag, a div isn't created (When has cuttedString),
               is created a copy of the tag. */
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

            // Sets cursor position on the new line
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

      const comparativeNode =
        focusNode?.nodeName === 'PRE' ? focusNode.firstChild : focusNode;

      if (
        content?.charAt(content.length - 1) === '\n' &&
        comparativeNode?.nodeName === '#text'
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
        setUpdatedText={updatedText => setUpdatedText(updatedText)}
      />
    </Container>
  );
};

export default Main;
