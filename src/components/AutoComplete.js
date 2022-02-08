import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { device } from '../constants/media';
import { useDebounce, useInput, useKeyboardControl } from '../hooks';
import { getFuzzyMatcher } from '../utils';

const Container = styled.div`
  width: 400px;
  box-shadow: ${({ $active }) =>
    $active ? '0 2px 4px 1px rgba(0, 0, 0, 0.2)' : '0 1px 1px 1px rgba(0, 0, 0, 0.1)'};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  background-color: white;

  @media ${device.mobile} {
    width: 100%;
  }
`;

const SearchBarContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const SearchBar = styled.input`
  flex: 1;
  font-size: 16px;
  padding: 10px;
  background-color: transparent;
`;

const Suggestions = styled.ul`
  display: ${({ $active, $isSuggestion }) => ($active && $isSuggestion ? 'block' : 'none')};
  width: 100%;
  font-size: 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  max-height: 150px;
  overflow-y: auto;
  padding: 10px;
  list-style: none;
  border-radius: 0 0 10px 10px;
  background-color: white;
`;

const Suggestion = styled.li`
  padding: 3px 0;
  cursor: pointer;

  &.hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const ClearButton = styled.div`
  font-size: 16px;
  padding: 10px;
  cursor: pointer;
`;

export default function AutoComplete({ delay = 300, keywords, initValue = '', onEnter }) {
  const searchBarRef = useRef();
  const suggestionsRef = useRef();

  const [active, setActive] = useState(false);
  const [mouseMode, setMouseMode] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);
  const { inputValue, onChange, setInputValue, clear } = useInput(initValue);
  const { onKeyDown } = useKeyboardControl({
    Enter() {
      if (!inputValue) return;
      let value = inputValue;
      if (selectedIndex >= 0) value = suggestions[selectedIndex];
      setSelectedIndex(-1);
      setInputValue(value);
      onEnter(value);
    },
    ArrowUp(event) {
      event.preventDefault();
      if (selectedIndex < 0) return;
      suggestionsRef.current.children[selectedIndex]?.classList.remove('hover');
      suggestionsRef.current.children[selectedIndex - 1]?.classList.add('hover');
      suggestionsRef.current.children[selectedIndex - 1]?.scrollIntoView({ block: 'nearest' });
      setSelectedIndex(selectedIndex - 1);
      setMouseMode(false);
    },
    ArrowDown(event) {
      event.preventDefault();
      if (selectedIndex + 1 >= suggestions.length) return;
      suggestionsRef.current.children[selectedIndex]?.classList.remove('hover');
      suggestionsRef.current.children[selectedIndex + 1]?.classList.add('hover');
      suggestionsRef.current.children[selectedIndex + 1]?.scrollIntoView({ block: 'nearest' });
      setSelectedIndex(selectedIndex + 1);
      setMouseMode(false);
    },
  });

  const debouncedGenerateSuggestions = useDebounce(() => {
    if (!inputValue) return setSuggestions([]);
    const regex = getFuzzyMatcher(inputValue);
    const filteredSuggestions = keywords
      .filter((keyword) => regex.test(keyword))
      .sort((lhs, rhs) => {
        const { index: lIndex } = [...lhs.matchAll(regex)][0] || {};
        const { index: rIndex } = [...rhs.matchAll(regex)][0] || {};
        return lIndex < rIndex ? -1 : 1;
      });
    setSuggestions(inputValue ? filteredSuggestions.slice(0, 30) : []);
  }, delay);

  useEffect(() => {
    debouncedGenerateSuggestions();
  }, [inputValue]);

  return (
    <Container $active={active} $isSuggestion={!!suggestions.length}>
      <SearchBarContainer>
        <SearchBar
          type="text"
          value={inputValue}
          autoComplete="off"
          ref={searchBarRef}
          onChange={(event) => {
            onChange(event);
            suggestionsRef.current.children[selectedIndex]?.classList.remove('hover');
            setSelectedIndex(-1);
          }}
          onKeyDown={onKeyDown}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
        />
        <ClearButton onClick={clear}>×</ClearButton>
      </SearchBarContainer>
      <Suggestions
        $active={active}
        $isSuggestion={!!suggestions.length}
        ref={suggestionsRef}
        onMouseDown={() => {
          setInputValue(suggestions[selectedIndex]);
          onEnter(suggestions[selectedIndex]);
          setSelectedIndex(-1);
        }}
      >
        {active &&
          suggestions.map((word, index) => (
            <Suggestion
              key={index}
              onMouseOver={() => setMouseMode(true)}
              onMouseEnter={(event) => {
                if (mouseMode) {
                  suggestionsRef.current.children[selectedIndex]?.classList.remove('hover');
                  event.target.classList.add('hover');
                  setSelectedIndex(index);
                }
              }}
              onMouseLeave={(event) => {
                if (mouseMode) {
                  suggestionsRef.current.children[selectedIndex]?.classList.remove('hover');
                  event.target.classList.remove('hover');
                  setSelectedIndex(-1);
                }
              }}
            >
              {word}
            </Suggestion>
          ))}
      </Suggestions>
    </Container>
  );
}
