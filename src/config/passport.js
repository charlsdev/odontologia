import passport from 'passport';
import { Strategy } from 'passport-local';

import UsersModel from '../model/User.js';

passport.use('local.login', new Strategy({
   usernameField: 'username',
   passwordField: 'password',
   passReqToCallback: true,
   // session: false
}, async (req, cedula, password, done) => {
   const user = await UsersModel
      .findOne({
         cedula
      });
   
   if (!user) {
      return done(null, false, { message: 'Usuario y/o contraseña incorrectas...'});
   } else {
      const passLog = await user.matchPassword(password);

      if (passLog) {
         return done(null, user);
      } else {
         return done(null, false, { message: 'Usuario y/o contraseña incorrectas...'});
      }
   }
}));

passport
   .serializeUser((user, done) => {
      done(null, user.id);
   });

passport
   .deserializeUser(async (id, done) => {
      await UsersModel
         .findById(id, (err, user) => {
            done(err, user);
         })
         .clone();
   });