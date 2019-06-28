export const REQUEST_UPDATE_SETTINGS = 'REQUEST_UPDATE_SETTINGS';
export const COMPLETE_REQUEST_UPDATE_SETTINGS = 'COMPLETE_REQUEST_UPDATE_SETTINGS';
export const REQUEST_SETTINGS = 'REQUEST_SETTINGS';
export const RECEIVE_SETTINGS = 'RECEIVE_SETTINGS';
export const SELECT_ENTITY = 'SELECT_CUSTOMER';
export const DESELECT_ENTITY = 'DESELECT_CUSTOMER';
export const REQUEST_ENTITIES = 'REQUEST_CUSTOMERS';
export const RECEIVE_ENTITIES = 'RECEIVE_CUSTOMERS';
export const REQUEST_ENTITY_UPDATE = 'REQUEST_CUSTOMER_UPDATE';
export const REQUEST_ENTITY_CREATION = 'REQUEST_CUSTOMER_CREATION';
export const REQUEST_ENTITY_DELETION = 'REQUEST_CUSTOMER_DELETION';
export const STATUS_UPDATE = 'STATUS_UPDATE';

export default {
	[SELECT_ENTITY](state, {
		id, entity
	}) {
		if (!state.hasOwnProperty(id)) {
			throw new Error('state does not have property: ' +id)
		}

		state[id] = {
			...state[id],
			selected: entity
		};
	},
	[DESELECT_ENTITY](state, entityKey) {
		if (!state.hasOwnProperty(entityKey)) {
			throw new Error('state does not have property: ' +entityKey)
		}

		state[entityKey] = {
			...state[entityKey],
			selected: undefined
		};
	},
	[REQUEST_ENTITY_UPDATE](state, {
		id, entity
	}) {
		let origin = state[id].items.filter(c => c._id === entity._id)[0];

		origin = {
			...origin,
			...entity
		};
	},
	[REQUEST_ENTITY_CREATION](state, { entity, id }) {
		state[id] = {
			...state[id],
			items: [
				...state[id].items,
				entity
			],
			isFetching: false,
			didInvalidate: false,
		};
	},
	[REQUEST_ENTITY_DELETION](state, { table, entity }) {
		let index = state[table].items.indexOf(state[table].items.filter(c => c._id === entity._id)[0]);
		if (index > -1) {
			state[table].items.splice(index, 1);
		}
	},
	[STATUS_UPDATE](state, newStatus) {
		state.status = {
			...state.status,
			...newStatus
		};
	},
	[REQUEST_ENTITIES](state, {id}) {
		state[id] = {
			...state[id],
			isFetching: false,
			didInvalidate: true,
		};
	},
	[RECEIVE_ENTITIES](state, {entities, id}) {
		state[id] = {
			...state[id],
			items: entities,
			isFetching: false,
			didInvalidate: false,
		};
	},
	[REQUEST_UPDATE_SETTINGS](state) {
	},
	[REQUEST_SETTINGS](state) {

	},
	[RECEIVE_SETTINGS](state, settings) {
		state.settings = {
			...state.settings,
			...settings
		};
	},
};
