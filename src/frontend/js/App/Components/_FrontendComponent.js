import React from 'react';
import check from 'check-types';

class FrontendComponent extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			config: this.props.config,
			data: this.props.data,
		};
	}

	renderComponents(compnentsData) {
		if (!check.array(compnentsData)) {
			return null;
		}

		let allowedComponents = this.allowedComponents();
		//TODO ErrorHandling auslagern
		const errorWrongComponentConfigurationDescription =`Illegal allowedComponents() return value:`;
		const errorWrongComponentConfigurationExample = `Expected Object see Example.\n{ "Component": { class: Component, props: {}, [OPTIONAL children: (<ChildComponent />)] }, ... } `;

		if (!check.object(allowedComponents)) {
			throw new Error(`${errorWrongComponentConfigurationDescription}\n ${allowedComponents} \n\n${errorWrongComponentConfigurationExample}`);
		}

		let counter = 1;
		let components = compnentsData.map((data) => {
			let invalidParameterClass
				= !check.function(allowedComponents[data.type].class);

			let invalidOptionalParameterProps
				= ( check.assigned(allowedComponents[data.type].props) && !check.object(allowedComponents[data.type].props) );

			let invalidOptionalParameterData
				= ( check.assigned(allowedComponents[data.type].data) && !check.object(allowedComponents[data.type].data) );

			if (
				invalidParameterClass
				|| invalidOptionalParameterProps
				|| invalidOptionalParameterData
			) {
				let reason = invalidParameterClass ? '- allowedComponent.class must be an instanceof React.Element\n' : '';
				reason += invalidOptionalParameterProps ? '- allowedComponent.props must be an Object\n' : '';
				reason += invalidOptionalParameterData ? '- allowedComponent.class must be an instanceof React.Element\n' : '';

				reason += `\nGiven Object: ${ JSON.stringify(allowedComponents[data.type]) }\n`;

				throw new Error(`${errorWrongComponentConfigurationDescription}\n ${reason}\n ${errorWrongComponentConfigurationExample}`);
			}

			let props = Object.assign({
				key: counter++,
				config: data.config,
				data: data.data,
			}, allowedComponents[data.type].props);

			let children = null;
			if (check.assigned(allowedComponents[data.type].children)) {
				children = allowedComponents[data.type].children;
			}

			let comp = React.createElement(allowedComponents[data.type].class, props, allowedComponents[data.type].props, children);
			//TODO Renders only one Article WTF why!?!?!! maybe ChildComponents must be rendered recursive?
			//console.log('json data type', data.type);
			//console.log('component data type', comp.type.name);
			//console.log('component', comp);
			return comp;
		});

		return components;
	}
}

export default FrontendComponent;
