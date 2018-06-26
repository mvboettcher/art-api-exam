# Paintings API

A RESTful api to manage artwork.

## Getting Started

This section is intended for software developers. If you have rights to this repo, you can clone it. Otherwise, fork the repo and then clone it to your local machine.

```
$ git clone https://github.com/mvboettcher/art-api-exam.git
$ cd art-api-exam
```

## Dependencies

Download the necessary dependencies using `npm install`, separating each dependency with a space. These dependencies are listed in your **package.json** file

```
 $ npm install express ramda nodemon dotenv node-http-error body-parser pouchdb-core pouchdb-adapter-http
```

## Environment Variables

Within your project's root directory, create a local **.env** file in which to store your sensitive environment variables. Make sure this file is listed in your **.gitignore** file, so no one else can see it.

1.  `PORT` - Create a `PORT` environment variable. Choose a port that is not currently in use.
2.  `COUCH_HOSTNAME=https://{user}:{password}@{dbhostname}/`
3.  `COUCH_DBNAME=paintings`

**.env** file example:

```
PORT=5000
COUCHDB_URL=https://admin:38Xzp5425W@jbelushi.jrscode.cloud/
COUCHDB_NAME=paintings
```

## Load your data

To push the data located in the **load-data.js** file to your CouchDB database, run the following command into your terminal:

```
$ node load-data.js
```

## Start the api

Run the following command to start the api on the port designated in your **.env** file.

```
$ npm start
```

## Endpoints

This api allows you to create, retrieve, update, delete and list paintings in the database.

## Create a painting - `POST /paintings`

To add a painting to the database, provide a new painting resource in the request body.

The following properties are required: `name`, `movement`, `artist`, `yearCreated`, and `museum`

**Example**

```
POST /paintings

{
  "name": "The Old Guitarist",
  "movement": "expressionism",
  "artist": "Pablo Picasso",
  "yearCreated": 1904,
  "museum": {
    "name": "Art Inistitute of Chicago",
    "location": "Chicago"
  }
}
```

### Response 201 Created

Returned when the operation successfully adds the painting.

This will also return a response body...

```
{
  "ok": true,
  "id": "painting_old_guitarist",
  "rev": "1-2d60bd9915bd6a63f87c890cd729eaa7"
}
```

### Response 400 Bad request

Returned when the supplied request body is empty or is missing required fields.

### Response 404 Not Found

The requested resource could not be found. You may be trying to access a record that does not exist, or you may have supplied an invalid URL.

### Response 500 Internal Server Error

An unexpected error has occurred on our side. You should never receive this response, but if you do please let us know and we'll fix it.

## Get a single painting - `GET /paintings/_id`

Retrieve a single painting resource from the collection. To identify a single painting, enter its `_id` property in the path.

**Example**

```
GET /paintings/painting_old_guitarist
```

If found, the painting will be returned in the response body...

```
{
  "id": "painting_old_guitarist",
  "rev": "1-2d60bd9915bd6a63f87c890cd729eaa7",
  "name": "The Old Guitarist",
  "movement": "expressionism",
  "artist": "Pablo Picasso",
  "yearCreated": 1904,
  "museum": {
    "name": "Art Inistitute of Chicago",
    "location": "Chicago"
  }
  "type": "painting"
}
```

### Response 200 OK

Returned when the operation successfully retrieves the painting.

### Response 404 Not Found

The requested resource could not be found. You may be trying to access a record that does not exist, or you may have supplied an invalid URL.

### Response 500 Internal Server Error

An unexpected error has occurred on our side. You should never receive this response, but if you do please let us know and we'll fix it.

## Update a painting - `PUT /paintings/_id`

Edits a painting. To identify the original painting you wish to update, provide its `_id` in the path. Provide the updated painting in the body of the request.

The `_id`, `_rev`, `name`, `movement`, `artist`, `yearCreated`, `museum` and `type` properties are required.

You must provide the _most recent_ `_rev` for that painting to successfully update it.

**Example**

Here's an example of how to update the `museum` property of a painting...

```
PUT /paintings/painting_old_guitarist

{
  "id": "painting_old_guitarist",
  "rev": "1-2d60bd9915bd6a63f87c890cd729eaa7",
  "name": "The Old Guitarist",
  "movement": "expressionism",
  "artist": "Pablo Picasso",
  "yearCreated": 1904,
  "museum": {
    "name": "Gibbes Museum of Art",
    "location": "Charleston"
  }
  "type": "painting"
}
```

### Response 200 OK

Returned when the operation successfully updates the painting.

```
{
    "ok": true,
    "id": "painting_old_guitarist",
    "rev": "2-13998f789922d8a41ed8be8996ea41b3"
}
```

### Response 400 Bad request

Returned when the supplied request body is empty, if any required fields are missing, or if the `-id` provided in the path does not match the `-id` property value in the request body.

### Response 404 Not Found

The requested resource could not be found. You may be trying to access a record that does not exist, or you may have supplied an invalid URL.

### Response 409 Conflict

Indicates that the request could not be processed because of conflict in the request. If the document already exists, you must specify the most recent revision `_rev`, otherwise a conflict will occur.

### Response 500 Internal Server Error

An unexpected error has occurred on our side. You should never receive this response, but if you do please let us know and we'll fix it.

## Delete a painting `DELETE /paintings/_id`

Deletes a painting at the given `_id`.

```
DELETE /paintings/old_guitarist
```

### Response 200 OK

Returned when the operation successfully deletes the painting.

### Response 404 Not Found

The requested resource could not be found. You may be trying to access a record that does not exist, or you may have supplied an invalid URL.

### Response 500 Internal Server Error

An unexpected error has occurred on our side. You should never receive this response, but if you do please let us know and we'll fix it.
