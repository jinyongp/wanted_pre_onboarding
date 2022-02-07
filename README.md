# 원티드 프리온보딩 코스

## 실행 방법

[예제 페이지 바로가기](https://jinyongp.github.io/wanted_pre_onboarding/)

### 개발

- `yarn install`
- `yarn start`

###  배포

- `yarn build`
- `yarn deploy`

## 프로젝트 구조

<details>
<summary>펼쳐보기</summary>

```
.
├── README.md
├── package.json
├── yarn.lock
├── public
│   └── index.html
└── src
    ├── App.js
    ├── data.js
    ├── global-style.js
    ├── index.js
    ├── utils.js
    ├── components
    │   ├── AutoComplete.js
    │   ├── ClickToEdit.js
    │   ├── Modal.js
    │   ├── Tab.js
    │   ├── Tag.js
    │   ├── Toggle.js
    │   └── index.js
    ├── constants
    │   ├── media.js
    │   └── theme.js
    └── hooks
        ├── index.js
        ├── useDebounce.js
        ├── useInput.js
        ├── useKeyboardControl.js
        └── useThrottle.js
```

</details>

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

1. `Toggle`은 `Switch`를 클릭하여 on/off 상태를 전환하도록 구현했습니다.

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

- Pseudo 클래스인 `before`나 `after`의 `content` 값을 prop에 따라 제어하기 위해선 `'${({ $on }) => ($on ? 'ON' : 'OFF')}'` 형식처럼 반드시 따옴표(`'...'`)로 묶어줘야 동작

### [Modal](/src/components/Modal.js)

#### 구현한 방법과 이유

1. `Modal`은 버튼을 눌렀을 때 모달창이 뜨고 `⊗` 버튼을 누르거나 모달창 밖을 눌렀을 때 닫히도록 구현했습니다.

2. `ModalBackground`는 스크롤 위치에 무관하게 항상 배경을 꽉 채워야하므로, `position: fixed;`를 이용했습니다.

3. `ModalBackground`를 클릭하면 모달창이 닫혀야 합니다. 이벤트 버블링으로 인해 모달창을 클릭했을 때 또한 상위 요소로 이벤트가 전파되어 최종적으로 `closeModal()` 함수를 호출하게 됩니다. `ModalContainer`의 `onClick` 이벤트에서 `event.stopPropagation()` 함수를 호출하여 이벤트가 전파되는 것을 방지했습니다.

4. 모달창이 열렸을 때 `body`의 스크롤링을 비활성화하기 위해서 [`global-style.js`](./src/global-style.js)에 `body.disable-scroll` 스타일을 정의했습니다. `useEffect`를 통해 `open` state가 변경될 때마다 `body` 요소에 `disable-scroll` 클래스를 추가하거나 제거하여 스크롤을 비활성화/활성화할 수 있도록 구현했습니다.

#### 어려웠던 점 및 해결 방법

- 스크롤을 숨기면 사라진만큼 너비(width)가 늘어나 전체 요소가 조금씩 움직이며 UX에 부정적인 영향을 끼쳤습니다. 너비가 줄었다 늘어나는 것을 방지하기 위해 스크롤 너비의 길이를 계산하여 `margin-right`를 주는 방식으로 요소가 움직이는 문제를 해결했습니다.

- `z-index`를 적용한 요소는 그 값에 상관없이 `z-index`를 적용하지 않은 요소의 위에 쌓이는 것을 확인했습니다. 최상위 요소인 `BackgroundModal`에 `z-index`의 최댓값을 넣어 반드시 가장 최상단에 쌓이도록 했습니다.

### [Tab](/src/components/Tab.js)

#### 구현한 방법과 이유

1. `Tab`은 Compound 컴포넌트 패턴으로 구현했습니다. `Tab`은 반드시 `Tab.Select`와 `Tab.Panels`를 가져야합니다. `Tab.Select`에는 선택할 수 있는 탭 목록과 `Tab.Panels`에 탭에 따라 표시되는 내용이 들어갑니다.

2. `Tab.Select`는 `Tab.Option`을 가지며 각각의 컴포넌트는 유일한 값의 `name` prop을 가지고 있습니다.

3. `Tab.Panels`는 `Tab.Panel`을 가지며 `Tab.Option`에서 정의한 `name`과 동일한 값을 `name`으로 설정합니다.

4. `Tab`의 여러 하위 컴포넌트는 동일한 state를 공유해야 합니다. `createContext()`를 통해 컨텍스트를 생성하고 모든 하위 컴포넌트에서 이를 가져와 사용하거나 변경할 수 있도록 구현했습니다.

5. `useTabContext()`를 통해 `context`를 공유합니다. 해당 함수를 호출한 컴포넌트에서 `context`가 없다면 에러를 발생시키도록 했습니다. `Tab` 요소 밖에서 하위 요소를 사용하는 것을 방지합니다.

6. `Tab.Option`에서 설정한 `name`과 `Tab.Panel`에서 가져온 `name`을 비교합니다. `Tab.Option`에는 있지만, `Tab.Panel`에 없는 `name`이라면 해당 탭을 비활성화하는 방식으로 구현했습니다.

#### 어려웠던 점 및 해결 방법

- `children`은 여러 개가 들어올 땐 배열 타입지만, 하나만 들어왔을 땐 객체 형태로 들어와서 이를 분기하는데 어려움을 겪었습니다. 일일히 확인하는 절차없이 `children`을 순회하고 배열 메서드를 사용하기 위해서 `Children.toArray(children)` 함수를 통해 배열 형태로 사용하는 방법으로 문제를 해결했습니다.

### [Tag](/src/components/Tag.js)

#### 구현한 방법과 이유

1. `Tag`는 hooks를 중점적으로 이용하여 구현했습니다.
   - `useTag`는 태그 목록을 관리합니다.
   - `useInput`은 제어 컴포넌트를 관리합니다.
   - `useKeyboardControl`은 키보드 입력 이벤트를 관리합니다.

2. 태그를 작성하고 엔터를 누르면 등록되고, 삭제 버튼을 통해 삭제할 수 있습니다. 등록을 위해 입력하다가 다른 곳을 클릭하면 작성 중이던 내용이 삭제됩니다.

3. 아무것도 작성되지 않았을 때 공백을 입력할 수 없으므로 공백을 등록할 수 없습니다. `Set`을 이용해 중복된 태그를 등록할 수 없도록 구현했습니다.

4. 여러 개가 작성되어 범위를 넘어가면 크기에 맞게 줄바꿈이 발생합니다.

#### 어려웠던 점 및 해결 방법

- 배열이나 Set과 같이 참조 타입으로 state를 생성했다면 내부 내용이 변경되더라도 동일한 객체이므로 setState를 통해 변경하려고 할 때 새로운 객체로 복사해 전달해주어야만 리랜더링이 발생한다는 것을 확인했습니다.
  ```js
  tagList.delete(tag.trim());
  setTagList(new Set(tagList)); // setTagList(tagList); <- tagList의 주소값은 바뀌지 않았으므로 리랜더링이 발생하지 않음
  ```

### [AutoComplete](/src/components/AutoComplete.js)

#### 구현한 방법과 이유

1. `AutoComplete`은 입력 중에 엔터를 누르거나 자동완성된 추천어를 클릭하는 것으로 검색어를 전달할 수 있게끔 구현했습니다.

2. `AutoComplete`에서 가장 중요한 자동완성 알고리즘은 다음과 같이 작동합니다. [utils.js 참고](src/utils.js)

   - Fuzzy 검색을 지원합니다. 문자열의 문자 사이마다 `.*?` 정규표현식을 삽입하여 떨어져 있는 문자라도 선택될 수 있도록 했습니다.
   - 한글 음절 및 자음을 통해 검색할 수 있습니다. 사전에 정의된 [한글 음절 생성 알고리즘](https://en.wikipedia.org/wiki/Korean_language_and_computers)을 참고하였습니다.
   - 검색하려는 문자가 가장 앞에 오는 순서로 정렬되도록 구현했습니다.

3. 자동완성 검색 함수는 [`useDebounce`](src/hooks/useDebounce.js)로 전달되어 작성을 멈춘 일정 시간 후에 호출되도록 하여 불필요한 연산 횟수를 줄였습니다.

4. 추천어를 선택할 때 마우스 모드와 키보드 모드가 있습니다. 키보드 모드의 경우, 위아래 방향키로 추천어를 고를 수 있습니다. 엔터키를 누르면 입력창에 해당 자동완성이 입력되고 검색 완료 이벤트를 호출합니다. 자동완성 목록에서 마우스를 움직이면 자동으로 마우스 모드로 변경됩니다.


#### 어려웠던 점 및 해결 방법

- HTML의 `datalist`와 `input` 태그의 자동 완성 기능을 적용하려고 했으나, 스타일을 자유자재로 변경할 수 없는 한계가 있었습니다. 스타일을 변경하고, 문자열 검색 방법을 익히기 위해 직접 구현했습니다.

- `SearchBar` 요소인 `input`에 `onBlur`가 위치하고 해당 함수에서 `active` state를 변경하고 있는데, 이 때문에 `Suggestion` 요소 첫 번째 클릭이 작동하지 않는 문제가 있었습니다. 이를 해결하기 위해 `onClick`이 아닌 `onMouseDown` 이벤트로 변경하여 해결했습니다. [참고](https://github.com/facebook/react/issues/4210)

- 자동완성 목록을 선택하기 위해 키보드와 마우스를 동시에 조작할 때 자잘한 버그가 많이 발생했습니다. State를 통해 모드를 구분하고 무엇을 사용하느냐에 따라 자동으로 변경되도록 구현하여 문제를 해결했습니다.

- 문자열 검색을 위한 알고리즘을 구현하는 과정에서 단순히 `indexOf` 함수를 이용하니 검색 효율은 낮고, 코드 또한 깔끔하게 작성하기 어려웠습니다. 정규표현식을 이용한 방법을 생각했고 나아가 fuzzy 검색 구현 방법을 공부하여 적용해보았습니다. 글자 간 거리나 가중치에 대해 고려하진 못했지만, 최대한 검색한 사람의 의도에 맞는 순서로 정렬될 수 있도록 했습니다.

- 한글을 입력하는 도중 다른 키를 누르면 `onKeyDown` 이벤트가 두 번 호출되는 문제가 있었습니다. 한글을 입력할 때 음절이 완성될 때까지 조합 과정을 거치는 컴포징 단계가 있는데, `keyCode === 229`인 이벤트가 발생하는 것으로 확인할 수 있습니다. 한글을 입력하다 엔터를 누르면 `key`는 `Enter`로 동일하지만, `keyCode`가 각각 229, 13인 이벤트가 별개로 두 번 호출되는 것이 문제였습니다. `keyCode === 229`인 이벤트를 무시하도록 작성하여 문제를 해결했습니다.

### [ClickToEdit](/src/components/ClickToEdit.js)

#### 구현한 방법과 이유

1. `ClickToEdit`은 입력창을 클릭하여 값을 편집하고 입력을 마치면 단순한 텍스트로 표시되도록 구현했습니다.

2. `disabled` 속성을 이용했습니다. `disabled`일 경우, 탭을 눌러도 해당 컴포넌트를 편집할 수 없도록 제한했습니다.

3. 입력창을 클릭하면 `disabled` 속성을 끄고 편집 모드로 전환합니다. 바로 수정할 수 있게끔 `select()` 메서드를 통해 전체 텍스트를 선택하도록 했습니다. 동시에 스타일에 변화를 줘서 현재 편집 모드임을 확인할 수 있도록 했습니다.

4. 엔터를 누르거나, 입력창 밖을 클릭하면 편집 모드를 나가고 입력한 값을 `onEnter` 함수에 전달합니다. 그리고, 다시 `disabled` 상태로 전환합니다. 빈 공백은 전달할 수 없습니다.

#### 어려웠던 점 및 해결 방법

- Validator를 이용해 아무것도 입력되지 않았을 때 공백을 작성하지 못하도록 하였는데, 텍스트를 전체 선택 후 공백을 작성하면 막지 못한다는 것을 확인했습니다. 입력을 마치고 값을 넘겨야할 때, 현재 값이 공백으로만 이루어져 있다면 값을 비우고 `onEnter`를 호출하지 않도록 구현하여 해결했습니다.

- ~~엔터를 눌렀을 때 `onEnter` 함수를 호출하는 `onKeyDown` 이벤트에서 한글을 작성하고 엔터를 쳤을 때 마지막 글자가 두 번 나오는 문제가 있었습니다. `onKeyPress` 이벤트로 대체하여 해결했습니다.~~ `AutoComplete`에서 겪은 문제와 동일합니다.

## 레퍼런스

- [Ryan Florence - Compound Components](https://www.youtube.com/watch?v=hEGg-3pIHlE)
- [한글도 지원하는 퍼지 문자열 검색](https://taegon.kim/archives/9919)
- [Deploy React App using Github Actions](https://dev.to/achukka/deploy-react-app-using-github-actions-157d)