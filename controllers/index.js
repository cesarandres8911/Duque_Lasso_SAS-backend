const UsersController = require('./UserController')
const CultivoControllers = require('./CultivoController')
const PredioController = require('./PredioController');
const ParametroController = require('./ParametroController');

exports.registrarControladores = (app) => {
    
    app.use('/users/', UsersController);
    app.use('/cultivos/', CultivoControllers);
    app.use('/predios/', PredioController);
    app.use('/parametros/', ParametroController);
}