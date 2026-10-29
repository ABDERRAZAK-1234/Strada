
import mongoose from 'mongoose';

export class TransactionRunner {
  async run(callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('Transaction callback must be a function');
    }

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const result = await callback(session);

      await session.commitTransaction();

      return result;
    } catch (error) {
      if (session.inTransaction()) {
        try {
          await session.abortTransaction();
        } catch (abortError) {
          console.error('Failed to abort transaction:', abortError);
        }
      }

      throw error;
    } finally {
      await session.endSession();
    }
  }
}
