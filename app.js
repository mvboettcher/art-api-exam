require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5002
const bodyParser = require('body-parser')
const NodeHTTPError = require('node-http-error')
const { propOr, isEmpty, not, compose, join, pathOr } = require('ramda')
const checkRequiredFields = require('./lib/check-required-fields')
const {
	addPainting,
	getPainting,
	updatePainting,
	deletePainting,
	listPaintings
} = require('./dal')

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
	res.send('Welcome to the Art API. Manage all the paintings.')
})

app.post('/paintings', (req, res, next) => {
	const newPainting = propOr({}, 'body', req)

	if (isEmpty(newPainting)) {
		next(
			new NodeHTTPError(
				400,
				'Please add a painting to your request body.  Ensure the Content-Type is application/json.'
			)
		)
		return
	}

	const missingFields = checkRequiredFields(
		['name', 'movement', 'artist', 'yearCreated', 'museum'],
		newPainting
	)

	const sendMissingFieldError = compose(
		not,
		isEmpty
	)(missingFields)

	if (sendMissingFieldError) {
		next(
			new NodeHTTPError(
				400,
				`You didn't pass all the required fields: ${join(', ', missingFields)}`
			)
		)
	}
	addPainting(newPainting, function(err, result) {
		if (err) next(new NodeHTTPError(err.status, err.message, err))
		res.status(201).send(result)
	})
})

app.get('/paintings/:paintingID', function(req, res, next) {
	const paintingID = req.params.paintingID
	getPainting(paintingID, function(err, data) {
		if (err) {
			next(new NodeHTTPError(err.status, err.message, err))
			return
		}
		res.status(200).send(data)
	})
})

app.put('/paintings/:paintingID', function(req, res, next) {
	const updatedPainting = propOr({}, 'body', req)

	if (isEmpty(updatedPainting)) {
		next(
			new NodeHTTPError(
				400,
				'Please add a painting to your request body.  Ensure the Content-Type is application/json.'
			)
		)
	}

	const missingFields = checkRequiredFields(
		['_id', '_rev', 'name', 'movement', 'artist', 'yearCreated', 'museum'],
		updatedPainting
	)

	const sendMissingFieldError = compose(
		not,
		isEmpty
	)(missingFields)

	if (sendMissingFieldError) {
		next(
			new NodeHTTPError(
				400,
				`You didn't pass all the required fields: ${join(', ', missingFields)}`
			)
		)
	}

	updatePainting(updatedPainting, function(err, result) {
		if (err) next(new NodeHTTPError(err.status, err.message))
		res.status(200).send(result)
	})
})

app.delete('/paintings/:paintingID', (req, res, next) =>
	deletePainting(req.params.paintingID, function(err, data) {
		if (err) {
			next(new NodeHTTPError(err.status, err.message, err))
		}
		res.status(200).send(data)
	})
)

app.get('/paintings', (req, res, next) => {
	const limit = Number(pathOr(10, ['query', 'limit'], req))

	const paginate = pathOr(null, ['query', 'start_key'], req)

	listPaintings(limit, paginate)
		.then(paintings => res.status(200).send(paintings))
		.catch(err => next(new NodeHTTPError(err.status, err.message, err)))
})

app.use(function(err, req, res, next) {
	console.log(
		'ERROR! ',
		'METHOD: ',
		req.method,
		' PATH',
		req.path,
		' error:',
		JSON.stringify(err)
	)
	res.status(err.status || 500)
	res.send(err)
})

app.listen(port, () => console.log('Greetings!', port))
