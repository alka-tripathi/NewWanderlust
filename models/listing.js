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
          ? 'https://images.unsplash.com/photo-1632178702478-a3a628c2886d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          : url,
    },
  },

  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});

const Listing = mongoose.model('Listing', ListingSchema);
module.exports = Listing;
