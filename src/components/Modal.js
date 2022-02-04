import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.main};
  color: white;
  font-weight: 500;
  width: 120px;
  height: 60px;
  padding: 20px;
  border-radius: 80px;
  cursor: pointer;
`;

const ModalBackground = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2147483647;
`;

const ModalContainer = styled.div`
  width: 400px;
  height: 200px;
  border-radius: 30px;
  box-shadow: 0 3px 10px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalHeader = styled.div`
  font-family: 'Ubuntu Mono', monospace;
`;

const ExitButton = styled.div`
  position: absolute;
  top: 12px;
  left: 50%;
  font-size: 20px;
  cursor: pointer;
`;

export default function Modal({ title = 'Open Modal', children }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.classList.add('disable-scroll');
    else document.body.classList.remove('disable-scroll');
  }, [open]);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <>
      <Button onClick={openModal}>{title}</Button>
      {open && (
        <ModalBackground onClick={closeModal}>
          <ModalContainer onClick={(event) => event.stopPropagation()}>
            <ExitButton onClick={closeModal}>⊗</ExitButton>
            <ModalHeader>{children || 'HELLO CODESTATES!'}</ModalHeader>
          </ModalContainer>
        </ModalBackground>
      )}
    </>
  );
}
