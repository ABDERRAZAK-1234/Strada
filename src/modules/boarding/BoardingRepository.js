import BoardingRecord from './boarding-record.model';
import { AppError } from '../../shared/errors/index.js';
const DUPLICATE_KEY_ERROR = 11000;

class BoardingRepository {
  async create(data, session) {
    try {
      const records = await BoardingRecord.create([data], { session: session });
      return records[0].toObject();
    } catch (error) {
      if (error.code === DUPLICATE_KEY_ERROR) {
        throw new AppError(409, 'TICKET_NOT_VALID', 'This ticket has already been checked.');
      }
      throw error;
    }
  }
}

export default  BoardingRepository;