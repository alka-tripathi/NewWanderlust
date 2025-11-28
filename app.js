const express = require('express');
const app = express();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Listing = require('./models/listing');
const initdata = require('./init/data.js');
//const ejs = require('ejs');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);
const path = require('path');
//public file ko use krne ke liye
app.use(express.static(path.join(__dirname, '/public')));

const { request } = require('http');
app.use(express.urlencoded({ extended: true }));
//set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
//connect db
connectDB();

const PORT = process.env.PORT || 5000;
app.use(methodOverride('_method'));

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
// app.get('/insert-data', async (req, res) => {
//   try {
//     await Listing.insertMany(initdata.data);
//     res.send('Data inserted successfully');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error inserting data');
//   }
// });

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

//NEW
app.get('/listings/new', (req, res) => {
  res.render('listings/new.ejs');
});
//CREATE
app.post('/listings', async (req, res) => {
  const newlisting = new Listing(req.body.listing);
  await newlisting.save();
  console.log(newlisting);
  res.redirect('/listings');
});

//SHOW ROUTE

app.get('/listings/:id', async (req, res) => {
  let { id } = req.params;
  try {
    const listing = await Listing.findById(id); //here Listing is a model waha se search hoga
    console.log('Each data is shown');
    res.render('listings/show', { listing });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

//EDIT Route
app.get('/listings/:id/edit', async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit', { listing });
});

app.put('/listings/:id', async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`); //it will redirect to show wale page
});

//Delete Route
app.delete('/listings/:id', async (req, res) => {
  let { id } = req.params;
  let deleletListing = await Listing.findByIdAndDelete(id);
  console.log(deleletListing);
  res.redirect('/listings');
});
