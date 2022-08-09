import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import bcryptjs from 'bcryptjs';
const { genSalt, hash, compare } = bcryptjs;

const usersSchema = new Schema({
   cedula: {
      type: String,
      required: true,
      unique: true
   },
   apellidos: {
      type: String,
      required: true
   },
   nombres: {
      type: String,
      required: true
   },
   fechaNacimiento: {
      type: String,
      required: true
   },
   genero: {
      type: String,
      required: true
   },
   direccion: {
      type: String,
      required: true
   },
   telefono: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   }
}, {
   timestamps: true,
   versionKey: false
});

usersSchema.methods.encryptPassword = async password => {
   const salt = await genSalt(10);
   return await hash(password, salt);
};

usersSchema.methods.matchPassword = async function(password) {
   return await compare(password, this.password);
};

export default model('Usuarios', usersSchema);