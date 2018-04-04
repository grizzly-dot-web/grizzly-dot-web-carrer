/* eslint-disable no-unused-vars */

import 'whatwg-fetch';
import moment from 'moment';
import 'moment/locale/de';
import * as TestUtils from 'react-dom/test-utils';

moment.locale('de');

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

it('fetches /carrer.json and renders App', () => {
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
});
