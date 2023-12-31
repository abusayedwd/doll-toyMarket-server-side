const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

   

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b1f0ncj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
     client.connect();
    
    const  toyCollection = client.db('dollToy').collection('addtoys')

    app.get('/alltoys', async(req, res) => {
        const data = toyCollection.find();
        const result = await data.toArray()
        res.send(result)
    })
        // Add new toys
        app.get('/addtoys', async(req, res) => {
                console.log(req.query.email)
                let query = {};
                if(req.query?.email){
                        query = {email: req.query.email}
                }
                const result = await toyCollection.find(query).toArray()
                res.send(result)
        })

        app.delete('/addtoys/:id', async(req,res) => {
                const id = req.params.id;
                const query = {_id: new ObjectId(id)}
                const result = await toyCollection.deleteOne(query)
                res.send(result)
        })

        app.get('/addtoys/:id', async(req,res) => {
                const id = req.params.id;
                const query = {_id: new ObjectId(id)}
                const result = await toyCollection.findOne(query)
                res.send(result)
        })

        app.put('/addtoys/:id', async(req,res) => {
                const id = req.params.id;
                const filter = {_id: new ObjectId(id)}
                // const options = { upsert: true };
                const updatetoy = req.body;
                const toy = {
                        $set: {
                                price: updatetoy.price,
                                qty:updatetoy.qty,
                                description:updatetoy.description,
                        }
                }
               const result = await toyCollection.updateOne(filter, toy,)
               res.send(result)
        })

        //search text api
         


    app.post('/addtoys',async(req,res)=>{
        const newToy = req.body;
        console.log(newToy)
        const result = await toyCollection.insertOne(newToy);
        res.send(result);
      })
      app.get('/alltoys/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)} 
        const result = await  toyCollection.findOne(query)
        res.send(result)
    })

     





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
//     await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res ) => {
        res.send('doll toy runnung')
})

app.listen(port, () => {
        console.log(`doll server is open: ${port}`)
})