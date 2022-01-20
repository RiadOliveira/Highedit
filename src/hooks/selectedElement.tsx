import React, { createContext, useContext, useState } from 'react';

interface IElementContext {
  selectedElement?: ChildNode;
  updateElement: (element?: ChildNode) => void;
}

const elementContext = createContext<IElementContext>({} as IElementContext);

const ElementContext: React.FC = ({ children }) => {
  const [selectedElement, setSelectedElement] = useState<ChildNode | undefined>(
    undefined,
  );
  const updateElement = (element?: ChildNode) => setSelectedElement(element);

  return (
    <elementContext.Provider value={{ selectedElement, updateElement }}>
      {children}
    </elementContext.Provider>
  );
};

const useElement = (): IElementContext => useContext(elementContext);

export { ElementContext, useElement };
