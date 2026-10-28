
import 'dotenv/config';

export const env = {
    port: Number(process.env.PORT || 3000),
    mongoUri: process.env.MONGO_URI
};

if (!env.mongoUri) {
    throw new Error('MONGO_URI is required');
}