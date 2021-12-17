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
            if (e.name) {
                if (e.name == "TokenExpiredError") {
                    console.log("El token ha expirado.");
                    response.status(401).send({message:'Su session ha expirado. Por favor vuelva a iniciar sesión.', error: e.name});
                }else {
                    console.log("Error al verificar el token.");
                    response.status(401).send({message:'Usted no tiene permisos para acceder a esta acción.'});
                }

            }

        }

    }
}