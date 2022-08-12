import passport from 'passport';

import UserModel from '../model/User.js';
import PacientsModel from '../model/Pacientes.js';
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
      allPacients = await PacientsModel
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

export const newHistory = async (req, res) => {
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
         const searchUser = await PacientsModel
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
            const newPaciente = new PacientsModel({
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









export const logout = (req, res, next) => {
   req.logout(req.user, err => {
      if(err) return next(err);
      req.flash('warning_msg', 'Sesión cerrada. Vuelva pronto...');
      res.redirect('/');
   });
};
