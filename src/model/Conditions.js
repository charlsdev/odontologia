import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const conditionsSchema = new Schema ({
   _cedUser: {
      type: Schema.Types.ObjectId,
      ref: 'Usuarios'
   },
   patologico: [{
      tipo: {
         type: String
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

export default model('Condiciones', conditionsSchema);