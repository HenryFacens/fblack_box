const request = require('supertest');
const express = require('express');
const reporteRoutes = require('../reporte/reporte.routes');
const reporteController = require('../reporte/reporte.controller');
const upload = require('../../middleware/upload');

jest.mock('../reporte/reporte.controller');
jest.mock('../../middleware/upload', () => ({
  fields: jest.fn(() => (req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use('/api/reporte', reporteRoutes);

describe('Reporte Routes', () => {
  describe('POST /api/reporte/create', () => {
    it('deve retornar 201 e criar um novo reporte com sucesso', async () => {
      const mockResponse = { message: 'Reporte criado com sucesso' };
      reporteController.createReporte.mockImplementation((req, res) => {
        res.status(201).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/reporte/create')
        .field('descricaoReporte', 'Teste de reporte')
        .field('localizacaoReporte', 'Localização teste')
        .field('categoriasReporte', 'Categoria teste')
        .field('statusReporte', 'Aberto')
        .attach('imagemReporte', Buffer.from('imagem'), 'imagem.jpg')
        .set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
      expect(reporteController.createReporte).toHaveBeenCalled();
    });

    it('deve retornar 401 se o token não for fornecido', async () => {
      const mockResponse = { message: 'Token não fornecido' };
      reporteController.createReporte.mockImplementation((req, res) => {
        res.status(401).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/reporte/create')
        .field('descricaoReporte', 'Teste de reporte');

      expect(response.status).toBe(401);
      expect(response.body).toEqual(mockResponse);
      expect(reporteController.createReporte).toHaveBeenCalled();
    });
  });

  describe('GET /api/reporte/get', () => {
    it('deve retornar 200 e a lista de reportes', async () => {
      const mockReportes = [{ id: 1, descricaoReporte: 'Teste' }];
      reporteController.getReportes.mockImplementation((req, res) => {
        res.status(200).json({ data: mockReportes });
      });

      const response = await request(app).get('/api/reporte/get');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: mockReportes });
      expect(reporteController.getReportes).toHaveBeenCalled();
    });
  });

  describe('PUT /api/reporte/update', () => {
    it('deve retornar 200 e atualizar a avaliação do reporte', async () => {
      const mockResponse = { message: 'Avaliação atualizada com sucesso' };
      reporteController.avaliacaoReporte.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .put('/api/reporte/update')
        .send({ idReporte: 1, avaliacao: 5 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(reporteController.avaliacaoReporte).toHaveBeenCalled();
    });

    it('deve retornar 400 se os dados enviados forem inválidos', async () => {
      const mockResponse = { message: 'Dados inválidos' };
      reporteController.avaliacaoReporte.mockImplementation((req, res) => {
        res.status(400).json(mockResponse);
      });

      const response = await request(app)
        .put('/api/reporte/update')
        .send({ idReporte: 'abc', avaliacao: 6 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(mockResponse);
      expect(reporteController.avaliacaoReporte).toHaveBeenCalled();
    });
  });

  describe('POST /api/reporte/:reporteId/interagir', () => {
    it('deve retornar 200 e criar ou atualizar a interação com sucesso', async () => {
      const mockResponse = { message: 'Interação criada ou atualizada com sucesso' };
      reporteController.interagirReporte.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/reporte/1/interagir')
        .send({ tipo: 'like' })
        .set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(reporteController.interagirReporte).toHaveBeenCalled();
    });

    it('deve retornar 400 se o tipo de interação for inválido', async () => {
      const mockResponse = { message: 'Tipo de interação inválido' };
      reporteController.interagirReporte.mockImplementation((req, res) => {
        res.status(400).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/reporte/1/interagir')
        .send({ tipo: 'invalid' })
        .set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(400);
      expect(response.body).toEqual(mockResponse);
      expect(reporteController.interagirReporte).toHaveBeenCalled();
    });
  });

  describe('POST /api/reporte/:reporteId/comentario', () => {
    it('deve retornar 200 e criar um comentário com sucesso', async () => {
      const mockResponse = { message: 'Comentário criado com sucesso' };
      reporteController.comentarioReporte.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/reporte/1/comentario')
        .send({ comentario: 'Teste de comentário' })
        .set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(reporteController.comentarioReporte).toHaveBeenCalled();
    });

    it('deve retornar 401 se o token não for fornecido', async () => {
      const mockResponse = { message: 'Token não fornecido' };
      reporteController.comentarioReporte.mockImplementation((req, res) => {
        res.status(401).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/reporte/1/comentario')
        .send({ comentario: 'Teste de comentário' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual(mockResponse);
      expect(reporteController.comentarioReporte).toHaveBeenCalled();
    });
  });
});