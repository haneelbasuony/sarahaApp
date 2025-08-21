import Router from 'express';
import * as MS from './message.service.js';
import { validate } from '../../middleware/validation.js';
import { authonication } from '../../middleware/authentication.js';
import { readMessageSchema } from './message.validation.js';

const messageRouter = Router({ caseSensitive: true, strict: true });

messageRouter.post('/send', MS.sendMessage);
messageRouter.get('/viewallmessages', authonication, MS.viewAllMessage);
messageRouter.get(
  '/:id',
  authonication,
  validate(readMessageSchema),
  MS.readMessage
);

export default messageRouter;
