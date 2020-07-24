const express = require('express');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const cors = require('cors');

const app = express();
app.use(cors());

mongoose.connect('mongodb://gqluser:gqluser123@gql-shard-00-00.bvfhu.mongodb.net:27017,gql-shard-00-01.bvfhu.mongodb.net:27017,gql-shard-00-02.bvfhu.mongodb.net:27017/test?replicaSet=atlas-t5g64z-shard-0&ssl=true&authSource=admin')
mongoose.connection.once('open', () => {
    console.log('conneted to database');
});


app.get("/", (req, res) => {
    console.log("received")
    res.send({data: "OK"})
})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(5000, () => {
    console.log('now listening for requests on port 5000');
});
