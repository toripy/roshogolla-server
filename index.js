const express = require( 'express' )
const bodyParser = require( 'body-parser' );
var cors = require( 'cors' );
const MongoClient = require( 'mongodb' ).MongoClient;
const ObjectId = require( 'mongodb' ).ObjectID

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
  const ordersCollection = client.db( "roshogolla" ).collection( "orders" );
  const PlacedOrdersCollection = client.db( "roshogolla" ).collection( "placedOrder" );
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

      } )
  } )
  app.post( '/orders', ( req, res ) => {
    const order = req.body.key
    sweetCollection.find( { "_id": ObjectId( order ) } )
      .toArray( ( err, data ) => {

        const { _id } = data[0]
        ordersCollection.find( { "_id": ObjectId( _id ) } )
          .toArray( ( err, docs ) => {


            if ( docs.length === 0 ) {
              data[0].quantity = 1
               data[0].date=req.body.date
                data[0].user= req.body.user
                data[0].email= req.body.email
                
             
              ordersCollection.insertOne( data[0] )
            }
            else {

              ordersCollection.updateOne( { '_id': ObjectId( docs[0]._id ) }, {
                $inc: { quantity: 1 }

              } )
            }
          } )
      } )

  } )

    app.get( '/orderedProduct', ( req, res ) => {
    
    ordersCollection.find( {} )
      .toArray( ( err, docs ) => {
        res.send( docs )

      } )
  } )
   app.delete('/deleteAddedProduct', ( req, res ) => {
        ordersCollection.deleteMany({})
        
    })

    app.post('/ordered',(req,res)=>{
    PlacedOrdersCollection.insertOne( req.body )
            .then( result => {

                res.send( result )
            } )
    
    
})
    app.delete('/delete/:key',(req,res)=>{
      sweetCollection.deleteOne({'_id': ObjectId(req.params.key)})
})
    



} );






app.listen( 5001 )
