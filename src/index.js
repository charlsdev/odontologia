import 'dotenv/config';
import './dev.js';
import './database.js';

import app from './server.js';

app.listen(app.get('port'), () => {
   console.log(
      `[${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}] - Servidor en el puerto ${app.get('port')}`
   );
});