import { Status } from './status-response';
import { IToken } from '../interfaces/token.interface';
export class CResponse {
    constructor(
        public status: Status,
        public message: string,
        public token?: IToken,
        public data?: any,
        public error?: any,
    ) {
        data = [];
    }
}
