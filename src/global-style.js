import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: 'Ubuntu Mono', monospace;
  }

  input, button {
    border: none;
    outline: none;
  }

  body.disable-scroll {
    overflow: hidden;
    margin-right: ${window.innerWidth - document.body.scrollWidth}px;
  }
`;
