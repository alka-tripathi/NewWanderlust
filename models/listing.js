const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },

  image: {
    filename: String,
    url: {
      type: String,
      set: (url) =>
        url === ' '
          ? 'https://images.unsplash.com/photo-1763827513396-5917fc6c84f3?...'
          : url,
    },
  },

  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
});

const Listing = mongoose.model('Listing', ListingSchema);
module.exports = Listing;
