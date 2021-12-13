const { verify } = require('jsonwebtoken');

exports.authGuard = (request, response, next) => {
    console.log("Entrando a middleware auth...");

    const authorization = request.headers.authorization;
    if (!authorization) {
        console.log('No hay encabezado de authorization')
        response.status(401).send({message:'Usted no tiene permisos para acceder a esta acción.'});
    }else {
        try {
            const token = authorization.split(' ')[1];
            const tokenData = verify(token, process.env.JWT_ACCESS_SECRET);
            request.jwtData = tokenData;
            return next();
        }catch (e) {
            console.log('Error en middleware de autenticación: ');
            console.log(e);
            response.status(401).send({message:'Usted no tiene permisos para acceder a esta acción.'});
        }

    }
}