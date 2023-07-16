const express = require('express')
const router = require('./routes')
const mongoose = require('mongoose')

const app = express()

app.use((req, res, next) => {
  req.user = {
    _id: "64ad789e4354330751955452"
  }
  next()
})

mongoose.connect('mongodb://localhost:27017/mestodb')

app.use(express.json())
app.use(router)
app.use('*',(req, res)=>{res.status(404).send({message: "404 page not found"})})
app.listen(3000, () => { console.log('listen 300 port'); })