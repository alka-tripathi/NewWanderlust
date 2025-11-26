const express = require('express');
const app = express();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Listing = require('./models/listing');
const initdata = require('./init/data.js');
//const ejs = require('ejs');

const path = require('path');
app.use(express.urlencoded({ extended: true }));
//set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
//connect db
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, (req, res) => {
  console.log('Server is listening to port');
});
app.get('/', (req, res) => {
  res.send('Hi i am root page');
});

// app.get('/testListing', async (req, res) => {
//   let sampleListing = new Listing({
//     title: 'Cozy Cottage',
//     description: 'A cozy cottage in the countryside.',
//     price: 12000,
//     image: ' ',
//     location: 'Countryside',
//     country: 'USA',
//   });
//   await sampleListing.save();
//   console.log('Sample listing saved');
//   res.send('Sample listing created');
// });
// app.get("/insert-data",async(req,res)=>{
//   try{
//     await Listing.insertMany(initdata.data);
//     res.send("Data inserted successfully");
//   }catch(err){
//     console.error(err);
//     res.status(500).send("Error inserting data");
//   }
// })

// Route to display all listings
// INDEX ROUT
app.get('/listings', async (req, res) => {
  try {
    const alllistings = await Listing.find({});
    res.render('listings/index', { alllistings });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

//SHOW ROUTE

app.get('/listings/:id', async (req, res) => {
  let { id } = req.params;
  try {
    const listing = await Listing.findById(id);
    console.log('Each data is shown');
    res.render('listings/show', { listing });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
