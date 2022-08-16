import passport from 'passport';
import path from 'path';
const __dirname = path.resolve();
import fse from 'fs-extra';
import pdf from 'pdf-creator-node';
import configPDF from '../helpers/options.js';

import moment from 'moment';
moment.locale('es');

import UserModel from '../model/User.js';
import FichaModel from '../model/Ficha.js';
import HistorialModel from '../model/Historial.js';

export const renderLogin = async (req, res) => {
   res.render('login');
};

export const loginAuth = passport.authenticate('local.login', {
   failureRedirect: '/',
   successRedirect: '/w',
   badRequestMessage: 'Credenciales desconocidas!!!',
   failureFlash: true
});

export const register = async (req, res) => {
   const {
      cedula,
      apellidos,
      nombres,
      fechaNacimiento,
      genero,
      direccion,
      telefono,
      email,
      password,
      confPassword,
   } = req.body;

   let cedulaN = cedula.trim(),
      apellidosN = apellidos.trim(),
      nombresN = nombres.trim(),
      fechaNacimientoN = fechaNacimiento.trim(),
      generoN = genero.trim(),
      direccionN = direccion.trim(),
      telefonoN = telefono.trim(),
      emailN = email.trim(),
      passwordN = password.trim(),
      confPasswordN = confPassword.trim();

   if (
      cedulaN === '' ||
      apellidosN === '' ||
      nombresN === '' ||
      fechaNacimientoN === '' ||
      generoN === '' ||
      direccionN === '' ||
      telefonoN === '' ||
      emailN === '' ||
      passwordN === '' ||
      confPasswordN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false',
      });
   } else {
      if (passwordN != confPasswordN) {
         res.json({
            tittle: 'CONTRASEÑAS DIFERENTES',
            description: 'Las contraseñas no coindicen.',
            icon: 'info',
            res: 'false'
         });
      } else {
         try {
            const searchUser = await UserModel.findOne({
               cedula: cedulaN,
            }).lean();

            if (searchUser) {
               res.json({
                  tittle: 'USUARIO EXISTENTE',
                  description: 'El usuario ya se encuentra registrado.',
                  icon: 'info',
                  res: 'false'
               });
            } else {
               const newUser = new UserModel({
                  cedula: cedulaN,
                  apellidos: apellidosN,
                  nombres: nombresN,
                  fechaNacimiento: fechaNacimientoN,
                  genero: generoN,
                  direccion: direccionN,
                  telefono: telefonoN,
                  email: emailN,
                  password: passwordN,
               });

               newUser.password = await newUser.encryptPassword(passwordN);
               const savedUser = await newUser.save();

               if (savedUser) {
                  res.json({
                     tittle: 'USUARIO REGISTRADO',
                     description: 'Se ha registrado con éxito',
                     icon: 'success',
                     res: 'true',
                  });
               } else {
                  res.json({
                     tittle: 'USUARIO NO REGISTRADO',
                     description: 'No se ha podido registrar al usuario',
                     icon: 'info',
                     res: 'false',
                  });
               }
            }
         } catch (e) {
            console.log(e);

            res.json({
               tittle: 'Problemas',
               description: 'Opss! Error 500 x_x. ¡Intentelo más luego!',
               icon: 'error',
               res: 'error',
            });
         }
      }
   }
};

export const renderWelcome = async (req, res) => {
   res.render('welcome');
};

export const renderPacientes = async (req, res) => {
   res.render('pacientes');
};

export const getAllPacients = async (req, res) => {
   let allPacients;

   try {
      allPacients = await FichaModel
         .find()
         .select({
            datosPersonal: 1
         })
         .lean();

      // console.log(allPacients);
      res.json(allPacients);
   } catch (e) {
      console.error(e);
   }
};

