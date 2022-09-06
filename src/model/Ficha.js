import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const pacientsSchema = new Schema ({
   datosPersonal: {
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
      }
   },
   patologico: [{
      tipo: {
         type: String,
         required: true
      }
   }],
   alergia: {
      estado: {
         type: String,
         maxlength: 2
      },
      cuales: {
         type: String
      }
   },
   hemorragia: {
      estado: {
         type: String,
         maxlength: 2
      },
      cuando: {
         type: String
      }
   },
   hospitalizado: {
      estado: {
         type: String,
         maxlength: 2
      },
      motivo: {
         type: String
      }
   },
   embarazo: {
      estado: {
         type: String,
         maxlength: 2
      },
      mes: {
         type: String
      }
   }
}, {
   timestamps: true,
   versionKey: false
});

export default model('Pacientes', pacientsSchema);