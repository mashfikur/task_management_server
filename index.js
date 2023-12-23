const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Server is Running Successfully");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rnoho8k.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // databases and collections
    const tasksCollection = client.db("swiftTaskDB").collection("tasks");

    // get requests
    app.get("/api/v1/user/get-tasks/:id", async (req, res) => {
      const id = req.params.id;

      const filter = { $and: [{ userid: id }, { status: "todo" }] };

      const result = await tasksCollection.find(filter).toArray();

      res.send(result);
    });

    //post requests
    app.post("/api/v1/user/add-task", async (req, res) => {
      const info = req.body;
      const result = await tasksCollection.insertOne(info);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on ${port} `);
});
