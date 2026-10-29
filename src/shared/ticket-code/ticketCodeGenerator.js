
import { randomBytes } from 'node:crypto';

export class TicketCodeGenerator {
    generate() {
        const randomCode = randomBytes(3).toString('hex').toUpperCase();

        return `TKT-${randomCode}`;
    }
}
