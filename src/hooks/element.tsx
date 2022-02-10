import React, { createContext, useContext, useState } from 'react';

interface IElementContext {
  selectedElement?: Node;
  updateElement: (element?: Node) => void;
}

const elementContext = createContext<IElementContext>({} as IElementContext);

const ElementContext: React.FC = ({ children }) => {
  const [selectedElement, setSelectedElement] = useState<Node | undefined>(
    undefined,
  );
  const updateElement = (element?: Node) => setSelectedElement(element);

  return (
    <elementContext.Provider value={{ selectedElement, updateElement }}>
      {children}
    </elementContext.Provider>
  );
};

const useElement = (): IElementContext => useContext(elementContext);

export { ElementContext, useElement };
