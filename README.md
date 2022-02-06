# 원티드 프리온보딩 코스

## 실행 방법

```sh
yarn start
```

## 컴포넌트

### TOC

- [x] [Toggle](#toggle)
- [x] [Modal](#modal)
- [x] [Tab](#tab)
- [x] [Tag](#tag)
- [x] [AutoComplete](#autocomplete)
- [x] [ClickToEdit](#clicktoedit)

---

### [Toggle](/src/components/Toggle.js)

#### 구현한 방법과 이유

##### 스타일 컴포넌트

- `SwitchContainer`: 스위치의 배경입니다.
- `Switch`: 클릭하면 움직이는 스위치입니다.

##### 구현 방법

- Props
  - `onToggle`: 스위치를 제어할 때 호출됩니다.
  - `initState`: 스위치의 초기 상태입니다.
- States
  - `[on, turnOn]`: 스위치가 켜진/꺼진 상태입니다. (켜짐: true)
- Events/Functions
  - `onClick`: `Switch`를 클릭했을 때 발생합니다. `turnOn` 함수를 호출해 `on` state를 변경합니다.

1. `Switch`를 클릭하면 on/off 상태가 변경되도록 구현했습니다.
2. 스타일 컴포넌트에서 `on` state에 따라 스타일을 적용하기 위해 prop으로 넘겨줍니다. `on`이 `true`라면 스위치가 오른쪽으로 이동하고 배경색이 변경됩니다.
3. `Switch`가 이동하는 과정에서 repaint 및 reflow 연산을 피하기 위해 `transform`을 이용했습니다. 애니메이션 효과를 주기 위해 `transition`을 적용했습니다.

#### 어려웠던 점 및 해결 방법

- `useState`로 받은 dispatch 함수는 비동기적으로 동작하므로 state 변경 후 사용에 유의하여야 했습니다.
  ```js
  const onClick = () => {
    turnOn((prev) => !prev); // 비동기적으로 변경된다.
    onToggle(on); // on의 상태가 아직 변하지 않았다.
  };
  ```
- `Switch`에 `on` prop을 넘겼을 때 "Received `false` for a non-boolean attribute `on`." 경고가 발생했습니다. `styled-components`는 비표준 속성을 알아서 걸러 DOM 요소로 전달할지 말지를 결정하는데, `on` 속성의 경우 비표준 속성이지만 DOM 요소로 전달되는 것이 문제였습니다. 필터링 기준 자체가 비표준 속성도 포함될 수 있는 여지가 있기 때문에 이를 해결하기 위해 [Transient props](https://styled-components.com/docs/api#transient-props) 방식을 적용해 `$on`으로 명명하는 것으로 다른 비표준 속성처럼 DOM 요소로 넘어가지 않도록 하는 방법으로 해결했습니다. 스타일만을 위해 전달하는 prop은 전부 `$`를 붙이는 것 또한 괜찮겠다고 판단하였습니다.
- Pseudo 클래스의 `content` 값을 넘겨진 prop에 따라 제어하기 위해선 `'${({ $on }) => ($on ? 'ON' : 'OFF')}'` 형식처럼 반드시 따옴표(`'...'`)로 묶어줘야 동작합니다.

### [Modal](/src/components/Modal.js)

#### 구현한 방법과 이유

##### 스타일 컴포넌트

- `Button`: 모달창을 띄우는 버튼입니다.
- `ModalBackground`: 모달창이 띄워졌을 때 뒷 배경입니다.
- `ModalContainer`: 모달창입니다.
- `ModalHeader`: 모달창에 띄울 기본 텍스트입니다.
- `ExitButton`: 모달창을 닫는 버튼입니다.

##### 구현 방법

- Props
  - `title`: 버튼에 표시될 내용입니다.
  - `children`: 모달창에 표시될 내용입니다.
- States
  - `[open, setOpen]`: 모달창이 열린/닫힌 상태입니다. (열림: true)
- Events/Functions
  - `openModal`: 모달창을 엽니다. 버튼을 눌렀을 때 호출됩니다.
  - `closeModal`: 모달창을 닫습니다. `⊗` 버튼을 누를 때 그리고 `ModalBackground`를 클릭했을 때 실행되는 함수입니다.

1. 버튼을 눌렀을 때 모달창이 뜨고 `⊗` 버튼을 누르거나 모달창 밖을 눌렀을 때 닫히도록 구현했습니다.
2. `ModalBackground`는 스크롤 위치에 무관하게 항상 배경을 꽉 채워야하므로, `position: fixed;`를 이용했습니다.
3. `ModalBackground`를 클릭하면 모달창이 닫혀야 합니다. 이벤트 버블링으로 인해 모달창을 클릭했을 때 또한 상위 요소로 이벤트가 전파되어 최종적으로 `closeModal` 함수를 호출하게 됩니다. 이벤트가 전파되는 것을 방지하기 위해 `ModalContainer`의 `onClick` 이벤트에서 `event.stopPropagation()` 함수를 호출했습니다.
4. 모달창이 열렸을 때 `body`의 스크롤링을 비활성화하기 위해 [`global-style.js`](./src/global-style.js)에 `body.disable-scroll` 스타일을 정의했습니다. `useEffect`를 통해 `open` state가 변경될 때마다 `body` 요소에 `disable-scroll` 클래스를 추가하거나 제거하여 스타일이 적용될 수 있도록 했습니다.

#### 어려웠던 점 및 해결 방법

- 스크롤을 숨기면 사라진만큼 너비(width)가 늘어나 전체 요소가 조금씩 움직이며 UX에 부정적인 영향을 끼쳤습니다. 너비가 줄었다 늘어나는 것을 방지하기 위해 스크롤 너비의 길이를 계산하여 `margin-right`를 주는 방식으로 요소가 움직이는 문제를 해결했습니다.
- `z-index`를 적용한 요소는 그 값에 상관없이 `z-index`를 적용하지 않은 요소의 위에 쌓이는 것을 확인했습니다. 최상위 요소인 `BackgroundModal`에 `z-index`의 최댓값을 넣어 반드시 가장 최상단에 쌓이도록 했습니다.

### [Tab](/src/components/Tab.js)

#### 구현한 방법과 이유

##### 스타일 컴포넌트

- `TabContainer`: 전체 탭 컴포넌트를 감싸는 컨테이어입니다.
- `SelectContainer`: 전체 탭 목록을 감싸는 컨테이너입니다.
- `OptionContainer`: 선택할 수 있는 탭입니다.
- `PanelContainer`: 내용을 보여주는 패널입니다.

##### 구현 방법

- Props
  - `Tab`
    - `initialTab`: 초기에 표시할 탭 이름입니다. 존재하지 않는 `name`일 경우 맨 처음 탭을 선택합니다.
  - `Tab.Select`
    - `children`: `Tab.Option`을 가집니다.
  - `Tab.Option`
    - `name`: 식별 가능한 고유한 이름입니다.
    - `children`: 탭에 표시할 내용입니다.
  - `Tab.Panels`
    - `children`: `Tab.Panel`을 가집니다.
  - `Tab.Panel`
    - `name`: `Tab.Option`에서 설정한 이름과 동일하게 가집니다.
    - `children`: `name`이 동일한 탭을 선택했을 때 보여줄 화면입니다.
- States
  - `[currentTabName, setCurrentTabName]`: 현재 선택된 탭의 이름입니다.
  - `[disabledTabNames, setDisabledTabNames]`: 비활성화된 탭 목록입니다.
- Events/Functions
  - `useTabContext`: `TabContext`를 전달합니다.
  - `getTabNames`: 탭 이름 목록을 가져옵니다.
  - `getPanelNames`: 패널 이름 목록을 가져옵니다.
  - `getDisabledTabNames`: 비활성화된 탭 목록을 가져옵니다.

1. `Tab`은 Compound 컴포넌트 패턴으로 구현했습니다. `Tab`은 반드시 `Tab.Select`와 `Tab.Panels`를 가져야합니다. `Tab.Select`에는 선택할 수 있는 탭 목록과 `Tab.Panels`에 탭에 따라 표시되는 내용이 있습니다.
2. `Tab.Select`는 세부적으로 `Tab.Option`을 가지며 식별하기 위한 `name` prop을 가지고 있습니다.
3. `Tab.Panels`는 `Tab.Panel`을 가지며 `Tab.Option`에서 설정한 `name`과 동일한 값을 가지고 있는 화면이 표시됩니다.
4. `Tab`은 여러 하위 컴포넌트를 가지고 모든 컴포넌트는 동일한 state를 가져야 합니다. 그러므로, `createContext`를 통해 컨텍스트를 생성하고 모든 하위 컴포넌트에서 이를 가져와 사용하거나 변경할 수 있도록 했습니다.
5. `useContext`를 통해 `context`를 가지고 있지 않을 경우, 에러를 발생시키도록 했습니다. `Tab` 요소 밖에서 하위 요소를 사용하는 것을 방지합니다.
6. `Tab.Option`에서 설정한 `name`과 `Tab.Panel`에서 가져온 `name`을 비교합니다. `Tab.Option`에는 있지만, `Tab.Panel`에 없는 `name`이라면 해당 탭을 비활성화하는 방식으로 구현했습니다.

#### 어려웠던 점 및 해결 방법

- `children`은 여러 개가 들어올 땐 배열 타입지만, 하나만 들어왔을 땐 객체 형태로 들어와서 이를 분기하는데 어려움을 겪었습니다. 일일히 확인하는 절차없이 `children`을 순회하고 배열 메서드를 사용하기 위해선 `Children.toArray(children)` 함수를 통해 배열 형태로 변형 후에 사용하여 문제를 해결했습니다.

### [Tag](/src/components/Tag.js)

#### 구현한 방법과 이유

##### 스타일 컴포넌트

- `TagContainer`: 태그와 입력창을 감싸는 컨테이너입니다.
- `TagItem`: 태그 이름과 삭제 버튼을 감싸는 컨테이너입니다.
- `TagName`: 태그 이름입니다.
- `AddTagInput`: 태그를 추가할 수 있는 입력창입니다.
- `TagDeleteButton`: 태그를 삭제할 수 있는 버튼입니다.

##### 구현 방법

- Props
  - `initTags`: 초기에 표시할 태그 목록입니다.
- States/Events/Functions
  - `[active, setActive]`: 입력창의 활성화 여부입니다. (true: 활성화)
  - `{ tagList, addTag, deleteTag }`: 태그 목록과 생성과 삭제를 위한 함수입니다. (from `useTag`)
  - `{ tagName, onChange, clear }`: 제어 컴포넌트를 위한 값과 함수입니다. (from [`useInput`](src/hooks/useInput.js))
  - `{ onKeyDown }`: 키보드 입력 관리 이벤트 함수입니다. <kbd>Enter</kbd>를 눌렀을 때 동작을 정의했습니다. (from [`useKeyboardControl`](src/hooks/useKeyboardControl.js))

1. `Tag`는 hooks를 중점적으로 이용하여 구현했습니다. `useTag` 함수는 태그 목록을 관리하기 위한 함수를 제공합니다.
2. 엔터를 누르면 등록되고 삭제 버튼을 통해 삭제할 수 있습니다. 등록을 위해 입력하다가 다른 곳을 클릭하면 작성 중이던 내용이 삭제됩니다.
3. 아무것도 작성되지 않았을 때 공백을 입력할 수 없으므로 공백을 등록할 수 없습니다. 중복된 내용을 등록할 수 없습니다.
4. 여러 개가 작성되어 범위를 넘어가면 크기에 맞게 줄바꿈이 발생합니다.

#### 어려웠던 점 및 해결 방법

- 배열이나 Set과 같이 참조 타입으로 state를 생성했다면 내부 내용이 변경되더라도 동일한 객체이므로 setState를 통해 변경하려고 할 때 새로운 객체로 복사해 전달해주어야만 리랜더링이 발생한다는 것을 확인했습니다.
  ```js
  tagList.delete(tag.trim());
  setTagList(new Set(tagList)); // setTagList(tagList); <- tagList의 주소값은 바뀌지 않았으므로 리랜더링이 발생하지 않음
  ```

### [AutoComplete](/src/components/AutoComplete.js)

#### 구현한 방법과 이유

##### 스타일 컴포넌트

- `Container`: 검색창과 자동완성 창을 합한 전체 컨테이너입니다.
- `SearchBarContainer`: 검색창과 초기화 버튼을 감싸고 있는 컨테이너입니다.
- `SearchBar`: 검색창입니다.
- `Suggestions`: 자동완성 목록입니다.
- `Suggestion`: 자동완성 내용입니다.
- `ClearButton`: 입력창의 초기화 버튼입니다.

##### 구현 방법

- Props
  - `keywords`: 자동완성 제안 목록입니다.
  - `onEnter`: 검색 완료 시 호출할 함수입니다.
  - `delay`: 입력 후 자동완성 제안까지 걸릴 시간입니다. (ms 단위)
  - `initValue`: 초기 입력값입니다.
- States/Refs
  - `searchBarRef`: 검색창을 참조합니다.
  - `suggestionsRef`: 자동완성 창을 참조합니다.
  - `[active, setActive]`: 검색창 활성화 여부입니다. (true: 활성화)
  - `[mouseMode, setMouseMode]`: 자동완성 탐색 모드입니다. (true: 마우스 모드 / false: 키보드 모드)
  - `[selectedIndex, setSelectedIndex]`: 현재 선택한 자동완성의 인덱스입니다.
  - `[suggestions, setSuggestions]`: 보여질 자동완성 목록입니다.
  - `{ inputValue, onChange, setInputValue, clear }`: 제어 컴포넌트를 위한 값과 함수입니다. (from [`useInput`](src/hooks/useInput.js))
  - `{ onKeyDown }`: 키보드 입력 관리 이벤트 함수입니다. <kbd>Enter</kbd>, <kbd>ArrowUp</kbd>, <kbd>ArrowDown</kbd> 키에 관해 정의했습니다. (from [`useKeyboardControl`](src/hooks/useKeyboardControl.js))
- Events/Functions
  - `debouncedGenerateSuggestions`: [`useDebounce`](src/hooks/useDebounce.js)를 적용한 자동완성 생성 함수입니다. `delay`에 의해 호출 시점이 결정됩니다.

1. `AutoComplete`에서 가장 중요한 자동완성 알고리즘은 다음과 같이 작동합니다.
  - Fuzzy 검색을 지원합니다. 문자열을 문자로 쪼개 사이마다 `.*?` 정규표현식을 삽입하여 떨어져 있는 문자라도 선택될 수 있도록 했습니다.
  - 한글 음절 및 자음을 통해 검색할 수 있습니다. 사전에 정의된 한글 음절 생성 알고리즘을 참고하였습니다. [utils.js 참고](src/utils.js)
  - 검색하려는 문자가 가장 앞에 오는 순서로 정렬되도록 구현했습니다.
2. 자동완성 검색 함수는 `useDebounce`로 전달되어 작성을 멈춘 일정 시간 후에 호출되도록 하여 불필요한 연산 횟수를 줄였습니다. `inputValue`에 변화가 있을 시에 호출하는 방식으로 구현했습니다.
3. 자동완성을 선택하기 위한 방법은 마우스 모드와 키보드 모드가 있습니다. 자동완성 창의 제어를 마우스로 하는지 혹은 키보드로 하는지에 따라 자동으로 변경됩니다. 키보드 모드의 경우, 방향키 위-아래 키로 자동완성을 고를 수 있습니다. 엔터키를 누르면 입력창에 해당 자동완성이 입력되고 검색 완료 이벤트를 호출합니다.

#### 어려웠던 점 및 해결 방법

- HTML의 `datalist`와 `input` 태그의 자동 완성 기능을 적용하려고 했으나, 스타일을 자유자재로 변경할 수 없는 한계가 있었습니다. 스타일을 변경하고, 문자열 검색 방법을 익히기 위해 직접 구현했습니다.
- `SearchBar` 요소인 `input`에 `onBlur`가 위치하고 해당 함수에서 `active` state를 변경하고 있는데, 이 때문에 `Suggestion` 요소 첫 번째 클릭이 작동하지 않는 문제가 있었습니다. 이를 해결하기 위해 `onClick`이 아닌 `onMouseDown` 이벤트로 변경하는 방법으로 해결했습니다. [참고](https://github.com/facebook/react/issues/4210)
- `onKeyPress`는 방향키를 눌렀을 때 호출되지 않아 `onKeyDown`으로 변경했습니다.
- 자동완성 목록을 선택하기 위해 키보드와 마우스를 동시에 조작할 때 자잘한 버그가 많이 발생했습니다. State를 통해 모드를 구분하고 무엇을 사용하느냐에 따라 자동으로 변경되도록 구현하여 문제를 해결했습니다.
- 문자열 검색을 위한 알고리즘을 구현하는 과정에서 단순히 `indexOf` 함수를 이용하니 검색 효율은 낮고, 코드 또한 깔끔하게 작성하기 어려웠습니다. 정규표현식을 이용한 방법을 생각했고 나아가 fuzzy 검색 구현을 공부하여 적용해보았습니다. 글자 간 거리나 가중치에 대해 고려하진 못했지만, 최대한 검색한 사람의 의도에 맞는 순서로 정렬될 수 있도록 했습니다.
- 한글을 입력하는 도중 다른 키를 누르면 `onKeyDown` 이벤트가 두 번 호출되는 문제가 있었습니다. 한글을 입력할 때 음절이 완성될 때까지 조합 과정을 거치는 컴포징 단계가 있는데, `keyCode === 229`인 이벤트가 발생합니다. 한글을 입력하다 엔터를 누르면 `key`는 `Enter`로 동일하지만, `keyCode`가 각각 229, 13인 이벤트가 별개로 호출되어 두 번 실행하는게 문제였습니다. `keyCode === 299`인 이벤트를 무시하도록 변경하여 문제를 해결했습니다.

### [ClickToEdit](/src/components/ClickToEdit.js)

#### 구현한 방법과 이유

##### 스타일 컴포넌트

- `InputContainer`: 라벨과 입력창을 감싸는 컨테이너입니다.
- `Label`: 입력창 이름입니다.
- `ClickableInput`: 클릭 가능한 입력창 입니다.

##### 구현 방법

- Props
  - `label`: 입력창 이름입니다.
  - `initValue`: 입력되어 있을 초기값입니다.
  - `onEnter`: 입력 완료 후 호출되는 함수입니다.
- States
  - `{ inputValue, onChange }`: 제어 컴포넌트를 위한 값과 함수입니다. (from [`useInput`](src/hooks/useInput.js))
- Events/Functions
  - `onClick`: 라벨 혹은 입력창을 클릭하면 편집 모드로 전환됩니다.
  - `onBlur`: 입력을 완료하면 편집 모드를 나가고 `onEnter` 함수를 호출해 값을 전달합니다.

1. `ClickToEdit` 컴포넌트는 입력창을 클릭하여 값을 편집하고, 입력창 밖을 클릭하면 단순한 텍스트로 표시되도록 구현했습니다.
2. `disabled` 속성을 이용해 `disabled`일 경우, 탭을 눌러도 해당 컴포넌트를 편집할 수 없도록 제한했습니다.
3. 클릭하면 `disabled` 속성을 끄고 편집 모드로 전환합니다. 스타일에 변화를 줘서 현재 편집 모드임을 보여줬습니다.
4. 엔터를 누르거나, 입력창 밖을 클릭하면 편집 모드를 나가고 입력한 값을 `onEnter` 함수에 전달합니다. 그리고, 다시 `disabled` 상태로 전환합니다.

#### 어려웠던 점 및 해결 방법

- Validator를 이용해 아무것도 입력되지 않았을 때 공백을 작성하지 못하도록 하였는데, 텍스트를 전체 선택 후 공백을 작성하면 막지 못한다는 것을 확인했습니다. 입력을 마치고 값을 넘겨야할 때, 현재 값이 공백으로만 이루어져 있다면 값을 비우고 전달하지 않도록 하는 방법으로 해결했습니다.
- ~~엔터를 눌렀을 때 `onEnter` 함수를 호출하는 `onKeyDown` 이벤트에서 한글을 작성하고 엔터를 쳤을 때 마지막 글자가 두 번 나오는 문제가 있었습니다. `onKeyPress` 이벤트로 대체하여 해결했습니다.~~
