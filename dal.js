require('dotenv').config()
const PouchDB = require('pouchdb-core')
PouchDB.plugin(require('pouchdb-adapter-http'))

const { merge, map, prop } = require('ramda')
const pkGen = require('./lib/pk-gen')

const db = new PouchDB(`${process.env.COUCHDB_URL}${process.env.COUCHDB_NAME}`)

const addPainting = (painting, callback) => {
	const modifiedPainting = merge(painting, {
		type: 'painting',
		_id: pkGen('painting', '_', `${painting.name}`)
	})
	db.put(modifiedPainting, callback)
}

const getPainting = (id, callback) => db.get(id, callback)

const updatePainting = (painting, callback) => db.put(painting, callback)

const deletePainting = (id, callback) => {
	db.get(id, function(err, painting) {
		db.remove(painting, callback)
	})
}

const listPaintings = (limit, paginate) =>
	db
		.allDocs(
			paginate
				? { include_docs: true, limit, start_key: `${paginate}\ufff0` }
				: { include_docs: true, limit }
		)
		.then(response => map(prop('doc'), response.rows))

module.exports = {
	addPainting,
	getPainting,
	updatePainting,
	deletePainting,
	listPaintings
}
