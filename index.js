const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://shrimon1999:${process.env.DB_PASS}@cluster0.ppfmuai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// console.log(uri);

//middleware
const corsConfig = {
  origin: ["http://localhost:5173",'http://localhost:5174',"https://brandshop-82def.web.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsConfig));
app.options("", cors(corsConfig));
app.use(express.json());

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const tourCollection = client.db("Touriza").collection("TouristSpot");
    const countryCollection = client.db("Touriza").collection("Country");
    const userCollection = client.db("Touriza").collection("User");
    app.get("/tour", async (req, res) => {
      let query = {};
      // console.log(req.query);
      if (req.query?.email) {
        query = { email: req.query.email };
      }

      const result = await tourCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/country", async (req, res) => {
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/country/:name", async (req, res) => {
      const name = req.params.name;
      const query = { countryName: name };
      console.log(name);
      const result = await countryCollection.findOne(query);
      // const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/tour", async (req, res) => {
      const newTour = req.body;
      //   console.log(newTour);
      const result = await tourCollection.insertOne(newTour);
      console.log(result);
      res.send(result);
    });
    app.post("/user", async (req, res) => {
      const newUser = req.body;
      //   console.log(newTour);
      const result = await userCollection.insertOne(newUser);
      console.log(result);
      res.send(result);
    });
    app.get("/user", async (req, res) => {
      const result = await userCollection.find().toArray();
      console.log(result);
      res.send(result);
    });
    app.get("/tour/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tourCollection.findOne(query);
      res.send(result);
    });
    app.put("/tour/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updatedTour = req.body;
      const tour = {
        $set: {
          name: updatedTour.name,
          tourisSpotName: updatedTour.tourisSpotName,
          countryName: updatedTour.countryName,
          location: updatedTour.location,
          averageCost: updatedTour.averageCost,
          travelTime: updatedTour.travelTime,
          totalVisitorPerYear: updatedTour.totalVisitorPerYear,
          seasonality: updatedTour.seasonality,
          image: updatedTour.image,
          description: updatedTour.description,
        },
      };
      const result = await tourCollection.updateOne(filter, tour, option);
      res.send(result);
    });
    app.delete("/tour/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tourCollection.deleteOne(query);
      res.send(result);
    });

    // user data
    app.post("/user", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await userCollection.insertOne(newUser);
      console.log(result);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
  //  await client.db("admin").command({ ping: 1 });
  //   console.log(
  //     "Pinged your deployment. You successfully connected to MongoDB!"
  //   ); 
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Tour server is running");
});

app.listen(port, () => {
  console.log(` Tour server is running, ${port}`);
});
