import * as React from 'react';

import 'whatwg-fetch';
import moment from 'moment';
import 'moment/locale/de';

import './styles/main.scss';

import Bootstrap from '../../Core/client/Bootstrap';
import Header from './App/_partials/Header';
import Footer from './App/_partials/Footer';
import InfoCenter from './App/_partials/InfoCenter';
import Start from './App/Start';
import History from './App/Start/History';
import IssueTracker from './App/IssueTracker/IssueTracker';
import ExperienceOverview from './App/Start/ExperienceOverview';

moment.locale('de');

let appElement = document.getElementById('app') as HTMLElement;
let bootstrap = new Bootstrap(appElement);

bootstrap.init([
	{
		identifier: 'main',
	}
]);

bootstrap.render((data : any) => {
	return (
		<div>
			<Header data={data.header} />
			<div className="main-wrap">
				<ExperienceOverview data={data.history} />
				<Start data={data.introduction} />
				<History data={data.history} />
			</div>
			<InfoCenter data={data.infoCenter} />	
			<IssueTracker data={data.gitHub} />	
			<Footer data={data.footer} />	
		</div>
	)
});

window.addEventListener('scroll', () => {
	bootstrap.componentHandler.activateComponentByItsCondition();
});
