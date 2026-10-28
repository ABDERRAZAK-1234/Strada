import mongoose from 'mongoose';

export class DatabaseConnection {
  constructor({ mongoUri }) {
    this.mongoUri = mongoUri;
  }

  async connect() {
    await mongoose.connect(this.mongoUri);

    console.log('MongoDB connected successfully');
  }

  async disconnect() {
    await mongoose.disconnect();

    console.log('MongoDB disconnected');
  }
}
