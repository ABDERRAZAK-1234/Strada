import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

let replSet = null;

const KEEP_COLLECTIONS = ['users', 'cities', 'stops'];

async function connectTestDb() {
  replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(replSet.getUri());

  const models = Object.values(mongoose.models);
  for (const model of models) {
    await model.init();
  }
}

async function clearTestDb() {
  const collections = Object.values(mongoose.connection.collections);
  for (const collection of collections) {
    if (!KEEP_COLLECTIONS.includes(collection.collectionName)) {
      await collection.deleteMany({});
    }
  }
}

async function disconnectTestDb() {
  await mongoose.disconnect();
  if (replSet) {
    await replSet.stop();
    replSet = null;
  }
}

export { connectTestDb, clearTestDb, disconnectTestDb };
