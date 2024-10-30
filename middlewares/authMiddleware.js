const jwt = require('jsonwebtoken');
const JWT_SECRET = 'tilinEsGrande69';  // Usa una clave secreta fuerte

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];  // Busca el encabezado Authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Token es requerido en el formato Bearer <token>' });
    }

    const token = authHeader.split(' ')[1];  // Extrae el token después de "Bearer"

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;  // Añadir los datos del usuario decodificados a la solicitud

        next();  // Continúa hacia la siguiente función en la ruta
    } catch (error) {
        // Si el token es inválido o ha expirado
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

module.exports = { verifyToken };
