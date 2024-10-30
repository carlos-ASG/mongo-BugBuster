const service = require('../db/service')

function getAllTasks() {
  return service.getAllTasks();
}

const createTask = async (title, description, completed, createdAt) => {
  return service.createTask(title, description, completed, createdAt);
};

function getTaskById(id) {
  return service.getTaskById(id);
}

function updateTask(id,title, description, completed,createdAt) {
  return service.updateTask(id,title, description, completed,createdAt);
}

function deleteTask(id) {
  return service.deteleTask(id);
}

function newID() {
  const maxID = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) : 0;
  return maxID + 1;
}

module.exports = {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
};
