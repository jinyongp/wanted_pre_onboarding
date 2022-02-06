import { useRef } from 'react';
import styled from 'styled-components';
import { useInput, useKeyboardControl } from '../hooks';

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Label = styled.label``;

const ClickableInput = styled.input`
  font-size: 16px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  padding: 6px;
  text-align: left;
  cursor: text;

  &:disabled {
    text-align: center;
    cursor: pointer;
    background-color: white;
  }

  &:not(:disabled)::placeholder {
    opacity: 0;
  }
`;

export default function ClickToEdit({ label, initValue, onEnter }) {
  const inputRef = useRef();
  const { inputValue, onChange } = useInput(initValue, (value) => inputValue || value !== ' ');
  const { onKeyDown } = useKeyboardControl({
    Enter() {
      inputRef.current.blur();
    },
  });

  return (
    <InputContainer
      onClick={(event) => {
        if (event.target === inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.select();
        }
      }}
    >
      <Label htmlFor={label}>{label}</Label>
      <ClickableInput
        disabled
        id={label}
        value={inputValue}
        placeholder="Click to edit!"
        ref={inputRef}
        onBlur={() => {
          inputRef.current.disabled = true;
          inputValue && onEnter(inputValue);
        }}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </InputContainer>
  );
}
