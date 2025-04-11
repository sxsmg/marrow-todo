const mongoose = require('mongoose');
const User = require('../models/User');
const Todo = require('../models/Todo');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected for seeding...'))
  .catch(err => console.error(err));

// Generate dummy users
const createUsers = async () => {
  const users = [];
  
  // Create 5 dummy users
  for (let i = 1; i <= 5; i++) {
    const hashedPassword = await bcrypt.hash(`user${i}pass`, 10);
    users.push({
      username: `user${i}`,
      email: `user${i}@example.com`,
      password: hashedPassword
    });
  }
  
  // Delete existing users and insert new ones
  await User.deleteMany({});
  const createdUsers = await User.insertMany(users);
  console.log(`${createdUsers.length} users seeded successfully`);
  return createdUsers;
};

// Generate dummy todos for each user
const createTodos = async (users) => {
  const todos = [];
  const priorities = ['High', 'Medium', 'Low'];
  
  users.forEach((user, index) => {
    // Each user gets 5 todos
    for (let i = 1; i <= 5; i++) {
      todos.push({
        title: `Todo ${i} for User ${index + 1}`,
        description: `This is todo item ${i}'s description`,
        priority: priorities[i % 3], // Cycle through priorities
        tags: [`tag${i}`, `tag${i+1}`],
        user: user._id
      });
    }
  });

  // Delete existing todos and insert new ones
  await Todo.deleteMany({});
  const createdTodos = await Todo.insertMany(todos);
  console.log(`${createdTodos.length} todos seeded successfully`);
};

(async () => {
  try {
    // Create users first
    const users = await createUsers();
    
    // Then create todos for those users
    await createTodos(users);
    
    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
})();
