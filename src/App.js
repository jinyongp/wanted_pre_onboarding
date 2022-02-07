import { useState } from 'react';
import styled, { css, ThemeProvider } from 'styled-components';
import { AutoComplete, ClickToEdit, Modal, Tab, Tag, Toggle } from './components';
import { device } from './constants/media';
import { theme } from './constants/theme';
import { keywords, lorem } from './data';
import { GlobalStyle } from './global-style';

const centerItems = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Center = styled.div`
  width: 100%;
  height: 100%;
  ${centerItems}
`;

const MainLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 30px 0;
  padding: 10px;
`;

const ComponentName = styled.h2``;

const ComponentKind = styled.h4`
  align-self: flex-start;
  &::after {
    content: ':';
  }
`;

const ComponentContainer = styled.div`
  padding: 20px;
  margin: 30px 0;
  display: flex;
  flex-direction: ${({ horizontal }) => (horizontal ? 'row' : 'column')};
  gap: 20px;
  justify-content: start;
  align-items: center;
  border-radius: 20px;
  box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.1);
  min-width: 400px;

  @media ${device.mobile} {
    width: 100%;
    min-width: auto;
  }
`;

const ZIndexItem = styled.div`
  ${centerItems}
  z-index: ${({ zIndex }) => zIndex};
  color: white;
  padding: 10px;
  border-radius: 15px;
  background-color: rgba(0, 0, 0, 0.8);
`;

const Label = styled.span`
  text-align: center;
  white-space: nowrap;
  font-family: 'Ubuntu Mono', monospace;
`;

const ToggleContainer = () => {
  const [on, setOn] = useState(false);

  return (
    <>
      <Toggle onToggle={setOn} />
      <Label>Toggle Switch {on ? 'ON' : 'OFF'}</Label>
    </>
  );
};

const AutoCompleteContainer = () => {
  const [query, setQuery] = useState('');

  return (
    <Center style={{ flexDirection: 'column', justifyContent: 'space-between', height: 250 }}>
      <AutoComplete name="games" keywords={keywords} onEnter={setQuery} />
      <Label style={{ alignSelf: 'start' }}>입력한 검색어: {query}</Label>
    </Center>
  );
};

const ClickToEditContainer = () => {
  const [name, setName] = useState('김코딩');
  const [age, setAge] = useState('20');

  return (
    <>
      <ClickToEdit label="이름" initValue={name} onEnter={setName} />
      <ClickToEdit label="나이" initValue={age} onEnter={setAge} />
      <Label>
        {name}
        {age && `, ${age}`}
      </Label>
    </>
  );
};

export default function App() {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <MainLayout>
          <ComponentName>Toggle</ComponentName>
          <ComponentContainer>
            <ComponentKind>Default</ComponentKind>
            <ToggleContainer />
            <ComponentKind>Init On</ComponentKind>
            <Toggle initState={true} onToggle={(state) => console.log(state)} />
          </ComponentContainer>
          <ComponentName>Modal</ComponentName>
          <ComponentContainer>
            <ComponentKind>Default</ComponentKind>
            <Modal />
            <ComponentKind>Pass Children</ComponentKind>
            <Modal title="Custom Modal">You can pass children components.</Modal>
            <ZIndexItem zIndex={1}>z-index: 1;</ZIndexItem>
          </ComponentContainer>
          <ComponentName>Tab</ComponentName>
          <ComponentContainer>
            <ComponentKind>Default</ComponentKind>
            <Tab>
              <Tab.Select>
                <Tab.Option name="one">Tab 1</Tab.Option>
                <Tab.Option name="two">Tab 2</Tab.Option>
                <Tab.Option name="three">Tab 3</Tab.Option>
              </Tab.Select>
              <Tab.Panels>
                <Tab.Panel name="one">
                  <Center>Tab Menu ONE</Center>
                </Tab.Panel>
                <Tab.Panel name="two">
                  <Center>Tab Menu TWO</Center>
                </Tab.Panel>
                <Tab.Panel name="three">
                  <Center>Tab Menu THREE</Center>
                </Tab.Panel>
              </Tab.Panels>
            </Tab>
            <ComponentKind>Disabled</ComponentKind>
            <Tab>
              <Tab.Select>
                <Tab.Option name="one">Tab 1</Tab.Option>
                <Tab.Option name="two">Tab 2</Tab.Option>
                <Tab.Option name="three">Tab 3</Tab.Option>
              </Tab.Select>
              <Tab.Panels>
                <Tab.Panel name="two">
                  <Center>Tab Menu TWO</Center>
                </Tab.Panel>
                <Tab.Panel name="one">
                  <h4 style={{ textAlign: 'center', margin: 20 }}>Tab Menu ONE (Long Contents)</h4>
                  <div>
                    {lorem.map((ipsum, i) => (
                      <p key={i} style={{ marginBottom: 10 }}>
                        {ipsum}
                      </p>
                    ))}
                  </div>
                </Tab.Panel>
                {/* <Tab.Panel name="three">
                  <Center>Tab Menu THREE</Center>
                </Tab.Panel> */}
              </Tab.Panels>
            </Tab>
          </ComponentContainer>
          <ComponentName>Tag</ComponentName>
          <ComponentContainer>
            <ComponentKind>Empty</ComponentKind>
            <Tag />
            <ComponentKind>Wrap(w/ Drag)</ComponentKind>
            <Tag initTags={['codestates', 'wanted', 'onboarding', 'kimcoding']} />
          </ComponentContainer>
          <ComponentName>AutoComplete</ComponentName>
          <ComponentContainer>
            <ComponentKind>Default(Fuzzy)</ComponentKind>
            <AutoCompleteContainer />
          </ComponentContainer>
          <ComponentName>ClickToEdit</ComponentName>
          <ComponentContainer>
            <ComponentKind>Default</ComponentKind>
            <ClickToEditContainer />
            <ComponentKind>Console</ComponentKind>
            <ClickToEdit onEnter={(value) => console.log(value)} />
          </ComponentContainer>
        </MainLayout>
      </ThemeProvider>
    </>
  );
}
