const request = require('supertest');
const express = require('express');
const healthRoutes = require('../health/health.routes');
const healthController = require('../health/health.controller');

jest.mock('../health/health.controller');

const app = express();
app.use('/', healthRoutes);

describe('Health Routes', () => {
  describe('GET /', () => {
    it('deve retornar 200 com a mensagem "I\'m alive!"', async () => {
      healthController.health.mockImplementation((req, res) => {
        res.status(200).json({ message: "I'm alive!" });
      });

      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "I'm alive!" });
      expect(healthController.health).toHaveBeenCalled();
    });

    it('deve retornar 400 em caso de erro', async () => {
      healthController.health.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Erro ao acessar a API!', details: 'Detalhes do erro' });
      });

      const response = await request(app).get('/');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Erro ao acessar a API!',
        details: 'Detalhes do erro',
      });
      expect(healthController.health).toHaveBeenCalled();
    });
  });
});