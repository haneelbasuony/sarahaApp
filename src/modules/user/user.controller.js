import { Router } from 'express';
import * as UC from './user.service.js';
import { authonication } from '../../middleware/authentication.js';
import { validate } from '../../middleware/validation.js';
import * as UV from './user.validation.js';
import { authorization } from '../../middleware/authorization.js';
import { userRoles } from '../../DB/models/user.model.js';
import { allowedExtensions, MulterHost } from '../../middleware/Multer.js';

const userRouter = Router();

userRouter.post(
  '/signup',
  MulterHost(allowedExtensions.image).single('file'),
  validate(UV.signUpSchema),
  UC.signUp
);

userRouter.get('/confirmemail/:token', UC.confirmEmail);

userRouter.post('/signin', validate(UV.signInSchema), UC.signIn);
userRouter.post('/gmaillogin', UC.loginWithGmail);

userRouter.get(
  '/getprof',
  authonication,
  authorization([userRoles.user]),
  UC.getProfile
);
userRouter.get('/visitprofile/:id', UC.visitProfile);

userRouter.post('/logout', authonication, UC.logOut);

userRouter.patch(
  '/updatepassword',
  validate(UV.updatePasswordSchema),
  authonication,
  UC.updatePassword
);

userRouter.patch(
  '/forgetpassword',
  validate(UV.forgetPasswordSchema),
  UC.forgetPassword
);

userRouter.patch(
  '/resetpassword',
  validate(UV.resetPasswordSchema),
  UC.resetPassword
);

userRouter.patch(
  '/updateprofile',
  authonication,
  validate(UV.updateProfileSchema),
  UC.updateProfile
);

userRouter.patch(
  '/updateprofile',
  authonication,
  validate(UV.updateProfileSchema),
  UC.updateProfile
);

userRouter.delete(
  '/freezeaccount/{:id}',
  authonication,
  validate(UV.freezeAccountSchema),
  UC.freezeAccount
);
export default userRouter;
