import * as React from 'react';
import CmsControlledComponent, { CmsProps, CmsState } from '../../../Core/CmsControlledComponent';
import Content from '../../../Core/Components/Content';
import { resolve } from 'dns';

export interface DefaultInfoProps extends CmsProps<string> {
	order : number,
	infoLevelClass? : string
	initialVisible?: boolean
	visibleStateChangeDuration?: number,
	cookieName?: string,
	cookieExpireInHours?: number,
	cookieAutoRenew?: boolean
	button?: string
}

export interface DefaultInfoState extends CmsState {
	order : number,
	infoLevelClass : string,
	isVisible : boolean;
	cookieExpireInHours : number,
	cookieAutoRenew: boolean
}

export default class DefaultInfo extends CmsControlledComponent<DefaultInfoProps, DefaultInfoState> {

	constructor(props : any) {
		super(props);

		this.state = {
			order: this.props.order || 50,
			infoLevelClass: this.props.infoLevelClass || 'info',
			cookieExpireInHours: this.props.cookieExpireInHours || 1,
			cookieAutoRenew: this.props.cookieAutoRenew || true,
			isVisible: this.props.initialVisible || true
		}
	}

	render() {

		let classList = ['info'];
		classList.push('info-level-'+ this.state.infoLevelClass)
		if (this.state.isVisible) {
			classList.push('visible');
		}

		let button = null;
		if (this.props.button) {
			button = <button onClick={this.handleClick.bind(this)} className={`info-button info-button-${this.props.button.toLocaleLowerCase()}`}>{this.props.button}</button>
		} else {
			button = <button onClick={this.handleClick.bind(this)} className={`info-button info-close-button`} title="Schließen"></button>;
		}

		return (
			<div key={this.props.key} style={{order: this.state.order}} className={classList.join(' ')}>
				<Content classes={['text']} forceBlock={true} data={this.props.data} allowedHeadlineLevel={6} />
				{button}
			</div>
		);
	}
	
	
	handleClick(e : Event) {
		this.setCookieVisibleState(!this.state.isVisible);
	}

	componentDidMount() {
		let isVisible = this.getVisibleStateFromCookie();
		if (this.state.cookieAutoRenew) {
			this.setCookieVisibleState(isVisible);
		}
		
		if (!this.cookieExists() && this.props.visibleStateChangeDuration) {
			this.setCookieVisibleState(isVisible).then(() => {
				setTimeout(() => {
					this.setCookieVisibleState(!this.state.isVisible);
				}, this.props.visibleStateChangeDuration);
			})
		}

		
	}

	getVisibleStateFromCookie() {
		if (!this.props.cookieName) {
			return true;
		}

		// if cookie did not exists or auto renew is enabled
		if (document.cookie.indexOf(this.props.cookieName) === -1) {
		}

		return !this.cookieExists();
	}

	setCookieVisibleState(visible : boolean) {
		let now = new Date();

		if (this.props.cookieExpireInHours) {
			let expire = new Date(now.getTime() + this.state.cookieExpireInHours * 60 * 60 * 1000);
			let cookie = `${this.props.cookieName}=${visible}; expires=${expire}`

			document.cookie = cookie;
		}

		return new Promise((resolve, reject) => {
			this.setState(Object.assign(this.state, {
				isVisible: this.getVisibleStateFromCookie()
			}), () => {
				resolve();
			})
		});
	}

	cookieExists() {
		if (!this.props.cookieName) {
			return true;
		}

		return document.cookie.indexOf(this.props.cookieName) !== -1;
	}
}