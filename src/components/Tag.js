import { useState } from 'react';
import styled from 'styled-components';
import { useInput, useKeyboardControl } from '../hooks';

const TagContainer = styled.div`
  width: 400px;
  min-height: 40px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.5)')};
  flex-wrap: wrap;
  margin: 10px;
`;

const TagItem = styled.div`
  display: flex;
  height: 30px;
  gap: 5px;
  align-items: center;
  padding: 0 10px;
  margin: 5px;
  background-color: ${({ theme }) => theme.main};
  border-radius: 5px;
`;

const TagName = styled.div`
  color: white;
  white-space: nowrap;
  font-family: 'Ubuntu Mono', monospace;
`;

const AddTagInput = styled.input`
  flex: 1;
  height: 30px;
  padding: 10px;
  margin: 5px;
  min-width: 100px;
`;

const TagDeleteButton = styled.div`
  background-color: white;
  border-radius: 50px;
  width: 15px;
  height: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  position: relative;

  &::before,
  &::after {
    content: '';
    width: 10px;
    height: 2px;
    background-color: black;
    position: absolute;
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }
`;

const useTag = (initialTags) => {
  const [tagList, setTagList] = useState(new Set(initialTags.map((tag) => tag.trim())));

  const addTag = (tag) => {
    if (!tag.match(/\S/)) return;
    setTagList((prev) => prev.add(tag.trim()));
  };

  const deleteTag = (tag) => {
    tagList.delete(tag.trim());
    setTagList(new Set(tagList));
  };

  return { tagList: [...tagList], addTag, deleteTag };
};

export default function Tag({ initTags = [] }) {
  const [active, setActive] = useState(false);
  const { tagList, addTag, deleteTag } = useTag(initTags);
  const {
    inputValue: tagName,
    onChange,
    clear,
  } = useInput('', (value) => {
    if (value === ' ' && !tagName) return false;
    return true;
  });
  const { onKeyPress } = useKeyboardControl({
    Enter() {
      addTag(tagName);
      clear();
    },
  });

  return (
    <TagContainer $active={active}>
      {tagList.map((tag) => (
        <TagItem key={tag}>
          <TagName>{tag}</TagName>
          <TagDeleteButton onClick={() => deleteTag(tag)} />
        </TagItem>
      ))}
      <AddTagInput
        placeholder="Press enter to add tags"
        maxLength={20}
        type="text"
        value={tagName}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onFocus={() => setActive(true)}
        onBlur={() => {
          setActive(false);
          clear();
        }}
      />
    </TagContainer>
  );
}
