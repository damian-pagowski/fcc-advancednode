'use strict'

require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fccTesting = require('./freeCodeCamp/fcctesting.js')

const app = express()
const routes = require('./routes.js')
const auth = require('./auth.js')
// DB Connection
const url = process.env.DATABASE
const dbName = 'test'
const MongoClient = require('mongodb').MongoClient
const client = new MongoClient(url)

app.set('view engine', 'pug')
fccTesting(app) // For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

client.connect(function (err) {
  if (err) {
    console.log('Database error: ' + err)
  } else {
    const db = client.db(dbName)
    auth(app, db)
    routes(app, db)
    app.listen(process.env.PORT || 3000, () => {
      console.log('Listening on port ' + process.env.PORT)
    })
  }
})
