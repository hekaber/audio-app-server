AUDIOSERVER API Documentation
======================

This API is a JSON RESTful API. The client is expected to send
`application/json` as `Content-Type` and a json web token (format: `JWT <token>`) as `Authorization` HTTP Header and JSON formatted bodies.

Overview
--------
AUDIO app is storing audio files of the audio app users

Create one Media file
---------------
Add a new media to the database.

### Request
`POST /api/media`  
Insert media


### Response
#### 201 Created
The media has been successfully created
##### Example
```
{ name: 'test4', type: 0, 
  uid: '59819eaacbb7c54c76128af5', 
  _id: ObjectId("5983b0040320f86065d4514b"), 
  tags: [ 'epic' ], 
  shared: false, 
  uploaded: false, __v: 0 }
```

Bind a media file to a media document
---------------
Uploads a media binary to the server and associates it to the media _id.

### Request
`POST /api/media/:mid/file`  
Get all medias


### Response
#### 201 Created
The media binary has been successfully uploaded, a file field has been added to the media document



Read all the medias
------------------
Read all the Medias in the database.

### Request
`GET /api/media`
##### Example
```
curl --request GET https://example.tld/api/media
```

### Response
#### 200 OK
The response body is an array of Media objects.
##### Example
```
[
{ name: 'test4', type: 0, 
  uid: '59819eaacbb7c54c76128af5', 
  _id: ObjectId("5983b0040320f86065d4514b"), 
  tags: [ 'epic' ], 
  shared: false, 
  uploaded: false, __v: 0 }
]
```

Read medias for a user
------------------
`GET /api/user/:uid/medias`

### Response
#### 200 OK
The response body is an array of Media objects who belongs to a user.
##### Example
```
[
{ name: 'test4', type: 0, 
  uid: '59819eaacbb7c54c76128af5', 
  _id: ObjectId("5983b0040320f86065d4514b"), 
  tags: [ 'epic' ], 
  shared: false, 
  uploaded: false, __v: 0 }
]
```

Read one media
-------------
Read a Media given its `_id`.

### Request
`GET /api/media/:mid`

### Response
#### 200 OK
The response body is a Media object.
##### Example
```
{
    "_id": "59664afc9d9bbc071bddfa08",
    "title": "Tomato sauce",
    "body": "take 4 tomatoes...",
    "__v": 0
}
```
#### 404 Not Found
No Media could be found matching the requested `_id`.

Delete one media
-------------
Delete a Media given its `_id`.

### Request
`DELETE /api/media/:mid`

### Response
#### 200 OK
Media deleted

#### 404 Not Found
No Media could be found matching the requested `_id`.

Read all the medias popularities
--------------------------------
Read all the Medias popularities (likes/dislikes)in the database.

### Request
`GET /api/media/popularities`

### Response
#### 200 OK
The response body is an array of Media Popularity objects.
##### Example
```
[
{
    _id: "59836ec782d1d62b7fec5ba7", 
    mid: "59834fa027d06d2df9e899bf", 
    __v: 0, 
    dislikes: [], 
    likes: []}
]
```

Read the popularities for a media
--------------------------------
Read all the Medias popularities (likes/dislikes)in the database given a media _id.

### Request
`GET /api/media/:mid/popularity`

### Response
#### 200 OK
The response body is an array with one media popularity object.
##### Example
```
[
{
    _id: "59836ec782d1d62b7fec5ba7", 
    mid: "59834fa027d06d2df9e899bf", 
    __v: 0, 
    dislikes: [], 
    likes: []}
]
```

Read the popularities for a media
--------------------------------
Read all the Medias popularities (likes/dislikes)in the database given a media _id.

### Request
`GET /api/media/:mid/popularity`

### Response
#### 200 OK
The response body is an array with one media popularity object.
##### Example
```
[
{
    _id: "59836ec782d1d62b7fec5ba7", 
    mid: "59834fa027d06d2df9e899bf", 
    __v: 0, 
    dislikes: [], 
    likes: []}
]
```

Set the popularities for a media
--------------------------------
Creates a popularity for a media if this popularity does not exist else it updates it.

### Request
`POST /api/media/:mid/popularity`

### Response
#### 200 OK
The response body is an array with one created or updated media popularity object.
##### Example
```
[
{
    _id: "59836ec782d1d62b7fec5ba7", 
    mid: "59834fa027d06d2df9e899bf", 
    __v: 0, 
    dislikes: [], 
    likes: []}
]
```

Create one Tag
---------------
Add a new tag to the database.

### Request
`POST /api/tag`  
Insert tag


### Response
#### 201 Created
The tag has been successfully created
##### Example
```
{
  name: "comedie", 
  description: "theme comedie"
  _id: ObjectId("5983b0040320f86065d4514b"), 
  __v: 0 
  }
```


Read all the tags
------------------
Read all the tags in the database.

### Request
`GET /api/tag`
##### Example
```
curl --request GET https://example.tld/api/media
```

### Response
#### 200 OK
The response body is an array of tag objects.
##### Example
```
[
{
  name: "comedie", 
  description: "theme comedie"
  _id: ObjectId("5983b0040320f86065d4514b"), 
  __v: 0 
  }
]
```

Read one tag
-------------
Read a tag given its `_id`.

### Request
`GET /api/tag/:tid`

### Response
#### 200 OK
The response body is a tag object.
##### Example
```
{
  name: "comedie", 
  description: "theme comedie"
  _id: ObjectId("5983b0040320f86065d4514b"), 
  __v: 0 
  }
```
#### 404 Not Found
No tag could be found matching the requested `_id`.

Delete one tag
-------------
Delete a tag given its `_id`.

### Request
`DELETE /api/tag/:tid`

### Response
#### 200 OK
tag deleted

#### 404 Not Found
No tag could be found matching the requested `_id`.