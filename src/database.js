import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
   .then((db) => 
      console.log(`DB is connect to ${db.connection.host} - ${db.connection.name}...`)
   )
   .catch((err) => 
      console.log(err)
   );