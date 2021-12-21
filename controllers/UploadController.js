const express = require('express');
const { authGuard } = require('../middlewares/auth');
const router = express.Router();
const { multer } = require('../middlewares/multer');

// Subir imagenes al servidor
router.post('/', authGuard, multer, (request, response) => {
    console.log("Entrando a subir imagen...");
    
    response.send({message: 'Imagen subida correctamente.',filename: request.file.filename});
});




module.exports = router;