export const newFicha = async (req, res) => {
   const {
      cedula,
      apellidos,
      nombres,
      fechaNacimiento,
      genero,
      direccion,
      telefono,
      email,
      antec,
      medi,
      mediCual,
      hemo,
      hemoCuando,
      hospi,
      hospiCuando,
      embarazo,
      mesEmbarazo,
   } = req.body;

   let cedulaN = cedula.trim(),
      apellidosN = apellidos.trim(),
      nombresN = nombres.trim(),
      fechaNacimientoN = fechaNacimiento.trim(),
      generoN = genero.trim(),
      direccionN = direccion.trim(),
      telefonoN = telefono.trim(),
      emailN = email.trim(),
      antecN = antec.trim(),
      mediN = medi.trim(),
      mediCualN = mediCual.trim(),
      hemoN = hemo.trim(),
      hemoCuandoN = hemoCuando.trim(),
      hospiN = hospi.trim(),
      hospiCuandoN = hospiCuando.trim(),
      embarazoN = embarazo.trim(),
      mesEmbarazoN = mesEmbarazo.trim();

   if (
      cedulaN === '' ||
      apellidosN === '' ||
      nombresN === '' ||
      fechaNacimientoN === '' ||
      generoN === '' ||
      direccionN === '' ||
      telefonoN === '' ||
      emailN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false',
      });
   } else {
      try {
         const searchUser = await FichaModel
            .findOne({
               'datosPersonal.cedula': cedulaN
            })
            .lean();
         // console.log(searchUser);

         if (searchUser) {
            res.json({
               tittle: 'FICHA CLÍNICA EXISTENTE',
               description: 'El usuario ya tiene su ficha clínica.',
               icon: 'info',
               res: 'false'
            });
         } else {
            const newPaciente = new FichaModel({
               datosPersonal: {
                  cedula: cedulaN,
                  apellidos: apellidosN,
                  nombres: nombresN,
                  fechaNacimiento: fechaNacimientoN,
                  genero: generoN,
                  direccion: direccionN,
                  telefono: telefonoN,
                  email: emailN,
               },
               patologico: antecN,
               alergia: {
                  estado: mediN,
                  cuales: mediCualN
               },
               hemorragia: {
                  estado: hemoN,
                  cuando: hemoCuandoN
               },
               hospitalizado: {
                  estado: hospiN,
                  motivo: hospiCuandoN
               },
               embarazo: {
                  estado: embarazoN,
                  mes: mesEmbarazoN
               }
            });

            // console.log(newPaciente);
            const savedHistoryClinica = await newPaciente.save();

            if (savedHistoryClinica) {
               res.json({
                  tittle: 'FICHA CLÍNICA GENERADA',
                  description: 'Se ha generado la ficha clínica del usuariocon éxito',
                  icon: 'success',
                  res: 'true',
               });
            } else {
               res.json({
                  tittle: 'FICHA CLÍNICA NO GENERADA',
                  description: 'No se ha podido generar la ficha clínica al usuario',
                  icon: 'info',
                  res: 'false',
               });
            }
         }
      } catch (e) {
         console.log(e);

         res.json({
            tittle: 'Problemas',
            description: 'Opss! Error 500 x_x. ¡Intentelo más luego!',
            icon: 'error',
            res: 'error',
         });
      }
   }
};

export const searchFicha = async (req, res) => {
   const {
      id
   } = req.query;

   let idN = id.trim();

   if (
      idN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false',
      });
   } else {
      try {
         const searchHistory = await FichaModel
            .findOne({
               _id: idN
            })
            .select({
               datosPersonal: 1,
               patologico: 1,
               alergia: 1,
               hemorragia: 1,
               hospitalizado: 1,
               embarazo: 1
            });
         // console.log(searchHistory);

         res.json({
            res: 'data',
            data: searchHistory
         });
      } catch (e) {
         console.log(e);

         res.json({
            tittle: 'Problemas',
            description: 'Opss! Error 500 x_x. ¡Intentelo más luego!',
            icon: 'error',
            res: 'error',
         });
      }
   }
};

