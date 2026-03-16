const Task = require("../models/Task");

exports.createTask = async (req, res) => {

  try {

    const { title, description, status, assignedTo } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      assignedTo,
      createdBy: req.user.id
    });

    res.status(201).json(task);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};

exports.getTasks = async (req, res) => {

  try {

    const { status } = req.query;

    const filter = status ? { status } : {};

    const tasks = await Task.find(filter);

    res.json(tasks);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};

exports.getTaskById = async (req, res) => {

  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};

exports.updateTask = async (req, res) => {

  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedTask);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};

exports.deleteTask = async (req, res) => {

  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted successfully" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};