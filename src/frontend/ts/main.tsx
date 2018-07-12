import '../styles/main.scss';

import 'whatwg-fetch';
import moment from 'moment';
import 'moment/locale/de';

moment.locale('de');

import Bootstrap from './Core/Bootstrap';

let appElement = document.getElementById('app') as HTMLElement;
let bootstrap = new Bootstrap(appElement);

bootstrap.init([
	{
		identifier: 'main',
		links: [
			{
				title: `Druckversion`,
				text: 'Drucken',
				url: '',
				callback: (e) => {
					window.print();
					e.preventDefault();
				}
			}
		]
	}
]);

window.addEventListener('scroll', () => {
	bootstrap.componentHandler.activateComponentByItsCondition();
});
