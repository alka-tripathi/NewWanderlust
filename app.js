const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Listing = require('./models/listing');
const initdata = require('./init/data.js');
//const ejs = require('ejs');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);
const path = require('path');

//WrapAysnc Function
const ExpressError = require('./utils/ExpressErrors.js');
const wrapAsync = require('./utils/wrapAsync.js');

//public file ko use krne ke liye
app.use(express.static(path.join(__dirname, '/public')));

const { request } = require('http');

//set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
//connect db
connectDB();

const PORT = process.env.PORT || 5000;
app.use(methodOverride('_method'));

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

// INDEX ROUT
app.get('/listings', async (req, res) => {
  try {
    //console.log('REQ BODY:', req.body);
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
app.post(
  '/listings',
  wrapAsync(async (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressError(400, 'Send Validate Data for Listing!'); //client error
    }
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    console.log(newlisting);
    res.redirect('/listings');
  })
);

//SHOW ROUTE
app.get(
  '/listings/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id); //here Listing is a model waha se search hoga
    console.log('Each data is shown');
    res.render('listings/show', { listing });
  })
);

//EDIT Route
app.get(
  '/listings/:id/edit',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit', { listing });
  })
);

app.put(
  '/listings/:id',
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, 'Send valid data for listing!');
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`); //it will redirect to show wale page
  })
);

//Delete Route
app.delete(
  '/listings/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleletListing = await Listing.findByIdAndDelete(id);
    console.log(deleletListing);
    res.redirect('/listings');
  })
);
//standard error matchs with everyone
app.use((req, res, next) => {
  next(new ExpressError(404, 'Page Not Found!'));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err;
  res.render('error.ejs');
  res.status(statusCode).send(message);
});

app.listen(PORT, (req, res) => {
  console.log('Server is listening to port');
});

//Submitting the form
