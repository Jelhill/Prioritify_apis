import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import todoRoutes from './routes/todoRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; 
import morgan from 'morgan';
import cron from 'node-cron';
import Todo from './models/Todo.js';
import User from './models/User.js';
import EmailService from './services/emailService.js';

const app = express();
const port = 3003;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan("tiny"));

mongoose.connect(`${process.env.MONGO_DB_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: {
    w: 'majority',
  },
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
  });

  cron.schedule('* * * * *', async () => {  // Runs every minute
    try {
      const currentTime = new Date();
      const twoMinutesFromNow = new Date(currentTime.getTime() + 2 * 60000); // Add 2 minutes to current time
  
      // Find todos where endTime is within 2 minutes and not completed
      const todosDueForReminder = await Todo.find({
        endTime: { $gte: currentTime, $lte: twoMinutesFromNow },  // EndTime is within 2 minutes range
        completed: false,
      });
  
      // Send email reminders for each due task
      for (const todo of todosDueForReminder) {
        const user = await User.findById(todo.userId);
        if (user && user.email) {
          await EmailService.sendTaskReminderEmail(user.email, todo.title, todo.endTime);
          console.log(`Reminder sent for task: ${todo.title}, to user: ${user.email}`);
        }
      }
    } catch (error) {
      console.error('Error checking for due todos:', error);
    }
  });

app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes); // Use admin routes

app.get('/', (req, res) => {
  res.json({ message: 'Priority Server running healthy' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

export { app };
