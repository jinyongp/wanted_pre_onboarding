import { createGlobalStyle } from 'styled-components';
import resetStyle from 'styled-reset';

export const GlobalStyle = createGlobalStyle`
  ${resetStyle}

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Ubuntu Mono', monospace;
  }

  input, button {
    border: none;
    outline: none;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 1.8rem;
    font-weight: 800;
  }

  h4 {
    font-size: 1.1rem;
    font-weight: 600;
  }


  body.disable-scroll {
    overflow: hidden;
    margin-right: ${window.innerWidth - document.body.scrollWidth}px;
  }
`;
