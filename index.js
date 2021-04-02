const express = require( 'express' )
const bodyParser = require( 'body-parser' );
var cors = require( 'cors' );
const MongoClient = require( 'mongodb' ).MongoClient;
const ObjectID = require( 'mongodb' ).ObjectID()

const port = process.env.PORT;
const app = express()


app.use( cors() );
app.use( bodyParser.json() );
require( "dotenv" ).config();



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e6zee.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology: true } );

app.get( '/', ( req, res ) => {
  res.send( 'Hello World!' )
} )

client.connect( err => {

  const sweetCollection = client.db( "roshogolla" ).collection( "products" );

  app.post( '/addProduct', ( req, res ) => {
    const newProduct = req.body;
    console.log( newProduct );
    sweetCollection.insertOne( newProduct )
      .then( result => {
        res.send( result )
        
      } )
  } )

  app.get( '/products', ( req, res ) => {
    sweetCollection.find( {} )
      .toArray( ( err, docs ) => {
        res.send( docs )
        console.log(docs)
      } )
  } )

} );





app.listen( 5050 )
