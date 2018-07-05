import '../styles/main.scss';

import 'whatwg-fetch';
import moment from 'moment';
import 'moment/locale/de';

moment.locale('de');

import Bootstrap from './Core/Bootstrap';
import { Navigation } from './Core/Router/Navigation';

let appElement = document.getElementById('app') as HTMLElement;
let bootstrap = new Bootstrap(appElement);

bootstrap.registerNavigations([
	new Navigation('main'),
	new Navigation('meta'),
	new Navigation('social'),
]);

bootstrap.init()
window.addEventListener('scroll', () => {
	bootstrap.componentHandler.activateComponentByItsCondition();
});
