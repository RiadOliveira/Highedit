import React, { createContext, useState, useContext, useCallback } from 'react';
import Modal from 'components/Modal';
import { useTransition } from 'react-spring';

interface IModalProps {
  isVisible: boolean;
  text?: string;
  actionFunction: (modalText: string) => void;
  type: 'select' | 'input';
}

interface IModalContextData {
  modalProps: Omit<IModalProps, 'isVisible'>;
  showModal: (ModalProps: Omit<IModalProps, 'isVisible'>) => void;
  hideModal: () => void;
}

const modalContext = createContext<IModalContextData>({} as IModalContextData);

const initialData: IModalProps = {
  isVisible: false,
  type: 'input',
  actionFunction: () => null,
};

const ModalContext: React.FC = ({ children }) => {
  const [modalProps, setModalProps] = useState<IModalProps>(initialData);

  const showModal = useCallback((props: Omit<IModalProps, 'isVisible'>) => {
    setModalProps({ ...props, isVisible: true });
  }, []);

  const hideModal = useCallback(() => setModalProps(initialData), []);

  const modalTransition = useTransition(modalProps.isVisible, {
    from: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
      delay: 200,
    },
    leave: {
      opacity: 0,
    },
    config: {
      duration: 400,
    },
  });

  return (
    <modalContext.Provider
      value={{
        modalProps,
        showModal,
        hideModal,
      }}
    >
      {children}
      {modalTransition((style, item) => item && <Modal style={style} />)}
    </modalContext.Provider>
  );
};

const useModal = (): IModalContextData => useContext(modalContext);

export { ModalContext, useModal };
