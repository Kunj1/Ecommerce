import mongoose from 'mongoose';

const dbUri = process.env.MONGODB_URI;

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

const cartItemSchema = new mongoose.Schema({
  userId: String,
  items: [
    {
      itemId: String,
      name: String,
      quantity: Number
    }
  ]
});

const Cart = mongoose.model('Cart', cartItemSchema);

export default Cart;
