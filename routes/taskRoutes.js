const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { verifyToken } = require('../middlewares/authMiddleware');  // Importar el middleware de autenticación

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Obtiene todas las tareas
 *     tags: [Tasks]
 *     security:  # Aquí se indica que esta ruta requiere autenticación
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tareas obtenida con éxito
 *       500:
 *         description: Error en el servidor
 */
router.get('/', verifyToken, async (req, res) => {
    try {
        const tasks = await taskController.getAllTasks();
        console.log(tasks);
        return res.status(200).json(tasks);
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        return res.status(500).json({ message: "Error al obtener tareas" });
    }
});

/**
 * @swagger
 * /task:
 *   post:
 *     summary: Crea una nueva tarea
 *     tags: [Tasks]
 *     security:  # Aquí también se indica que esta ruta requiere autenticación
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Tarea creada con éxito
 *       400:
 *         description: Error al crear la tarea
 */
router.post('/', verifyToken, async (req, res) => {
    console.log('Datos de la tarea:', req.body);
    const { title, description, completed, createdAt } = req.body;

    console.log('Datos de la tarea:', req.body);

    try {
        // Llama al controlador para crear la tarea
        const newTask = await taskController.createTask(title, description, completed, createdAt);
        console.log("Resultado de Nueva tarea:", newTask);

        // Maneja la respuesta del controlador
        if (newTask.hasOwnProperty('message')) {
            return res.status(400).json(newTask);
        } else {
            return res.status(201).json(newTask);  // Cambiado a 201 para indicar creación exitosa
        }
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        return res.status(500).json({ message: 'Error al insertar los datos' });
    }
});

/**
 * @swagger
 * /task/{id}:
 *   get:
 *     summary: Obtiene una tarea por su ID
 *     tags: [Tasks]
 *     security:  # También se indica que esta ruta requiere autenticación
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Tarea obtenida con éxito
 *       404:
 *         description: Tarea no encontrada
 */
router.get('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const task = await taskController.getTaskById(id);
        if (task) {
            res.status(200).json(task);
        } else {
            res.status(404).json({ code: 404, message: 'Task not found' });
        }
    } catch (error) {
        console.error('Error al obtener tarea:', error);
        res.status(500).json({ message: 'Error al obtener la tarea' });
    }
});

/**
 * @swagger
 * /task/update:
 *   put:
 *     summary: Actualiza una tarea existente
 *     tags: [Tasks]
 *     security:  # También se indica que esta ruta requiere autenticación
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tarea actualizada con éxito
 *       400:
 *         description: Error al actualizar la tarea
 */
router.put('/update', verifyToken, async (req, res) => {
    const { id} = req.body;
    const { title, description, completed,createdAt } = req.body;

    try {
        const taskUpdated = await taskController.updateTask(id, title, description, completed,createdAt);
        if (taskUpdated['code'] === 200) {
            res.status(200).json(taskUpdated);
        } else {
            res.status(400).json(taskUpdated);
        }
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        res.status(500).json({ message: 'Error al actualizar la tarea' });
    }
});

/**
 * @swagger
 * /task/{id}:
 *   delete:
 *     summary: Elimina una tarea
 *     tags: [Tasks]
 *     security:  # También se indica que esta ruta requiere autenticación
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la tarea a eliminar
 *     responses:
 *       200:
 *         description: Tarea eliminada con éxito
 *       400:
 *         description: Error al eliminar la tarea
 */
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const message = await taskController.deleteTask(id);
        if (message['code'] === 200) {
            res.status(200).json(message);
        } else {
            res.status(400).json(message);
        }
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        res.status(500).json({ message: 'Error al eliminar la tarea' });
    }
});

module.exports = router;
