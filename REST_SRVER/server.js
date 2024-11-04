const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Message = require('./models/Message'); // Supondo que você tenha um modelo de mensagem


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// User Schema atualizado
const userSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  apelido: { type: String, required: true, trim: true },
  telefone: { type: String, required: true, trim: true },
  senha: { type: String, required: true },
  tipo: { type: String, enum: ['Jogador', 'Mestre'], default: 'Jogador' },
  descricao: { type: String, default: '' },
  sistemas_preferidos: { type: [String], default: [] },
  data_criacao: { type: Date, default: Date.now },
  ultima_atualizacao: { type: Date, default: Date.now }
});

// Match Schema
const matchSchema = new mongoose.Schema({
  usuario_id1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  usuario_id2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pendente', 'aceito', 'rejeitado'], 
    default: 'pendente' 
  },
  data_criacao: { type: Date, default: Date.now },
  data_atualizacao: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Match = mongoose.model('Match', matchSchema);

// Helper function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Middleware for error handling
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Middleware de autenticação
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Routes existentes atualizadas
app.post('/register', asyncHandler(async (req, res) => {
  const { nome, email, apelido, telefone, senha, tipo, descricao, sistemas_preferidos } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(senha, salt);

  const user = new User({ 
    nome, 
    email, 
    apelido, 
    telefone, 
    senha: hashedPassword,
    tipo,
    descricao,
    sistemas_preferidos
  });
  
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
    telefone: user.telefone,
    tipo: user.tipo,
    descricao: user.descricao,
    sistemas_preferidos:  user.sistemas_preferidos
  });
}));

// Rota para buscar perfis para match
app.get('/profiles', authMiddleware, asyncHandler(async (req, res) => {
  const currentUser = req.user;
  
  // Busca usuários que ainda não deram match com o usuário atual
  const existingMatches = await Match.find({
    $or: [
      { usuario_id1: currentUser._id },
      { usuario_id2: currentUser._id }
    ]
  });

  const matchedUserIds = existingMatches.map(match => 
    match.usuario_id1.equals(currentUser._id) ? match.usuario_id2 : match.usuario_id1
  );

  // Adiciona o ID do usuário atual para excluí-lo dos resultados
  matchedUserIds.push(currentUser._id);

  const profiles = await User.find({
    _id: { $nin: matchedUserIds }
  }).select('-senha');

  res.json(profiles);
}));

// Rota para criar um novo match
app.post('/matches', authMiddleware, asyncHandler(async (req, res) => {
  const { targetUserId } = req.body;
  const currentUser = req.user;

  // Verifica se já existe um match entre estes usuários
  const existingMatch = await Match.findOne({
    $or: [
      { usuario_id1: currentUser._id, usuario_id2: targetUserId },
      { usuario_id1: targetUserId, usuario_id2: currentUser._id }
    ]
  });

  if (existingMatch) {
    return res.status(400).json({ message: 'Match already exists' });
  }

  const match = new Match({
    usuario_id1: currentUser._id,
    usuario_id2: targetUserId
  });

  await match.save();
  res.status(201).json({ message: 'Match created successfully', match });
}));

// Rota para listar matches do usuário
app.get('/matches', authMiddleware, asyncHandler(async (req, res) => {
  const matches = await Match.find({
    $or: [
      { usuario_id1: req.user._id },
      { usuario_id2: req.user._id }
    ]
  }).populate('usuario_id1 usuario_id2', '-senha');

  res.json(matches);
}));

// Rota para atualizar status do match
app.patch('/matches/:matchId', authMiddleware, asyncHandler(async (req, res) => {
  const { status } = req.body;
  const match = await Match.findById(req.params.matchId);

  if (!match) {
    return res.status(404).json({ message: 'Match not found' });
  }

  if (!match.usuario_id1.equals(req.user._id) && !match.usuario_id2.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to update this match' });
  }

  match.status = status;
  match.data_atualizacao = Date.now();
  await match.save();

  res.json({ message: 'Match updated successfully', match });
}));

// Buscar mensagens de um match
app.get('/messages/:matchId', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ matchId: req.params.matchId })
      .sort({ createdAt: 1 })
      .populate('senderId', 'nome apelido'); // Popula informações do remetente

    res.json(messages.map(msg => msg.format()));
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
});

// Enviar nova mensagem
app.post('/messages', authMiddleware, async (req, res) => {
  try {
    const { matchId, content, messageType = 'text' } = req.body;

    // Verificar se o match existe e se o usuário faz parte dele
    const match = await Match.findOne({
      _id: matchId,
      $or: [
        { usuario_id1: req.user._id },
        { usuario_id2: req.user._id }
      ]
    });

    if (!match) {
      return res.status(404).json({ error: 'Match não encontrado ou acesso não autorizado' });
    }

    const newMessage = new Message({
      matchId,
      senderId: req.user._id,
      content,
      messageType
    });

    await newMessage.save();

    // Popula as informações do remetente antes de retornar
    await newMessage.populate('senderId', 'nome apelido');

    res.status(201).json(newMessage.format());
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
});

// Marcar mensagens como lidas
app.patch('/messages/read/:matchId', authMiddleware, async (req, res) => {
  try {
    await Message.updateMany(
      {
        matchId: req.params.matchId,
        senderId: { $ne: req.user._id },
        isRead: false
      },
      { isRead: true }
    );

    res.json({ message: 'Mensagens marcadas como lidas' });
  } catch (error) {
    console.error('Erro ao marcar mensagens como lidas:', error);
    res.status(500).json({ error: 'Erro ao marcar mensagens como lidas' });
  }
});

// Buscar mensagens não lidas
app.get('/messages/unread/count', authMiddleware, async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      senderId: { $ne: req.user._id },
      isRead: false
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error('Erro ao buscar contagem de mensagens não lidas:', error);
    res.status(500).json({ error: 'Erro ao buscar contagem de mensagens não lidas' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});