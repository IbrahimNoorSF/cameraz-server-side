const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');
// MIDDLEWARE
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// ASYNC FUNCTION
async function run() {
    try {
        await client.connect();
        console.log('Connected to database');
        const database = client.db("cameraz");
        const productsCollections = database.collection("products");
        const orderCollections = database.collection("orders");
        const usersCollections = database.collection("users");
        const reviewsCollections = database.collection("reviews");
        // CRUD OPERATIONS STARTS HERE

        // GET API
        app.get('/products', async (req, res) => {
            // RUN FIND OPERATION FOR ALL DATA FROM DATABASE COLLECTION
            const cursor = productsCollections.find({});
            // CONVERT DATA TO AN ARRAY
            const products = await cursor.toArray();
            res.send(products);
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollections.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        // GET API
        app.get('/orders', async (req, res) => {
            // RUN FIND OPERATION FOR ALL DATA FROM DATABASE COLLECTION
            const cursor = orderCollections.find({});
            // CONVERT DATA TO AN ARRAY
            const orders = await cursor.toArray();
            res.send(orders);
        })

        // GET API
        app.get('/reviews', async (req, res) => {
            // RUN FIND OPERATION FOR ALL DATA FROM DATABASE COLLECTION
            const cursor = reviewsCollections.find({});
            // CONVERT DATA TO AN ARRAY
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        // POST API
        app.post('/products', async (req, res) => {
            const products = req.body;
            console.log('Hitting the post api');
            const result = await productsCollections.insertOne(products);
            console.log(result);
            res.json(result);
        })

        // POST APi
        app.post('/orders', async (req, res) => {
            const order = req.body;
            console.log('Hitting the post api');
            const result = await orderCollections.insertOne(order);
            console.log(result);
            res.json(result);
        })

        // POST APi
        app.post('/users', async (req, res) => {
            const users = req.body;
            console.log('Hitting the post api');
            const result = await usersCollections.insertOne(users);
            console.log(result);
            res.json(result);
        })

        // POST API
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            console.log('Hitting the post api');
            const result = await reviewsCollections.insertOne(review);
            console.log(result);
            res.json(result);
        })

        // PUT API
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = {
                $set: { role: "admin" },
            };
            const result = await usersCollections.updateOne(filter, updateDoc);
            console.log('updating user', req);
            res.json(result);
        })

        // PUT API (UPDATE)
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedOrderStatus = req.body.status;
            console.log(req.body, id);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: { status: updatedOrderStatus },
            };
            const result = await orderCollections.updateOne(filter, updateDoc, options);
            console.log('updating user');
            res.json(result);
        })

        // DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            query = { _id: ObjectId(id) };
            const result = await orderCollections.deleteOne(query);
            console.log('Delete request generated from client side for id: ', id);
            res.json(result);
        })

        // DELETE API
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            query = { _id: ObjectId(id) };
            const result = await productsCollections.deleteOne(query);
            console.log('Delete Request generated from client side for id: ', id);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
// CALL ASYNC FUNCTION TO EXECUTE
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Hello from my NODE')
});
app.listen(port, () => {
    console.log('Listening to', port)
});