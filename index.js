const express = require("express")
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
const app = express();
const port = process.env.PORT || 50000;

app.use(cors())
app.use(express.json())
// user:mydbuser1
// password:6oYzaPqOhBbB8qmO



const uri = "mongodb+srv://DB_USER:DB_PASS@cluster0.v8i8y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);
async function run() {
    try {
        await client.connect();
        const database = client.db("foodMaster");
        const usersCollection = database.collection("users");

        // Get API
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray()
            res.send(users)
        })

        //    Post API
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser)
            console.log('Hitting the post', req.body)
            console.log(result)
            res.json(result)
        })
        // DELETE API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(query)
            console.log('delete with id', id)
            res.json(1)
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running My Crud Server')
})

app.listen(port, () => {
    console.log('Running Server on port', port)
})