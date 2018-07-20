import * as React from 'react';
import CmsControlledComponent, { CmsProps, CmsState } from '../../../Core/CmsControlledComponent';
import Content from '../../../Core/Components/Content';
import { resolve } from 'dns';
import User from '../../../../../backend/Core/Component/User/Shared/Models/User';

export interface DefaultInfoProps extends CmsProps<string> {
	order : number,
	onInfoHidden : (name:string) => void
	infoLevelClass? : string
	initialVisible?: boolean
	deleteCookieAfterSeconds?: number,
	cookieName?: string,
	cookieExpireInHours?: number,
	cookieAutoRenew?: boolean
	button?: string
}

export interface DefaultInfoState extends CmsState {
	isVisible : boolean;
	cookieExpireInHours : number,
	cookieAutoRenew: boolean
}

export default class DefaultInfo extends CmsControlledComponent<DefaultInfoProps, DefaultInfoState> {

	constructor(props : any) {
		super(props);

		this.state = {
			cookieExpireInHours: this.props.cookieExpireInHours || 1,
			cookieAutoRenew: this.props.cookieAutoRenew || true,
			isVisible: this.props.initialVisible || true
		}
	}

	render() {
		let classList = ['InfoCenter_Info'];
		if (this.props.infoLevelClass) {
			classList.push('InfoCenter_Info-level_'+ this.props.infoLevelClass)
		}

		if (this.state.isVisible) {
			classList.push('InfoCenter_Info-isVisible');
		}

		let button = null;
		if (this.props.button) {
			button = <button onClick={this.handleClick.bind(this)} className={`info-button info-button-${this.props.button.toLocaleLowerCase()}`}>{this.props.button}</button>
		} else {
			button = <button onClick={this.handleClick.bind(this)} className={`info-button info-close-button`} title="Schließen"></button>;
		}

		return (
			<div className={classList.join(' ')}>
				<Content classes={['text']} forceBlock={true} data={this.props.data} allowedHeadlineLevel={6} />
				{button}
			</div>
		);
	}
	
	
	handleClick(e : Event) {
		this.hideInfo();		
		this.updateCookie();

		e.preventDefault();
	}

	componentDidMount() {
		if (this.cookieExists()) {
			this.hideInfo();			
			if (this.state.cookieAutoRenew) {
				this.updateCookie();
			}
		}
		
		if (!this.cookieExists() && this.props.deleteCookieAfterSeconds) {
			setTimeout(() => {
				this.updateCookie();
				this.hideInfo();
			}, this.props.deleteCookieAfterSeconds * 1000);
		}
	}

	updateCookie(deleteCookie : boolean = false) {
		let now = new Date();
		
		let expire = new Date(now.getTime() + this.state.cookieExpireInHours * 60 * 60 * 1000).getUTCDate();
		if (deleteCookie) {
			expire = 0;
		}

		document.cookie = `${this.props.cookieName}=false; expires=${expire}`;
	}

	deleteCookie() {
		this.updateCookie(true);
	}

	cookieExists() {
		if (!this.props.cookieName) {
			return true;
		}
		return document.cookie.indexOf(this.props.cookieName) !== -1;
	}

	hideInfo() {
		return new Promise((resolve) => {
			this.setState(Object.assign(this.state, {
				isVisible: false
			}), () => {
				this.props.onInfoHidden(this.props.cookieName as string)
				resolve();
			});
		});
	}
}