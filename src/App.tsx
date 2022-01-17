import React, { useCallback, useRef } from 'react';
import SideBar from 'components/SideBar';
import { Container, EditableArea } from './styles';

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = useCallback(() => {
    const inputRef = textInputRef.current;
    const divRef = containerRef.current;

    if (inputRef && divRef) {
      inputRef.style.height = 'auto';
      inputRef.style.height = `${inputRef.scrollHeight - 5}px`;
      divRef.scrollTo({ top: inputRef.scrollHeight - 5 });
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
        <textarea
          placeholder="Insira o conteúdo aqui"
          ref={textInputRef}
          onChange={handleInputChange}
        />
      </EditableArea>

      <SideBar />
    </Container>
  );
};

export default App;
