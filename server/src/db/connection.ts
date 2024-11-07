import mongoose from 'mongoose';
// Connect to MongoDB (adjust URI as needed)
const MONGODB_URI = Deno.env.get('MONGODB_URI');
try {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }
  await mongoose.connect(MONGODB_URI);

  console.log('Connected to ' + MONGODB_URI);
} catch (error) {
  console.error(error);
}
export default mongoose;
