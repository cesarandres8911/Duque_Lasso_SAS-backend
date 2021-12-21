const { Usuario } = require("../models/Usuario");
const { sign, verify } = require("jsonwebtoken");


const getTokenPair = async (user) => {
  const accessToken = await sign(
    {
      user: { _id: user._id, rol: user.rol, user: user.email },
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '1d' }
  );

  const refreshToken = await sign(
    { user: { _id: user._id, user: user.email } },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  const datosUser = {
    id: user._id,
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    telefono: user.telefono,
    rol: user.rol,
    imagen: user.imagen

  }

  return { refreshToken, accessToken, datosUser };
};

const validarUsuario = async (loginData) => {
  const usr = await Usuario.findOne({ email: loginData.username });

  if (!usr) throw new Error('Nombre de usuario o contraseña incorrecta.');

  console.log('Validando login...');
  const passwordMatch = await usr.compararPasswords(loginData.password);

  if (!passwordMatch) throw new Error('Nombre de usuario o contraseña incorrecta.');

  return await getTokenPair(usr);
}

// desencriptar el token
const desencriptarToken = (token) => {
  try {
    const tokenSplit = token.split(' ')[1];
    return decoded = verify(tokenSplit, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    console.log(error);
    return false;
  }

}

// Token para recuperar contraseña
const getTokenRecovery = async (user) => {
  const recoveryToken = await sign(
    {
      user: { _id: user._id, rol: user.rol, user: user.email },
    },
    process.env.JWT_RECOVERY_SECRET,
    // expira en 1 hora
    { expiresIn: '1h' }
  );

  return recoveryToken;
};
// Verificar que el token sea valido
const verificarToken = async (token) => {
  try {
    const tokenSplit = token;
    const decoded = verify(tokenSplit, process.env.JWT_RECOVERY_SECRET);
    return decoded;
  } catch (error) {
    console.log(error);
    return false;
  }

};

exports.validarUsuario = validarUsuario;
exports.getTokenPair = getTokenPair;
exports.desencriptarToken = desencriptarToken;
exports.getTokenRecovery = getTokenRecovery;
exports.verificarToken = verificarToken;