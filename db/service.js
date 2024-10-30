const db = require('./db')

const getAllTasks = async () => {
    const tasks = await db.find();

    return tasks;
}

const createTask = async (title, description,completed,createdAt) => {
    try{
        const newTask = db({title, description,completed,createdAt});
        await newTask.save();

        return newTask;
    }catch{
        return {
            message: 'Error al insertar los datos'
        };
    }
}

const getTaskById = async (id) => {
    try{
        const query = await db.findById(id);

        return query
    }catch{
        return null
    }
}

const updateTask = async (id,title, description, completed,createdAt) => {
    console.log(id,title, description, completed,createdAt)
    try{
        const task = await db.findByIdAndUpdate(
            id,
            { title, description, completed,createdAt },
            { new: true }
          );
        

        return {
            code: 200,
            data: 'Actualizacion hecha con exito'
        }
    }catch{
        return {
            code: 400,
            message: 'Error al actualizar la tarea' + id
        } 
    }
}

const deteleTask = async (id) => {
    try{
        await db.findByIdAndDelete(id);
        return { 
            code: 200,
            message: 'Se ha eliminado con exito: ' + id
        }
    }catch{
        return { 
            code: 400,
            message: 'Error al eliminar la tarea'
        }
    }
}

module.exports = {
    getAllTasks,
    createTask,
    deteleTask,
    getTaskById,
    updateTask
}