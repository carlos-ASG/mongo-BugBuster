const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController'); // Asegúrate de que esta línea sea correcta

const router = express.Router();

// Rutas para la autenticación

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado con éxito
 *       400:
 *         description: Error en los datos del usuario
 */
router.post('/register', authController.registerUser);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario autenticado con éxito
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', authController.loginUser); // Asegúrate de que sea POST

// Ejemplo de una ruta protegida

/**
 * @swagger
 * /auth/task:
 *   get:
 *     summary: Ejemplo de una ruta protegida
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ruta protegida accedida con éxito
 *       401:
 *         description: No autorizado
 */
router.get('/task', verifyToken, (req, res) => {
    res.json({ message: 'Ruta protegida accedida con éxito' });
});

module.exports = router;
