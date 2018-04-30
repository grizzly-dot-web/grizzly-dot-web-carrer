import * as React from 'react';

export interface AppProps {
	data : any
}
class Header extends React.Component<AppProps> {

	constructor(props : any) {
		super(props);

		this.state = {
			data: this.props.data
		};
	}

	render() {

		return (
			<header>
				<div className="container">
				</div>
			</header>
		);
	}
}

export default Header;
