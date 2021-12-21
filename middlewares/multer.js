const multer = require('multer');
const path = require('path');

exports.multer =(request, response, next) => {
    
    console.log("Entrando a middleware multer...");
    const storage = multer.diskStorage({
        
        destination: path.join(__dirname, '../public/imagenes/uploads'),
        // destination: (request, file, callback) => {
        //     callback(null, './public/images/predios');
        // },
        filename: (request, file, callback) => {
            callback(null, Date.now() +'-'+ file.originalname.split(' ').join('-'));
        }
    });
    
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 1000000
        },
        fileFilter: (request, file, callback) => {
            if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
                callback(null, true);
            }else {
                callback(null, false);
                return response.status(400).send({message: 'Solo se aceptan imagenes con formato png, jpg o jpeg.'});
            }
        }
    });
    
    upload.single('imagen')(request, response, (error) => {
        if (error) {
            return response.status(400).send({message: 'Error al subir imagen.'});
        }else {
            next();
        }
    });
}