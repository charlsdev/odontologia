export const isAuthenticated = (req, res, next) => {
   if (req.isAuthenticated()) {
      return next();
   }
   req.flash('warning_msg', 'No estas autorizado. Inicia sesión.');
   res.redirect('/');
};

export const isNotAuthenticated = (req, res, next) => {
   if (!req.isAuthenticated()) {
      return next();
   }
   res.redirect('/welcome');
};