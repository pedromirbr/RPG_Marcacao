const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // For password hashing
const app = express();
const port = 3000;

// Connect to MongoDB (replace with your connection string)
mongoose.connect('mongodb://localhost/meu-app');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Define the user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User ', userSchema);

// Route for user registration
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  const existingUser  = await User.findOne({ email });
  if (existingUser ) {
    return res.status(400).json({ message: 'Usuário já cadastrado' });
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });

  try {
    await user.save();
    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar usuário', error });
  }
});

// Route for user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    res.status(200).json({ message: 'Login bem-sucedido' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});