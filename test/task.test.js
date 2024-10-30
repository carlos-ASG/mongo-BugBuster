// Imports de las librerías a usar
const request = require('supertest');
const chai = require('chai');
const sinon = require('sinon');

const app = require('../index'); // Asegúrate de que esta línea sea correcta
const taskService = require('../controllers/taskController'); // Ajusta la ruta según tu estructura

const expect = chai.expect;

//#region Escenarios de prueba del CRUD

// Test de GET /tasks
describe('GET /task/', () => {
  
  it('1. Debería devolver todas las tareas con status 200 cuando hay tareas', async () => {
    const mockTasks = [
      { id: 1, title: "Tarea 1", description: "Descripción de la Tarea 1", completed: false, createdAt: new Date().toISOString() },
      { id: 2, title: "Tarea 2", description: "Descripción de la Tarea 2", completed: false, createdAt: new Date().toISOString() },
    ];
  
    const res1 = await request(app).
      post('/auth/login')
      .send({username: "sandoval", password:"12345"});

      token = res1.body.token;
// console.log(token)
    // Enviar el token en el encabezado Authorization
    const res = await request(app)
      .get('/task')
      .set('Authorization', `Bearer ${token}`);  // Incluir el token
// console.log(res.body)
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.property("title");
    expect(res.body).to.have.property("description");
    expect(res.body).to.have.property("completed");
    expect(res.body).to.have.property("createdAt");

    await taskService.getAllTasks.restore(); // Restaura el stub después de la prueba
  });
});
// Prueba #2 Get de una tarea por ID
describe('GET /task/get', () => {
  it('2. Debería devolver un estado 200 cuando hay una tarea con el ID 1', async () => {
    const mockTask = {
    id: 'IAq3NKYuGslAGr7XFjN1',
    title: 'pruebaToken2',
    description: 'Descripción de la tarea',
    completed: false,
    createdAt: 'alba'
    };

    // Autenticación y obtención del token
    const res1 = await request(app)
      .post('/auth/login')
      .send({ username: "sandoval", password: "12345" });

    token = res1.body.token;

    // Solicitud para obtener la tarea con el ID 1
    const res = await request(app)
      .get('/task/get') // Cambia la ruta para incluir el ID específico
      .set('Authorization', `Bearer ${token}`)
      .send(mockTask);
      

    // Verificaciones de la respuesta
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object'); // Cambiado a objeto en lugar de array
    expect(res.body).to.have.property("title", mockTask.title);
    expect(res.body).to.have.property("description", mockTask.description);
    expect(res.body).to.have.property("completed", mockTask.completed);
    expect(res.body).to.have.property("createdAt");
    

    // Elimina o comenta la siguiente línea si no estás usando stubs
    await taskService.getTaskById.restore();
  });
});


// Prueba #3 Post de una tarea
describe('POST /task/', () => {
  it('3. Debería devolver un estado 200 cuando se agrega una tarea', async () => {
    const newTask = {
      title: "tarea de prueba",
      description: "tarea creada desde el entorno de prueba de mocha",
      completed: false,
      createdAt: new Date().toISOString()
    };

    // Primero obtenemos el token de autenticación
    const res1 = await request(app)
      .post('/auth/login')
      .send({ username: "sandoval", password: "12345" });

     token = res1.body.token;

    // Ahora enviamos la solicitud POST con los datos de newTask y el token en los headers
    const res = await request(app)
      .post('/task')
      .set('Authorization', `Bearer ${token}`)
      .send(newTask); // Enviamos newTask en el cuerpo de la solicitud

    // Verificamos el estado y las propiedades de la respuesta
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property("title", newTask.name);
    expect(res.body).to.have.property("description", newTask.description);
    expect(res.body).to.have.property("completed", newTask.completed);
    expect(res.body).to.have.property("createdAt");

    // Si usas Sinon y tienes un stub, recuerda restaurarlo aquí. Si no, puedes omitir esta línea.
     await taskService.createTask.restore();
  });
});


// Prueba #4 Put de una tarea
describe('PUT /task/update', () => {
  it('4. Debería devolver un estado 201 cuando se edita una tarea', async () => {
    const editedTask = {
      id: "sfbcp0lxyCcEsTJM4oHM",
      title: "tarea de prueba -- Editado",
      description: "tarea creado desde el entorno de prueba de mocha -- Editado",
      completed: false, // Campo agregado
      createdAt: new Date().toISOString() // Campo de fecha de creación
    };
 
    const res1 = await request(app).
      post('/auth/login')
      .send({username: "sandoval", password:"12345"});


      token = res1.body.token;

      const res = await request(app)
      .put('/task/update')
      .set('Authorization', `Bearer ${token}`)
      .send(editedTask); // Enviamos editedTask en el cuerpo de la solicitud

      // Verificaciones de la respuesta
      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object'); // Cambiado a objeto si responde con la tarea actualizada
      expect(res.body).to.have.property("title", editedTask.name);
      expect(res.body).to.have.property("description", editedTask.description);
      expect(res.body).to.have.property("completed", editedTask.completed);
      expect(res.body).to.have.property("createdAt");
      expect(res.body).to.have.property("id", editedTask.id);

    await taskService.updateTask.restore(); // Restaura el stub después de la prueba
  });
});

// Prueba #5 Delete de una tarea
describe('DELETE /task/:id', () => {
  it('5. Debería devolver un estado 200 cuando se elimina una tarea', async () => {

   const deletetask = {
      id: 'sfbcp0lxyCcEsTJM4oHM',
   }
    const res1 = await request(app).
    post('/auth/login')
    .send({username: "sandoval", password:"12345"});


    token = res1.body.token;

    const res = await request(app)
      .delete('/task/:id')
      .set('Authorization', `Bearer ${token}`)
      .send(deletetask); // Enviamos newTask en el cuerpo de la solicitud

    // Verificamos el estado y las propiedades de la respuesta
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property("id", deletetask.id);

    await taskService.deleteTask.restore(); // Restaura el stub después de la prueba
  });
});

// //#endregion
