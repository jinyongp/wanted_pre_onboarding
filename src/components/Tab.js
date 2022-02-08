import { Children, createContext, useContext, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { device } from '../constants/media';

const TabContext = createContext();

const useTabContext = () => {
  const context = useContext(TabContext);
  // if (!context) throw new Error('Tab 컴포넌트 내부에 위치해야 합니다.');
  return context;
};

const TabContainer = styled.div`
  width: 400px;
  height: 300px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;

  @media ${device.mobile} {
    width: 100%;
  }
`;

const SelectContainer = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.gray};
`;

const OptionContainer = styled.div`
  flex: 1;
  padding: 20px;
  text-align: center;
  cursor: ${({ $selected }) => $selected || 'pointer'};
  color: ${({ $selected, $disabled }) => $disabled || ($selected && 'white')};
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  background-color: ${({ $selected, $disabled, theme }) => $disabled || ($selected && theme.main)};

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.2;
      cursor: not-allowed;
    `}
`;

const PanelContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
`;

function Select({ children }) {
  const { currentTabName, setCurrentTabName } = useTabContext();

  useEffect(() => {
    const array = Children.toArray(children);
    const index = array?.findIndex(({ props: { name } }) => name === currentTabName);
    if (!currentTabName || index < 0) setCurrentTabName(array?.[0].props.name);
  }, []);

  return (
    <SelectContainer>
      {Children.map(children, ({ props: { children, name } }, index) => (
        <Option key={index} name={name}>
          {children}
        </Option>
      ))}
    </SelectContainer>
  );
}

function Option({ children, name }) {
  const { currentTabName, setCurrentTabName, disabledTabNames } = useTabContext();
  const disabled = disabledTabNames.has(name);
  return (
    <OptionContainer
      $selected={name === currentTabName}
      $disabled={disabled}
      onClick={() => disabled || setCurrentTabName(name)}
    >
      {children}
    </OptionContainer>
  );
}

function Panels({ children }) {
  const { currentTabName } = useTabContext();
  if (!currentTabName) return null;
  return Children.toArray(children)?.find(({ props: { name } }) => name === currentTabName) || null;
}

function Panel({ children }) {
  return <PanelContainer>{children}</PanelContainer>;
}

export default function Tab({ initialTab, children }) {
  const getTabNames = () => {
    return Children.toArray(
      Children.toArray(children)?.find(({ type }) => type === Select)?.props.children,
    )?.map((option) => option.props.name);
  };

  const getPanelNames = () => {
    return Children.toArray(
      Children.toArray(children)?.find(({ type }) => type === Panels)?.props.children,
    )?.map((option) => option.props.name);
  };

  const getDisabledTabNames = () => {
    const tabNames = getTabNames() || [];
    const panelNames = getPanelNames() || [];
    // if (new Set(tabNames).size !== tabNames?.length) throw new Error('탭 이름은 유일해야 합니다.');
    return tabNames.filter((name) => !panelNames.includes(name)) || [];
  };

  const [currentTabName, setCurrentTabName] = useState(initialTab);
  const [disabledTabNames, setDisabledTabNames] = useState(new Set());

  useEffect(() => {
    setDisabledTabNames(new Set(getDisabledTabNames()));
  }, [children]);

  return (
    <TabContext.Provider
      value={{ currentTabName, setCurrentTabName, disabledTabNames, setDisabledTabNames }}
    >
      <TabContainer>{children}</TabContainer>
    </TabContext.Provider>
  );
}

Tab.Select = Select;
Tab.Option = Option;
Tab.Panels = Panels;
Tab.Panel = Panel;
