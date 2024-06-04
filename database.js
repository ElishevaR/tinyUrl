
import mongoose from "mongoose";

// Replace the uri string with your connection string.
const uri =
"mongodb://localhost:27017/tinyUrl";

const connectDB = async () => {
  await mongoose.connect(uri);
};
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
})

database.once('connected', () => {
  console.log('Database Connected');
})
mongoose.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
  }
});

export default connectDB;

