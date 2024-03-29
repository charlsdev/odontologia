import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const historialSchema = new Schema ({
   _IDPacient: {
      type: Schema.Types.ObjectId,
      ref: 'Pacientes'
   },
   _IDUser: {
      type: Schema.Types.ObjectId,
      ref: 'Usuarios'
   },
   fecha: {
      type: String,
      required: true
   },
   tratamiento: {
      type: String,
      // required: true
   },
   monto: {
      type: String,
      // required: true
   },
   observaciones: {
      type: String,
      // required: true
   },
   estado: {
      type: String,
      required: true
      // Pendiente -- Culminado
   }
}, {
   timestamps: true,
   versionKey: false
});

export default model('Citas', historialSchema);