export const updateFicha = async (req, res) => {
   const {
      id,
      apellidos,
      nombres,
      fechaNacimiento,
      genero,
      direccion,
      telefono,
      email,
      antec,
      medi,
      mediCual,
      hemo,
      hemoCuando,
      hospi,
      hospiCuando,
      embarazo,
      mesEmbarazo,
   } = req.body;

   let idN = id.trim(),
      apellidosN = apellidos.trim(),
      nombresN = nombres.trim(),
      fechaNacimientoN = fechaNacimiento.trim(),
      generoN = genero.trim(),
      direccionN = direccion.trim(),
      telefonoN = telefono.trim(),
      emailN = email.trim(),
      antecN = antec.trim(),
      mediN = medi.trim(),
      mediCualN = mediCual.trim(),
      hemoN = hemo.trim(),
      hemoCuandoN = hemoCuando.trim(),
      hospiN = hospi.trim(),
      hospiCuandoN = hospiCuando.trim(),
      embarazoN = embarazo.trim(),
      mesEmbarazoN = mesEmbarazo.trim();

   if (
      idN === '' ||
      apellidosN === '' ||
      nombresN === '' ||
      fechaNacimientoN === '' ||
      generoN === '' ||
      direccionN === '' ||
      telefonoN === '' ||
      emailN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false',
      });
   } else {
      try {
         const searchFicha = await FichaModel
            .findOne({
               _id: idN
            })
            .lean();
         console.log(searchFicha);

         if (!searchFicha) {
            res.json({
               tittle: 'FICHA CLÍNICA NO EXISTENTE',
               description: 'La ficha clínica a actualizar no existe.',
               icon: 'info',
               res: 'false'
            });
         } else {
            const updateFicha = await FichaModel
               .updateOne({
                  _id: id
               }, {
                  $set: {
                     'datosPersonal.apellidos': apellidosN,
                     'datosPersonal.nombres': nombresN,
                     'datosPersonal.fechaNacimiento': fechaNacimientoN,
                     'datosPersonal.genero': generoN,
                     'datosPersonal.direccion': direccionN,
                     'datosPersonal.telefono': telefonoN,
                     'datosPersonal.email': emailN,
                     patologico: antecN,
                     'alergia.estado': mediN,
                     'alergia.cuales': mediCualN,
                     'hemorragia.estado': hemoN,
                     'hemorragia.cuando': hemoCuandoN,
                     'hospitalizado.estado': hospiN,
                     'hospitalizado.motivo': hospiCuandoN,
                     'embarazo.estado': embarazoN,
                     'embarazo.mes': mesEmbarazoN
                  }
               });
            console.log(updateFicha);

            if (updateFicha.modifiedCount > 0) {
               res.json({
                  tittle: 'FICHA CLÍNICA ACTUALIZADA',
                  description: 'Se ha actualizado la ficha clínica del usuario con éxito',
                  icon: 'success',
                  res: 'true',
               });
            } else {
               res.json({
                  tittle: 'FICHA CLÍNICA NO ACTUALIZADA',
                  description: 'No se ha podido actualizar la ficha clínica al usuario',
                  icon: 'info',
                  res: 'false',
               });
            }
         }
      } catch (e) {
         console.log(e);

         res.json({
            tittle: 'Problemas',
            description: 'Opss! Error 500 x_x. ¡Intentelo más luego!',
            icon: 'error',
            res: 'error',
         });
      }
   }
};

export const readFicha = async (req, res) => {
   const {
      id
   } = req.query;

   let idN = id.trim();

   if (
      idN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false',
      });
   } else {
      try {
         const searchFicha = await FichaModel
            .findOne({
               _id: idN
            })
            .select({
               datosPersonal: 1,
               patologico: 1,
               alergia: 1,
               hemorragia: 1,
               hospitalizado: 1,
               embarazo: 1
            });

         const searchHistory = await HistorialModel
            .find({
               _IDPacient: idN
            })
            .select({
               fecha: 1,
               tratamiento: 1,
               monto: 1,
               observaciones: 1,
               estado: 1,
            })
            .lean();

         res.json({
            res: 'data',
            data: {
               ficha: searchFicha,
               historial: searchHistory
            }
         });
      } catch (e) {
         console.log(e);

         res.json({
            tittle: 'Problemas',
            description: 'Opss! Error 500 x_x. ¡Intentelo más luego!',
            icon: 'error',
            res: 'error',
         });
      }
   }
};

