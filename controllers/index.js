const ProjectsController = require('./ProjectsController');
const UsersController = require('./UserController')
const CultivoControllers = require('./CultivoController')
const PredioController = require('./PredioController');

exports.registrarControladores = (app) => {
    //Proteger endpoints de todo el controlador.
    //app.use('/projects/', authGuard, ProjectsController);
    app.use('/projects/', ProjectsController);
    app.use('/users/', UsersController);
    app.use('/cultivos/', CultivoControllers);
    app.use('/predios/', PredioController);
}