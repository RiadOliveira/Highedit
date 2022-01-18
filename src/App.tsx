import React, { useCallback, useEffect, useRef } from 'react';
import SideBar from 'components/SideBar';
import { Container, EditableArea, TextArea } from './styles';

const placeHolder =
  '<div style="color:#8e8e8e;">Insira o conteúdo aqui...</div>';

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLDivElement>(null);

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
    }
  }, []);

  const handleInputBlur = useCallback(() => {
    const inputRef = textInputRef.current;

    if (inputRef && inputRef.innerHTML === '') {
      inputRef.innerHTML = placeHolder;
    }
  }, []);

  const setTextProperty = useCallback(updatedText => {
    if (textInputRef.current) {
      textInputRef.current.innerHTML = updatedText;
    }
  }, []);

  return (
    <Container ref={containerRef}>
      <h1>Highedit</h1>

      <EditableArea
        onClick={() => {
          textInputRef.current?.focus();
        }}
      >
        <TextArea
          ref={textInputRef}
          contentEditable
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </EditableArea>

      <SideBar
        inputRef={textInputRef}
        setTextProperty={updatedText => setTextProperty(updatedText)}
      />
    </Container>
  );
};

export default App;
