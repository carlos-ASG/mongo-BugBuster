const express = require('express');
const mongoose = require('mongoose')
require('dotenv').config();
const taskRouters = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Tareas',
      version: '1.0.0',
      description: 'API para gestionar tareas\n'+
      '- Alumnos:\n' +
      '- Christian Isabel López Cantabrana\n'+
      '- Carlos Alberto Sandoval Guardado\n'+
      '- José De Jesus Robles Perez\n'+
      '- Adolfo Ramirez Garcia\n' +
      '- Repositorios\n\n' + 
      '- Firebase\n'+
      '- https://github.com/carlos-ASG/firebase-BugBusters.git\n\n' +
      '- MongoDB\n' +
      '- https://github.com/carlos-ASG/mongo-BugBuster.git'

    },
    components: {
      securitySchemes: {
          bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
          }
      }
    },
    security: [{ bearerAuth: [] }],
    servers: [
      {
        url: '/'
      }
    ]
  },
  apis: ['./routes/taskRoutes.js','./routes/authRoutes.js']
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/task',taskRouters);
app.get('/', (req, res) => {
    res.send('API de Tareas en funcionamiento. Visita /api-docs para la documentación.');
});
app.use(express.json());  // Para manejar las solicitudes JSON

app.use('/task', taskRouters);
app.use('/auth', authRoutes);

app.use(cors());



//MONGO CONEXION
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.error(error));

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Ocurrió un error en el servidor' });
});

app.listen(PORT, () => {
  console.log(`servidor corriendo en puerto ${PORT}`)
});
