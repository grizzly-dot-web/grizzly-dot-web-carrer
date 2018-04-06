import '../styles/main.scss';

import 'whatwg-fetch';
import moment from 'moment';
import 'moment/locale/de';

moment.locale('de');

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

fetch('/career.json').then((response) => {

	if (response.status !== 200) {
		throw new Error(response);
	}

	response.text().then((xingResponse) => {
		ReactDOM.render(
			<App data={JSON.parse(xingResponse)} />,
			document.getElementById('app')
		);
	});

});

export default App;