export const agendarCita = async (req, res) => {
   const {
      id,
      fecha,
      precio,
      tratamiento,
      observaciones,
   } = req.body;

   let idN = id.trim(),
      fechaN = fecha.trim(),
      precioN = precio.trim(),
      tratamientoN = tratamiento.trim(),
      observacionesN = observaciones.trim();

   if (
      idN === '' ||
      fechaN === '' ||
      precioN === '' ||
      tratamientoN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false',
      });
   } else {
      try {
         const searchCita = await HistorialModel
            .find({
               _IDPacient: idN,
               fecha: moment(fechaN).format('L')
            })
            .lean();
         console.log(searchCita.length);

         if (searchCita.length > 0) {
            res.json({
               tittle: 'CITA YA SEPARADA',
               description: `El paciente tiene una cita para el dia <b>${moment(fechaN).format('ll')}</b>.`,
               icon: 'info',
               res: 'false'
            });
         } else {
            const newCita = new HistorialModel({
               _IDPacient: idN,
               _IDUser: req.user.id,
               fecha: moment(fechaN).format('L'),
               tratamiento: tratamientoN,
               monto: precioN,
               observaciones: observacionesN,
               estado: 'Pendiente',
            });

            // console.log(newPaciente);
            const savedCita = await newCita.save();

            if (savedCita) {
               res.json({
                  tittle: 'CITA SEPARADA',
                  description: `Se ha separado la cita con éxito para el <b>${moment(fechaN).format('ll')}</b>.`,
                  icon: 'success',
                  res: 'true',
               });
            } else {
               res.json({
                  tittle: 'CITA NO SEPARADA',
                  description: 'No se ha podido separar la cita al paciente',
                  icon: 'info',
                  res: 'false',
               });
            }
         }
      } catch (e) {
         console.log(e);

         res.json({
            tittle: 'Problemas',
            description: 'Opss! Error 500 x_x. ¡Intentelo más luego!',
            icon: 'error',
            res: 'error',
         });
      }
   }
};

export const renderCitas = async (req, res) => {
   res.render('citas');
};

export const getAllCitas = async (req, res) => {
   let allCitas;

   try {
      allCitas = await HistorialModel
         .find({
            // fecha: moment().format('L')
         })
         .select({
            _IDPacient: 1,
            fecha: 1,
            tratamiento: 1,
            monto: 1,
            observaciones: 1,
            estado: 1,
         })
         .populate({
            path: '_IDPacient',
            select: '_id datosPersonal.cedula datosPersonal.nombres datosPersonal.apellidos'
         })
         .sort({
            fecha: 1,
            estado: 1,
         })
         .lean();

      // console.log(allCitas);
      res.json(allCitas);
   } catch (e) {
      console.error(e);
   }
};

export const searchCita = async (req, res) => {
   const {
      id
   } = req.query;

   let idN = id.trim();

   if (
      idN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false',
      });
   } else {
      try {
         const searchCita = await HistorialModel
            .findOne({
               _id: idN
            });
         // console.log(searchCita);

         if (searchCita) {
            const searchHistory = await HistorialModel
               .findOne({
                  _id: idN
               })
               .select({
                  fecha: 1,
                  tratamiento: 1,
                  monto: 1,
                  observaciones: 1,
                  estado: 1
               });
            // console.log(searchHistory);

            res.json({
               res: 'data',
               data: searchHistory
            });
         } else {
            res.json({
               tittle: 'Cita no registrada',
               description: 'La cita a editar no se encuentra registrada!',
               icon: 'warning',
               res: 'false',
            });
         }
      } catch (e) {
         console.log(e);

         res.json({
            tittle: 'Problemas',
            description: 'Opss! Error 500 x_x. ¡Intentelo más luego!',
            icon: 'error',
            res: 'error',
         });
      }
   }
};

