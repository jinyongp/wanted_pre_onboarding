import { useState } from 'react';
import styled from 'styled-components';

const SwitchContainer = styled.div`
  width: 90px;
  height: 40px;
  border-radius: 150px;
  padding: 0 5px;
  border: none;
  transition: background-color 0.2s ease-in-out;
  background-color: ${({ $on, theme }) => ($on ? theme.main : theme.gray)};
  box-shadow: 0 0 2px 0px rgba(0, 0, 0, 0.8) inset;
  display: flex;
  align-items: center;
`;

const Switch = styled.button`
  width: 30px;
  height: 30px;
  cursor: pointer;
  text-align: center;
  border-radius: 50px;
  background-color: white;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0 0 2px 0px rgba(0, 0, 0, 0.8);
  transform: translateX(${({ $on }) => ($on ? 50 : 0)}px);
  display: flex;
  justify-content: center;
  align-items: center;

  &::before {
    content: '${({ $on }) => ($on ? 'ON' : 'OFF')}';
    font-size: 14px;
    color: ${({ $on, theme }) => ($on ? theme.main : theme.gray)};
  }
`;

export default function Toggle({ onToggle = () => {}, initState = false }) {
  const [on, turnOn] = useState(initState);

  const onClick = () => {
    onToggle(!on);
    turnOn((prev) => !prev);
  };

  return (
    <SwitchContainer $on={on}>
      <Switch $on={on} onClick={onClick} />
    </SwitchContainer>
  );
}
