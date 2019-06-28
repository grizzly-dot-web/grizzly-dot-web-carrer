import {
  REQUEST_UPDATE_SETTINGS,
  REQUEST_SETTINGS,
  RECEIVE_SETTINGS,
  REQUEST_ENTITIES,
  RECEIVE_ENTITIES,
  REQUEST_ENTITY_UPDATE,
  REQUEST_ENTITY_CREATION,
  REQUEST_ENTITY_DELETION,
  STATUS_UPDATE
} from './mutations'
import db from '../config/db'

export default {
  updateSettings (context, { id, entity }) {
    context.commit(REQUEST_UPDATE_SETTINGS, { id, entity })

    return db('settings').get(id).then(function (doc) {
      doc = {
        ...doc,
        ...entity,
        _id: id,
        _rev: doc._rev,
        modified: Date.now()
      }
      console.log('save', doc)
      return db('settings').put(doc)
    })
      .then((result) => {
        context.commit(STATUS_UPDATE, {
          show: true,
          messages: [id, 'updated'],
          color: 'success',
          result
        })
      })
      .catch((err) => {
        if (err.status === 404) {
          let doc = {
            ...entity,
            _id: id,
            modified: Date.now()
          }

          console.log('create', doc)
          return db('settings').put(doc)
        }

        throw err
      })
      .then((result) => {
        context.commit(STATUS_UPDATE, {
          show: true,
          messages: ['successful_updated', id],
          color: 'success',
          result
        })
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err)
        context.commit(STATUS_UPDATE, {
          show: true,
          messages: ['failure_updated', id],
          color: 'error',
          error: err
        })
      })
  },
  fetchSettings (context) {
    context.commit(REQUEST_SETTINGS)
    return db('settings').allDocs({
      include_docs: true,
      attachments: true
    }).then(
      result => {
        let settings = {}
        for (let doc of result.rows.map((row) => row.doc)) {
          settings[doc._id] = doc
        }

        context.commit(RECEIVE_SETTINGS, settings)
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.log(error)
      }
    )
  },
  createEntity (context, { id, entity }) {
    context.commit(REQUEST_ENTITY_CREATION, { id, entity })
    return db(id).post({
      ...entity,
      created: Date.now(),
      modified: Date.now()
    })
      .then((result) => {
        context.commit(STATUS_UPDATE, {
          show: true,
          messages: [id, 'successful_created'],
          color: 'success',
          result
        })
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err)
        context.commit(STATUS_UPDATE, {
          show: true,
          messages: [id, 'failure_created'],
          color: 'error',
          error: err
        })
      })
  },
  editEntity (context, { id, entity }) {
    context.commit(REQUEST_ENTITY_UPDATE, { id, entity })
    return db(id).get(entity._id)
      .then((doc) => {
        db(id).put({
          ...doc,
          ...entity,
          _rev: doc._rev,
          modified: Date.now()
        })
      })
      .then((result) => {
        context.commit(STATUS_UPDATE, {
          show: true,
          messages: [id, 'successful_updated'],
          color: 'success',
          result
        })
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err)
        context.commit(STATUS_UPDATE, {
          show: true,
          messages: [id, 'failure_updated'],
          color: 'error',
          error: err
        })
      })
  },
  deleteEntity (context, { table, id }) {
    return db(table).get(id)
      .then((doc) => {
        context.commit(REQUEST_ENTITY_DELETION, { table, entity: doc })
        return db(table).remove(doc)
      })
      .then((result) => {
        context.commit(STATUS_UPDATE, {
          show: true,
          messages: [table, 'successful_deleted'],
          color: 'success',
          result
        })
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err)
        context.commit(STATUS_UPDATE, {
          show: true,
          messages: [table, 'failure_deleted'],
          color: 'error',
          error: err
        })
      })
  },
  fetchEntities (context, { id }) {
    context.commit(REQUEST_ENTITIES, { id })
    return db(id).allDocs({
      include_docs: true,
      attachments: true
    }).then(
      result => {
        context.commit(RECEIVE_ENTITIES, { entities: result.rows.map((row) => row.doc), id })
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.log(error)
      }
    )
  }

}
