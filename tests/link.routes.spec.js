const request = require('supertest');
const express = require('express');
const linkRoutes = require('../link/link.routes');
const linkController = require('../link/link.controller');

jest.mock('../link/link.controller');

const app = express();
app.use(express.json());
app.use('/api/link', linkRoutes);

describe('Link Routes', () => {
  describe('POST /api/link/share/:reporteId', () => {
    it('deve retornar 201 e gerar um link de compartilhamento com sucesso', async () => {
      const mockResponse = {
        token: 'mockToken123',
        url: '/compartilhamento/acessar/mockToken123',
      };

      linkController.gerarLink.mockImplementation((req, res) => {
        res.status(201).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/link/share/123')
        .set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
      expect(linkController.gerarLink).toHaveBeenCalled();
    });

    it('deve retornar 401 se o token não for fornecido', async () => {
      const mockResponse = { message: 'Token não fornecido' };

      linkController.gerarLink.mockImplementation((req, res) => {
        res.status(401).json(mockResponse);
      });

      const response = await request(app).post('/api/link/share/123');

      expect(response.status).toBe(401);
      expect(response.body).toEqual(mockResponse);
      expect(linkController.gerarLink).toHaveBeenCalled();
    });

    it('deve retornar 500 em caso de erro interno', async () => {
      const mockResponse = { error: 'Erro interno do servidor' };

      linkController.gerarLink.mockImplementation((req, res) => {
        res.status(500).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/link/share/123')
        .set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(500);
      expect(response.body).toEqual(mockResponse);
      expect(linkController.gerarLink).toHaveBeenCalled();
    });
  });

  describe('GET /api/link/access/:token', () => {
    it('deve retornar 200 e acessar o link de compartilhamento com sucesso', async () => {
      const mockReporte = {
        id: 123,
        descricaoReporte: 'Teste de reporte',
      };

      linkController.acessarLink.mockImplementation((req, res) => {
        res.status(200).json(mockReporte);
      });

      const response = await request(app)
        .get('/api/link/access/mockToken123')
        .set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReporte);
      expect(linkController.acessarLink).toHaveBeenCalled();
    });

    it('deve retornar 401 se o token JWT não for fornecido', async () => {
      const mockResponse = { message: 'Token não fornecido' };

      linkController.acessarLink.mockImplementation((req, res) => {
        res.status(401).json(mockResponse);
      });

      const response = await request(app).get('/api/link/access/mockToken123');

      expect(response.status).toBe(401);
      expect(response.body).toEqual(mockResponse);
      expect(linkController.acessarLink).toHaveBeenCalled();
    });

    it('deve retornar 400 em caso de erro ao acessar o link', async () => {
      const mockResponse = { error: 'Link inválido ou expirado' };

      linkController.acessarLink.mockImplementation((req, res) => {
        res.status(400).json(mockResponse);
      });

      const response = await request(app)
        .get('/api/link/access/mockToken123')
        .set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(400);
      expect(response.body).toEqual(mockResponse);
      expect(linkController.acessarLink).toHaveBeenCalled();
    });
  });
});