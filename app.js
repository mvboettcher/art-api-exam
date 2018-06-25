require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5002
const bodyParser = require('body-parser')
const NodeHTTPError = require('node-http-error')
const { propOr, isEmpty, not, compose, join } = require('ramda')
const checkRequiredFields = require('./lib/check-required-fields')
const { addPainting } = require('./dal')

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
	res.send('Welcome to the Art API. Manage all the paintings.')
})

app.post('/maxart', (req, res, next) => {
	const newPainting = propOr({}, 'body', req)

	if (isEmpty(newPainting)) {
		next(
			new NodeHTTPError(
				400,
				'Please add a painting to the request body.  Ensure the Content-Type is application/json.'
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

app.listen(port, () => console.log('API is up!', port))
