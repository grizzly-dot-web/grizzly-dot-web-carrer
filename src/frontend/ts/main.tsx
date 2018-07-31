import * as React from 'react';
import * as ReactDOM from 'react-dom';

import '../styles/main.scss';
import App from './App/App';

let appElement = document.querySelector('#app') as HTMLElement;

ReactDOM.render(<App />, appElement);