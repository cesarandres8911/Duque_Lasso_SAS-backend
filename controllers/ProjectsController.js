
// Sin uso, proximo a eliminar

const express = require('express');
const { authGuard } = require('../middlewares/auth');
const { Proyecto } = require('../models/Proyecto');

const router = express.Router();

router.get('/all', authGuard ,async (request, response) => {
    const page = parseInt(request.query.page);
    const limit = parseInt(request.query.limit);
    const datos = await Proyecto.find({},null,{
                                    sort: { nombre: 1, fecha: -1 },
                                    skip: ((page-1)*limit),
                                    limit: limit
                                })
                                .exec();
    response.json(datos);

});

module.exports = router;