const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const app = express()
const port = process.env.PORT || 4000;
require("dotenv").config()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Connected')
})

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvvgh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const studentsCollection = client.db("studentsList").collection("students");
    //post
    app.post('/addStudent', (req, res) => {
        const studentInfo = req.body;
        studentsCollection.insertOne(studentInfo)
            .then((result) => {
                res.send(result.acknowledged)
            })
    })

    //get
    app.get('/getStudents', (req, res) => {
        studentsCollection.find()
            .toArray((err, result) => {
                res.send(result)
            })
    })

    //read single data using id 
    app.get('/getSingleStudent/:id', (req, res) => {
        studentsCollection.find({_id: ObjectId(req.params.id)})
            .toArray((err, result) => {
                res.send(result[0])
            })
    })

    //delete
    app.delete('/studentDelete/:id', (req, res) => {
        studentsCollection.deleteOne({ _id: ObjectId(req.params.id)})
            .then(result => {
                res.send(result.acknowledged)
            })
    })


});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})