const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

console.log(process.env.MONGODB_URI);
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// User Schema
const userSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  apelido: { type: String, required: true, trim: true },
  telefone: { type: String, required: true, trim: true },
  senha: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Helper function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Middleware for error handling
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Routes
app.post('/register', asyncHandler(async (req, res) => {
  const { nome, email, apelido, telefone, senha } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(senha, salt);

  const user = new User({ nome, email, apelido, telefone, senha: hashedPassword });
  await user.save();

  const token = generateToken(user._id);
  res.status(201).json({ message: 'User registered successfully', token });
}));

app.post('/login', asyncHandler(async (req, res) => {
  const { email, senha } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(senha, user.senha);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);
  
  res.json({ 
    message: 'Login successful', 
    token,
    nome: user.nome,
    email: user.email,
    apelido: user.apelido,
    telefone: user.telefone
  });
}));


// Middleware de autenticação
const authMiddleware = async (req, res, next) => {
  try {
    // Verifica se o token está presente no header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verifica se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Busca o usuário no banco
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Adiciona o usuário à requisição
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Rota protegida para listar todos os usuários
app.get('/users/list', authMiddleware, asyncHandler(async (req, res) => {
  try {
    // Parâmetros de paginação e ordenação (opcionais)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sort || 'nome';
    const sortOrder = req.query.order === 'desc' ? -1 : 1;

    // Calcula o número de documentos a pular
    const skip = (page - 1) * limit;

    // Conta total de usuários
    const total = await User.countDocuments();

    // Busca usuários com paginação e ordenação
    const users = await User.find({}, '-senha')
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    // Retorna os resultados com metadados
    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        usersPerPage: limit
      }
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching users', 
      error: error.message 
    });
  }
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});