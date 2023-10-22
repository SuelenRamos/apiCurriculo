require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());


const pool = new Pool({
    connectionString: process.env.DB_CONNECTION_STRING
});

// Rota experiência
app.post('/experiencias', async (req, res) => {
  const { cargo, empresa, periodo } = req.body;

  try {
    const result = await pool.query('INSERT INTO experiencia (cargo, empresa, periodo) VALUES ($1, $2, $3) RETURNING *', [cargo, empresa, periodo]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao inserir no banco de dados', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota educacao
app.post('/educacao', async (req, res) => {
  const { instituicao, curso, periodo } = req.body;

  try {
    const result = await pool.query('INSERT INTO educacao (instituicao, curso, periodo) VALUES ($1, $2, $3) RETURNING *', [instituicao, curso, periodo]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao inserir no banco de dados', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota certificação
app.post('/certificacoes', async (req, res) => {
  const { nome, instituicao, data_certificacao } = req.body;

  try {
    const result = await pool.query('INSERT INTO certificacao (nome, instituicao, data_certificacao) VALUES ($1, $2, $3) RETURNING *', [nome, instituicao, data_certificacao]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao inserir no banco de dados', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota resumo 
app.post('/resumo', async (req, res) => {
    const { descricao } = req.body;
  
    try {
      // Verificar se o resumo já existe no banco de dados
      const existingResumo = await pool.query('SELECT * FROM resumo');
      if (existingResumo.rows.length > 0) {
       
        const updateResult = await pool.query('UPDATE resumo SET descricao = $1 RETURNING *', [descricao]);
        res.json(updateResult.rows[0]);
      } else {
      
        const createResult = await pool.query('INSERT INTO resumo (descricao) VALUES ($1) RETURNING *', [descricao]);
        res.json(createResult.rows[0]);
      }
    } catch (error) {
      console.error('Erro ao inserir/atualizar no banco de dados', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
  

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
