const mongoose = require('mongoose');

const conectarAMongoDB = async () => {
    try {
        console.log('Conectando a MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.log('Error al conectar MongoDB: ', error);
    }
}

const cerrarMongoDB = async () => {
    if (mongoose.connection){
        try {
            console.log('Desconectando de MongoDB...');
            await mongoose.connection.close();
            console.log('Desconectado de MongoDB');
        } catch (error) {
            console.log('Error al desconectar MongoDB: ', error);
        }
    }
    
}

const subscribirCerrar = async () => {
    process.on('exit', cerrarMongoDB);
    process.on('SIGINT', cerrarMongoDB);
    process.on('SIGTERM', cerrarMongoDB);
    process.on('SIGKILL', cerrarMongoDB);
    process.on('uncaughtException', cerrarMongoDB);

}
exports.conectarAMongoDB = conectarAMongoDB;
exports.cerrarMongoDB = cerrarMongoDB;
exports.subscribirCerrar = subscribirCerrar;