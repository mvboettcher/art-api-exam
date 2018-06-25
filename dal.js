require('dotenv').config()
const PouchDB = require('pouchdb-core')
PouchDB.plugin(require('pouchdb-adapter-http'))

const { merge } = require('ramda')
const pkGen = require('./lib/pk-gen')

const db = new PouchDB(`${process.env.COUCHDB_URL}${process.env.COUCHDB_NAME}`)

const addPainting = (painting, callback) => {
	const modifiedPainting = merge(painting, {
		type: 'painting',
		_id: pkGen('painting', '_', `${painting.name}`)
	})
	db.put(modifiedPainting, callback)
}

module.exports = {
	addPainting
}
