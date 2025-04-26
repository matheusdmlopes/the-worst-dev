const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração para processar dados JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '../public')));

// Rota principal - serve o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Endpoint de teste para verificar se o servidor está funcionando
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        message: 'O servidor está funcionando corretamente',
        timestamp: new Date().toISOString()
    });
});

// Endpoint para processar o formulário (será expandido na Fase 3)
app.post('/api/register', (req, res) => {
    // Por enquanto, apenas retornamos um erro genérico
    res.status(400).json({
        success: false,
        message: 'Formulário com erros',
        errors: {
            name: 'Já existe um usuário com esse nome no sistema'
        }
    });
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log('Para encerrar o servidor, pressione Ctrl+C');
}); 