import { useState } from 'react';

export default function useInput(initialInputValue, validator = () => true) {
  const [inputValue, setInputValue] = useState(initialInputValue || '');

  const onChange = ({ target: { value } }) => {
    validator(value) && setInputValue(value);
  };

  const clear = () => {
    setInputValue('');
  };

  return { inputValue, onChange, setInputValue, clear };
}