export const updateCita = async (req, res) => {
   const {
      idP,
      idC,
      fecha,
      precio,
      tratamiento,
      observaciones,
      estado
   } = req.body;

   let idPN = idP.trim(),
      idCN = idC.trim(),
      fechaN = fecha.trim(),
      precioN = precio.trim(),
      tratamientoN = tratamiento.trim(),
      observacionesN = observaciones.trim(),
      estadoN = estado.trim();

   if (
      idPN === '' ||
      idCN === '' ||
      fechaN === '' ||
      precioN === '' ||
      tratamientoN === '' ||
      observacionesN === '' ||
      estadoN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false',
      });
   } else {
      try {
         const searchCita = await HistorialModel
            .findOne({
               _id: idCN,
               _IDPacient: idPN
            });
         // console.log(searchCita);

         if (searchCita) {
            const updateCita = await HistorialModel
               .updateOne({
                  _id: idCN,
                  _IDPacient: idPN
               }, {
                  $set: {
                     _IDUser: req.user.id,
                     fecha: moment(fechaN).format('L'),
                     tratamiento: tratamientoN,
                     monto: precioN,
                     observaciones: observacionesN,
                     estado: estadoN
                  }
               });

            if (updateCita.modifiedCount > 0) {
               res.json({
                  tittle: 'Cita actulizada',
                  description: 'La cita ha sido actualizada con éxito!',
                  icon: 'success',
                  res: 'true',
               });
            } else {
               res.json({
                  tittle: 'Cita no actualizada',
                  description: 'No se ha podido actualizar la cita!',
                  icon: 'error',
                  res: 'false',
               });
            }
         } else {
            res.json({
               tittle: 'Cita no encontrada',
               description: 'La cita a actualizar no ha sido encontrada!',
               icon: 'warning',
               res: 'false',
            });
         }
      } catch (e) {
         console.log(e);

         res.json({
            tittle: 'Problemas',
            description: 'Opss! Error 500 x_x. ¡Intentelo más luego!',
            icon: 'error',
            res: 'error',
         });
      }
   }
};

export const generateFichaPDF = async (req, res) => {
   const {
      idP
   } = req.query;

   let idPN = idP.trim();

   if (
      idPN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false'
      });
   } else {   
      try {
         const searchPaciente = await FichaModel
            .findOne({
               _id: idPN
            })
            .select({
               datosPersonal: 1,
               patologico: 1,
               alergia: 1,
               hemorragia: 1,
               hospitalizado: 1,
               embarazo: 1
            })
            .lean();

         if (!searchPaciente) {
            res.json({
               tittle: 'Ficha no encontrada',
               description: 'La ficha a generar no existe!!!',
               icon: 'info',
               res: 'false'
            });
         } else {
            const searchHistory = await HistorialModel
               .find({
                  _IDPacient: idPN
               })
               .select({
                  fecha: 1,
                  tratamiento: 1,
                  monto: 1,
                  observaciones: 1,
                  estado: 1,
               })
               .lean();

            if (!searchHistory) {
               res.json({
                  tittle: 'Ficha no encontrada',
                  description: 'La ficha a generar no existe!!!',
                  icon: 'info',
                  res: 'false'
               });
            } else {
               const paramsHTML = {
                  userDate: `${req.user.nombres} ${req.user.apellidos}`,
                  cedula: searchPaciente.datosPersonal.cedula,
                  nombres: searchPaciente.datosPersonal.nombres,
                  apellidos: searchPaciente.datosPersonal.apellidos,
                  fechaNacimiento: moment(searchPaciente.datosPersonal.fechaNacimiento).format('ll'),
                  genero: searchPaciente.datosPersonal.genero,
                  direccion: searchPaciente.datosPersonal.direccion,
                  telefono: searchPaciente.datosPersonal.telefono,
                  email: searchPaciente.datosPersonal.email,
                  patologico: searchPaciente.patologico,
                  alergiaEst: searchPaciente.alergia.estado,
                  alergiaCua: searchPaciente.alergia.cuales,
                  hemorragiaEst: searchPaciente.hemorragia.estado,
                  hemorragiaCua: searchPaciente.hemorragia.cuando,
                  hospitalizadoEst: searchPaciente.hospitalizado.estado,
                  hospitalizadoCua: searchPaciente.hospitalizado.motivo,
                  embarazoEst: searchPaciente.embarazo.estado,
                  embarazoCua: searchPaciente.embarazo.mes,
                  searchHistory
               };

               const html = fse.readFileSync(path.join(__dirname, '/src/template/ficha.html'), 'utf-8');
               const filename = 'Ficha Medica - ' + searchPaciente.datosPersonal.cedula + '.pdf';

               const document = {
                  html: html,
                  data: {
                     paramsHTML
                  },
                  path: path.join(__dirname, '/src/docs/') + filename
               };

               let data;
                  
               try {
                  data = await pdf.create(document, configPDF);
                  path.join(__dirname, '/src/docs/' + filename);
                  // console.log(data);
               } catch (e) {
                  console.log(e);
               }
                  
               if (data) {
                  res.json({
                     tittle: 'Ficha generada',
                     description: 'Se ha generado la ficha con éxito!!!',
                     icon: 'success',
                     res: 'true',
                     filename
                  });
               } else {
                  res.json({
                     tittle: 'Ficha no generada',
                     description: 'Opss! No se podido generar la ficha. ¡Intentelo más luego!',
                     icon: 'error',
                     res: 'false'
                  });
               }
            }
         }
      } catch (e) {
         console.log(e);

         res.json({
            tittle: 'Problemas',
            description: 'Opss! Error 500 x_x. ¡Intentelo más luego!',
            icon: 'error',
            res: 'error'
         });
      }
   }
};

