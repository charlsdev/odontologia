import UserModel from '../model/User.js';

export const login = async (req, res) => {
   res.render('login');
};

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
