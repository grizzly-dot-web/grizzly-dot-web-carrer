import '../styles/main.scss';

import 'whatwg-fetch';
import moment from 'moment';
import 'moment/locale/de';

moment.locale('de');

import Bootstrap from './Core/Bootstrap';

let appElement = document.getElementById('app') as HTMLElement;
let bootstrap = new Bootstrap(appElement);

bootstrap.render();

window.addEventListener('scroll', () => {
	bootstrap.router.detectActiveComponentByItsCondition();
});
