import express from 'express';
import passport from 'passport';
import authController from './auth.controller';

export const authRouter = express.Router();


// Twitter
authRouter.get('/twitter', passport.authenticate('twitter'));

authRouter.get(
  '/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/failure' }),
  authController.sendJWTToken
);



authRouter.get('/authenticate', passport.authenticate('jwt', { session: false }), authController.authenticate);
authRouter.get('/logout', passport.authenticate('jwt', { session: false }), authController.logout);
