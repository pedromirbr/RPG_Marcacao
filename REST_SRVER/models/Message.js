// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'system'],
    default: 'text'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Isso automaticamente gerencia createdAt e updatedAt
});

// Índices para melhorar a performance das consultas
messageSchema.index({ matchId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });

// Método para formatar a mensagem
messageSchema.methods.format = function() {
  return {
    id: this._id,
    matchId: this.matchId,
    senderId: this.senderId,
    content: this.content,
    isRead: this.isRead,
    messageType: this.messageType,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Middleware para atualizar updatedAt antes de salvar
messageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;