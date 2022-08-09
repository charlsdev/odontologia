import express from 'express';
import { engine } from 'express-handlebars';
import morgan from 'morgan';
import cors from 'cors';
import resTime from 'response-time';
import flash from 'connect-flash';
import session from 'express-session';
import passport from 'passport';
import StoreMongo from 'connect-mongo';
import path from 'path';
const __dirname = path.resolve();

import helpers from './helpers/hbs.js';
import indexRoutes from './routes/index.routes.js';

const app = express();
import './config/passport.js';

app.set('port', process.env.PORT);

app.set('views', path.join(__dirname, '/src/views'));
app.engine('.hbs', engine({
   extname: '.hbs',
   layoutsDir: path.join(app.get('views'), 'layouts'),
   partialsDir: path.join(app.get('views'), 'partials'),
   helpers,
   defaultLayout: 'main'
}));
app.set('view engine', '.hbs');

app.use(cors());
app.use(resTime());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
   secret: process.env.SESSION_KEY,
   cookie: {
      maxAge: 60000 * 60 * 24,
      secure: false
   },
   resave: true,
   saveUninitialized: true,
   name: 'sessionUser',
   store: StoreMongo.create({
      mongoUrl: process.env.MONGO_URL,
      dbName: 'sessionUser',
      autoRemove: 'interval',
      autoRemoveInterval: 59
   }),
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.warning_msg = req.flash('warning_msg');
   res.locals.info_msg = req.flash('info_msg');
   res.locals.error = req.flash('error');
   res.locals.user = req.user || null;
   next();
});

app.use('/', indexRoutes);

app.use(express.static(path.join(__dirname + '/src/public')));

export default app;