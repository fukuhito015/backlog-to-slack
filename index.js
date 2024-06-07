// server.js
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use('/slack-api/backlog', require('./route/slack-api/backlog'))

const port = process.env.PORT || 3001

// サーバーを起動
app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`)
})
