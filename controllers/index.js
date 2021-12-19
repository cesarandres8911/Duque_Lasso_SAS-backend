const UsersController = require('./UserController')
const CultivoControllers = require('./CultivoController')
const PredioController = require('./PredioController');
const ParametroController = require('./ParametroController');
const PermitirController = require('./PermitirController');

exports.registrarControladores = (app) => {
    
    app.use('/users/', UsersController);
    app.use('/cultivos/', CultivoControllers);
    app.use('/predios/', PredioController);
    app.use('/parametros/', ParametroController);
    app.use('/permisos/', PermitirController);
}