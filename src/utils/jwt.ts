import jwt from 'jsonwebtoken';
import { env } from '../env';

export class JWT {
  static createToken(data: object) {
    return jwt.sign(data, env.JWT_SECRET, { expiresIn: '3h' });
  }
}
