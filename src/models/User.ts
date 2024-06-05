import { UUID } from 'node:crypto';

export interface User {
  id: UUID;
  name: string;
  email: string;
  password: string;
  created_at?: string;
}