export const viewPDF = async (req, res) => {
   const {
      file
   } = req.params;

   res.render('pdf', { file });
};

export const renderProfile = async (req, res) => {
   const {
      cedula,
      apellidos,
      nombres,
      fechaNacimiento,
      genero,
      direccion,
      telefono,
      email
   } = req.user;
   
   res.render('profile', {
      cedula,
      apellidos,
      nombres,
      fechaNacimiento,
      genero,
      direccion,
      telefono,
      email
   });
};

export const updateProfile = async (req, res) => {
   const {
      cedula,
      apellidos,
      nombres,
      fechaNacimiento,
      genero,
      direccion,
      telefono,
      email
   } = req.body;

   let cedulaN = cedula.trim(),
      apellidosN = apellidos.trim(),
      nombresN = nombres.trim(),
      fechaNacimientoN = fechaNacimiento.trim(),
      generoN = genero.trim(),
      direccionN = direccion.trim(),
      telefonoN = telefono.trim(),
      emailN = email.trim();

   if (
      cedulaN === '' ||
      apellidosN === '' ||
      nombresN === '' ||
      fechaNacimientoN === '' ||
      generoN === '' ||
      direccionN === '' ||
      telefonoN === '' ||
      emailN === ''
   ) {
      res.json({
         tittle: 'Campos Vacíos',
         description: 'Los campos no pueden ir vacíos o con espacios!',
         icon: 'warning',
         res: 'false',
      });
   } else {
      try {
         const searchUser = await UserModel
            .findOne({
               cedula: req.user.cedula,
            }).lean();

         if (!searchUser) {
            res.json({
               tittle: 'USUARIO NO EXISTENTE',
               description: 'No te encuentras registrado en el sistema.',
               icon: 'error',
               res: 'false'
            });
         } else {
            const updateUser = await UserModel
               .updateOne({
                  cedula: cedulaN
               }, {
                  cedula: cedulaN,
                  apellidos: apellidosN,
                  nombres: nombresN,
                  fechaNacimiento: fechaNacimientoN,
                  genero: generoN,
                  direccion: direccionN,
                  telefono: telefonoN,
                  email: emailN
               });

            if (updateUser.modifiedCount > 0) {
               res.json({
                  tittle: 'DATOS ACTUALIZADOS',
                  description: 'Has actualizado los datos con éxito',
                  icon: 'success',
                  res: 'true',
               });
            } else {
               res.json({
                  tittle: 'DATOS NO ACTUALIZADOS',
                  description: 'No se ha podido actualizar tus datos',
                  icon: 'info',
                  res: 'false',
               });
            }
         }
      } catch (e) {
         console.log(e);

         res.json({
            tittle: 'Problemas',
            description: 'Opss! Error 500 x_x. ¡Intentelo más luego!',
            icon: 'error',
            res: 'error',
         });
      }
   }
};

export const logout = (req, res, next) => {
   req.logout(req.user, err => {
      if(err) return next(err);
      req.flash('warning_msg', 'Sesión cerrada. Vuelva pronto...');
      res.redirect('/');
   });
};
