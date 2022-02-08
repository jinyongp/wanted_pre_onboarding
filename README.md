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

## 추가 요소

- 모바일 환경에서도 대응하도록 작성했습니다.
- [gh-pages](https://github.com/tschaub/gh-pages)를 이용해 배포했습니다.
- [Github Actions를 작성](.github/workflows/gh-pages.yml)해 commit 후 배포를 자동화했습니다.

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

1. Toggle은 Switch를 클릭하여 on/off 상태를 전환하도록 구현했습니다. 상태가 변할 때마다 `onToggle` prop에 변한 값을 전달합니다.
2. 스타일 컴포넌트에서 on state에 따라 스타일을 적용하기 위해 prop으로 넘겨줍니다. on이 `true`라면 스위치가 오른쪽으로 이동하고 배경색이 변경됩니다.
3. 요소가 이동하는 과정에서 repaint 및 reflow 연산을 피하기 위해 `transform`을 이용했습니다. 애니메이션 효과를 주기 위해 `transition`을 적용했습니다.

#### 어려웠던 점 및 해결 방법

- useState로 받은 dispatch 함수 `turnOn`은 비동기적으로 동작하므로 state 변경 후 사용에 유의하여야 했습니다.
  ```js
  const onClick = () => {
    turnOn((prev) => !prev); // 비동기적으로 변경된다.
    onToggle(on); // on의 상태가 아직 변하지 않았다.
  };
  ```
- Switch에 on prop을 넘겼을 때 `Received false for a non-boolean attribute on.` 경고가 발생했습니다. styled-components는 비표준 속성을 알아서 걸러 DOM 요소로 전달할지 말지를 결정하는데, on 속성의 경우 비표준 속성이지만 DOM 요소로 전달되는 것이 문제였습니다. styled-components의 필터링 기준 자체가 비표준 속성도 포함될 수 있는 여지가 있으므로 이를 해결하기 위해 [Transient props](https://styled-components.com/docs/api#transient-props) 방식을 적용해 `$on`으로 명명하는 것으로 다른 비표준 속성처럼 DOM 요소로 넘어가지 않도록 했습니다.
- Pseudo 클래스인 before나 after의 `content` 값을 prop에 따라 제어하기 위해선 `'${({ $on }) => ($on ? 'ON' : 'OFF')}'` 형식처럼 반드시 따옴표(`'...'`)로 묶어줘야 동작했습니다.

### [Modal](/src/components/Modal.js)

#### 구현한 방법과 이유

1. Modal은 버튼을 눌렀을 때 모달창이 뜨고, `⊗` 버튼을 누르거나 모달창 밖을 눌렀을 때 닫히도록 구현했습니다.
2. ModalBackground는 스크롤 위치에 무관하게 항상 배경을 꽉 채워야하므로, `position: fixed;`로 설정했습니다.
3. ModalBackground를 클릭하면 모달창이 닫혀야 합니다. 이벤트 버블링으로 인해 모달창을 클릭했을 때 또한 상위 요소로 이벤트가 전파되어 최종적으로 `closeModal()` 함수를 호출하게 됩니다. ModalContainer의 onClick 이벤트에서 `event.stopPropagation()` 함수를 호출하여 이벤트가 전파되는 것을 방지했습니다.
4. 모달창이 열렸을 때 body의 스크롤링을 비활성화하기 위해서 [global-style.js](./src/global-style.js)에 `body.disable-scroll` 스타일을 정의했습니다. useEffect를 통해 open state가 변경될 때마다 body 요소에 `disable-scroll` 클래스를 추가하거나 제거하여 스크롤을 비활성화/활성화하도록 구현했습니다.

#### 어려웠던 점 및 해결 방법

- 스크롤을 숨기면 사라진만큼 너비(width)가 늘어나 전체 요소가 조금씩 움직이며 UX에 부정적인 영향을 끼쳤습니다. 너비가 줄었다 늘어나는 것을 방지하기 위해 스크롤 너비의 길이를 계산하여 `margin-right`를 주는 방식으로 요소가 움직이는 문제를 해결했습니다. 이는 모바일 환경에서 부정확하게 계산되었기에 `navigator.userAgent`를 이용해 웹 환경에서만 동작하도록 구현했습니다.

### [Tab](/src/components/Tab.js)

#### 구현한 방법과 이유

1. Tab은 Compound 컴포넌트 패턴으로 구현했습니다. 아래 구조를 가집니다.
   ```jsx
   <Tab>
      <Tab.Select>
        <Tab.Option name="one">Tab 1</Tab.Option>
        <Tab.Option name="two">Tab 2</Tab.Option>
        <Tab.Option name="three">Tab 3</Tab.Option>
      </Tab.Select>
      <Tab.Panels>
        <Tab.Panel name="one">Tab Menu ONE</Tab.Panel>
        <Tab.Panel name="two">Tab Menu TWO</Tab.Panel>
        <Tab.Panel name="three">Tab Menu THREE</Tab.Panel>
      </Tab.Panels>
    </Tab>
   ```
2. Tab은 반드시 Tab.Select와 Tab.Panels를 가져야합니다.
3. Tab.Select는 선택할 수 있는 탭을 보여주는 컴포넌트로 Tab.Option을 가지며 각각의 컴포넌트는 name prop을 가지고 있습니다. 값을 유일해야 합니다. 중복된 값은 무시됩니다.
4. Tab.Panels는 선택된 탭의 패널을 보여주는 컴포넌트로 Tab.Panel을 가지며 Tab.Option에서 정의한 name과 1:1로 동일하게 설정해야 합니다.
5. Tab의 여러 하위 컴포넌트가 동일한 state를 공유하도록 하기 위해 [Context](https://ko.reactjs.org/docs/context.html)를 이용헀습니다. `createContext()` 함수로 TabContext를 생성하고 TabContext.Provider로 감싸 모든 하위 컴포넌트에서 동일한 state를 사용하거나 변경할 수 있도록 구현했습니다.
6. `useTabContext()` 훅을 정의해서  `context`를 공유하도록 구현했습니다. 해당 함수를 호출한 컴포넌트에서 `context`가 없다면 에러를 발생시키도록 했습니다. `Tab` 요소 밖에서 하위 요소를 사용하는 것을 방지합니다.
7. Tab.Option에서 설정한 name과 Tab.Panel에서 가져온 name을 비교합니다. Tab.Option에는 있지만, Tab.Panel에 없는 name이라면 보여줄 내용이 없으므로 해당 탭을 비활성화하는 방식으로 구현했습니다.

#### 어려웠던 점 및 해결 방법

- children은 여러 개가 들어올 땐 배열 타입지만, 하나만 들어왔을 땐 객체 형태로 들어와서 이를 분기하는데 어려움을 겪었습니다. 일일히 확인하는 절차없이 children을 순회하고 배열 메서드를 사용하기 위해서 `Children.toArray(children)` 함수로 모든 children을 배열로 변환한 후 사용하는 방법으로 문제를 해결했습니다.

### [Tag](/src/components/Tag.js)

#### 구현한 방법과 이유

1. Tag는 각 기능을 담당하는 hook을 작성해 구현했습니다.
   - [`useTag`](https://github.com/jinyongp/wanted_pre_onboarding/blob/f10eb1427e8114fe9d6fdc2f35584c9a203c6c9b/src/components/Tag.js?_pjax=%23js-repo-pjax-container%3Afirst-of-type%2C%20div%5Bitemtype%3D%22http%3A%2F%2Fschema.org%2FSoftwareSourceCode%22%5D%20main%3Afirst-of-type%2C%20%5Bdata-pjax-container%5D%3Afirst-of-type#L75)는 태그 목록을 관리합니다.
   - [`useInput`](src/hooks/useInput.js)은 제어 컴포넌트를 관리합니다.
   - [`useKeyboardControl`](src/hooks/useKeyboardControl.js)은 키보드 입력 이벤트를 관리합니다.
2. 태그를 작성하고 엔터를 누르면 등록되고, 삭제 버튼을 통해 삭제할 수 있습니다. 등록을 위해 입력하다가 다른 곳을 클릭하면 작성 중이던 내용이 삭제됩니다.
3. 아무것도 작성되지 않았을 때 공백을 입력할 수 없도록 제한했고 또한 공백을 등록할 수 없습니다. `Set`을 이용해 중복된 태그를 등록할 수 없도록 구현했습니다.
4. 여러 개가 작성되어 범위를 넘어가면 크기에 맞게 줄바꿈이 발생합니다.

#### 어려웠던 점 및 해결 방법

- 배열이나 Set과 같이 참조 타입으로 state를 생성했다면 setState로 값을 변경할 때 복사본을 전달해야 했습니다. 값이 변경된 새로운 객체를 복사해 전달해야만 값이 변했음을 감지하고 리랜더링이 발생한다는 것을 확인했습니다.
  ```js
  tagList.delete(tag.trim());
  setTagList(new Set(tagList)); // setTagList(tagList); <- tagList의 주소값은 그대로이므로 리랜더링이 발생하지 않음
  ```

### [AutoComplete](/src/components/AutoComplete.js)

#### 구현한 방법과 이유

1. AutoComplete은 입력 중에 엔터를 누르거나 자동 완성된 추천어를 클릭하는 것으로 검색어를 전달할 수 있게끔 구현했습니다.
2. AutoComplete에서 가장 중요한 자동 완성 알고리즘은 다음과 같이 작동합니다. [utils.js 참고](src/utils.js)
   - Fuzzy 검색을 지원합니다. 문자열의 문자 사이마다 `.*?` 정규표현식을 삽입하여 떨어져 있는 문자라도 선택될 수 있도록 했습니다.
   - 한글 음절 및 자음을 통해 검색할 수 있습니다. 사전에 정의된 [한글 음절 생성 알고리즘](https://en.wikipedia.org/wiki/Korean_language_and_computers)을 참고하였습니다.
   - 검색하려는 문자가 가장 앞에 오는 순서로 정렬되도록 구현했습니다.
3. 자동 완성 검색 함수는 [`useDebounce`](src/hooks/useDebounce.js)로 전달되어 작성을 멈춘 일정 시간 후에 호출되도록 하여 불필요한 연산 횟수를 줄였습니다.
4. 추천어를 선택할 때 마우스 모드와 키보드 모드를 구분했습니다. 키보드 모드의 경우, 위아래 방향키로 추천어를 고를 수 있습니다. 엔터키를 누르면 입력창에 해당 추천어를 넘기고 `onEnter`를 호출하여 값을 전달합니다. 자동 완성 목록 위에서 마우스를 움직이면 자동으로 마우스 모드로 변경됩니다. 클릭으로 추천어를 선택할 수 있습니다.


#### 어려웠던 점 및 해결 방법

- HTML의 datalist와 input 태그의 자동 완성 기능을 적용하려고 했으나, 스타일을 자유자재로 변경할 수 없는 한계가 있었습니다. 스타일을 변경하고, 문자열 검색 방법을 익히기 위해 직접 구현하는 방법을 택했습니다.
- SearchBar 요소인 input에 `onBlur`가 위치하고 해당 함수에서 active state를 변경하면 Suggestion 요소에서의 첫 번째 클릭이 작동하지 않는 문제가 있었습니다. 이를 해결하기 위해 onClick이 아닌 onMouseDown 이벤트로 변경했습니다. [참고](https://github.com/facebook/react/issues/4210)
- 자동 완성 목록을 선택하기 위해 마우스와 더불어 키보드로 제어할 수 있도록 구현했더니 동시에 조작할 때 자잘한 버그가 많이 발생했습니다. State를 통해 모드를 구분하고 무엇을 사용하느냐에 따라 자동으로 변경되도록 구현하여 문제를 해결했습니다.
- 문자열 검색을 위한 알고리즘을 구현하는 과정에서 단순히 `indexOf` 함수를 이용하니 검색 효율은 낮고, 코드 또한 깔끔하게 작성하기 어려웠습니다. 정규표현식을 이용한 방법을 생각했고 나아가 fuzzy 검색 구현 방법을 공부하여 적용해보았습니다. 글자 간 거리나 가중치에 대해 고려하진 못했지만, 최대한 검색한 사람의 의도에 맞는 순서로 정렬될 수 있도록 했습니다.
- 한글을 입력하는 도중 다른 키를 누르면 `onKeyDown` 이벤트가 두 번 호출되는 문제가 있었습니다. 한글을 입력할 때 음절이 완성될 때까지 조합 과정을 거치는 컴포징 단계가 있는데, 이 과정은 `keyCode === 229`인 이벤트가 발생하는 것으로 확인했습니다. 한글을 입력하다 엔터를 누르면 key는 Enter로 동일하지만, keyCode가 각각 229, 13인 이벤트가 별개로 두 번 호출되는 것이 문제였습니다. `keyCode === 229`인 이벤트를 무시하도록 작성하여 문제를 해결했습니다.

### [ClickToEdit](/src/components/ClickToEdit.js)

#### 구현한 방법과 이유

1. ClickToEdit은 입력창을 클릭하여 값을 편집하고 입력을 마치면 단순한 텍스트로 표시되도록 구현했습니다.
2. disabled 속성을 이용했습니다. disabled일 경우, 탭을 눌러도 해당 컴포넌트를 편집할 수 없도록 제한했습니다.
3. 입력창을 클릭하면 disabled 속성을 끄고 편집 모드로 전환합니다. 바로 수정할 수 있게끔 `select()` 메서드를 통해 전체 텍스트를 선택하도록 했습니다. 동시에 스타일에 변화를 줘서 현재 편집 모드임을 확인할 수 있도록 했습니다.
4. 엔터를 누르거나, 입력창 밖을 클릭하면 편집 모드를 나가고 입력한 값을 `onEnter` 함수에 전달합니다. 그리고, 다시 disabled 상태로 전환합니다.

#### 어려웠던 점 및 해결 방법

- Validator를 이용해 아무것도 입력되지 않았을 땐 공백을 작성하지 못하도록 막아두었지만, 텍스트를 전체 선택 후 공백을 작성하는 건 가능했습니다. 입력을 마치고 값을 넘겨야할 때, 현재 값이 공백으로만 이루어져 있다면 입력창 값을 비우고 `onEnter`를 호출하지 않도록 구현하여 해결했습니다.
- ~~엔터를 눌렀을 때 `onEnter` 함수를 호출하는 `onKeyDown` 이벤트에서 한글을 작성하고 엔터를 쳤을 때 마지막 글자가 두 번 나오는 문제가 있었습니다. `onKeyPress` 이벤트로 대체하여 해결했습니다.~~ `AutoComplete`에서 겪은 문제와 동일합니다.

## 레퍼런스

- [Ryan Florence - Compound Components](https://www.youtube.com/watch?v=hEGg-3pIHlE)
- [한글도 지원하는 퍼지 문자열 검색](https://taegon.kim/archives/9919)
- [Deploy React App using Github Actions](https://dev.to/achukka/deploy-react-app-using-github-actions-157d)