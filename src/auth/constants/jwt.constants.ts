import { Algorithm } from 'jsonwebtoken';

export const jwtConstants = {
  secret: 'Do not use this value in production.',
  algorithm: 'HS256' as Algorithm,
};
