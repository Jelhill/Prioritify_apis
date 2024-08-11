import Todo from '../models/Todo.js';

export const getAllTodos = async (req, res) => {
  try {
    const { userId } = req.query;
    const todos = await Todo.find({ userId });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { task } = req.body;
    const { userId } = req.query;

    const todo = new Todo({
      task,
      userId,
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { task, completed, completed_time } = req.body;

    const todo = await Todo.findByIdAndUpdate(
      id,
      { task, completed, completed_time },
      { new: true }
    );

    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    await Todo.findOneAndDelete({ _id: id });
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteAllTodos = async (req, res) => {
  try {
    const { userId } = req.query;
    await Todo.deleteMany({ userId });
    res.json({ message: 'All todos deleted successfully', status: 200 });
  } catch (error) {
    res.status(500).json({ message: 'Server error', status: 500 });
  }
};
