import React from 'react';

import Content from './Content';

class AccessModeratedContent extends Content {

	constructor(props) {
		super(props);
	}

	prepareRender(item) {
		let currentRight = this.getCurrentAccessRights();
		let requiredRight = item.access_rights;

		if (requiredRight == 'any') {
			return super.prepareRender(item);
		}

		if (currentRight == requiredRight) {
			return (<span key={item} className={`access-moderated-content ${requiredRight}`}>{ super.prepareRender(item) }</span>);
		}

		return null;
	}

	checkAccessRights(item) {
	}

	getCurrentAccessRights() {
		return 'any';
	}
}

export default AccessModeratedContent;
