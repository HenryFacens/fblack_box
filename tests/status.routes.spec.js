const request = require('supertest');
const express = require('express');
const statusRoutes = require('../status/status.routes');
const statusController = require('../status/status.controller');

jest.mock('../status/status.controller');

const app = express();
app.use(express.json());
app.use('/api/status', statusRoutes);

describe('Status Routes', () => {
  describe('GET /api/status/get', () => {
    it('deve retornar 200 e a lista de status disponíveis', async () => {
      const mockStatusList = ['Aberto', 'Fechado'];
      statusController.listStatus.mockImplementation((req, res) => {
        res.status(200).json({ data: mockStatusList });
      });

      const response = await request(app).get('/api/status/get');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: mockStatusList });
      expect(statusController.listStatus).toHaveBeenCalled();
    });

    it('deve retornar 401 se o token não for fornecido', async () => {
      statusController.listStatus.mockImplementation((req, res) => {
        res.status(401).json({ message: 'Token não fornecido' });
      });

      const response = await request(app).get('/api/status/get');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Token não fornecido' });
      expect(statusController.listStatus).toHaveBeenCalled();
    });

    it('deve retornar 500 em caso de erro interno', async () => {
      statusController.listStatus.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Erro interno do servidor' });
      });

      const response = await request(app).get('/api/status/get');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Erro interno do servidor' });
      expect(statusController.listStatus).toHaveBeenCalled();
    });
  });

  describe('PATCH /api/status/update/:reporteId', () => {
    it('deve retornar 200 e atualizar o status do reporte com sucesso', async () => {
      const mockReporteId = 1;
      const mockNewStatus = 'Fechado';
      const mockResponse = { message: 'Status atualizado com sucesso' };

      statusController.updateStatusReporte.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .patch(`/api/status/update/${mockReporteId}`)
        .set('Authorization', 'Bearer validToken')
        .send({ newStatus: mockNewStatus });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(statusController.updateStatusReporte).toHaveBeenCalled();
    });

    it('deve retornar 400 se os dados enviados forem inválidos', async () => {
      const mockReporteId = 'abc'; // ID inválido
      const mockResponse = { message: 'ID do reporte inválido ou não fornecido.' };

      statusController.updateStatusReporte.mockImplementation((req, res) => {
        res.status(400).json(mockResponse);
      });

      const response = await request(app)
        .patch(`/api/status/update/${mockReporteId}`)
        .set('Authorization', 'Bearer validToken')
        .send({ newStatus: 'Fechado' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(mockResponse);
      expect(statusController.updateStatusReporte).toHaveBeenCalled();
    });

    it('deve retornar 404 se o reporte não for encontrado', async () => {
      const mockReporteId = 999; // ID inexistente
      const mockResponse = { message: 'Reporte não encontrado.' };

      statusController.updateStatusReporte.mockImplementation((req, res) => {
        res.status(404).json(mockResponse);
      });

      const response = await request(app)
        .patch(`/api/status/update/${mockReporteId}`)
        .set('Authorization', 'Bearer validToken')
        .send({ newStatus: 'Fechado' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual(mockResponse);
      expect(statusController.updateStatusReporte).toHaveBeenCalled();
    });

    it('deve retornar 401 se o token não for fornecido', async () => {
      const mockReporteId = 1;
      const mockResponse = { message: 'Token não fornecido' };

      statusController.updateStatusReporte.mockImplementation((req, res) => {
        res.status(401).json(mockResponse);
      });

      const response = await request(app)
        .patch(`/api/status/update/${mockReporteId}`)
        .send({ newStatus: 'Fechado' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual(mockResponse);
      expect(statusController.updateStatusReporte).toHaveBeenCalled();
    });

    it('deve retornar 500 em caso de erro interno', async () => {
      const mockReporteId = 1;
      const mockResponse = { error: 'Erro interno do servidor' };

      statusController.updateStatusReporte.mockImplementation((req, res) => {
        res.status(500).json(mockResponse);
      });

      const response = await request(app)
        .patch(`/api/status/update/${mockReporteId}`)
        .set('Authorization', 'Bearer validToken')
        .send({ newStatus: 'Fechado' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual(mockResponse);
      expect(statusController.updateStatusReporte).toHaveBeenCalled();
    });
  });
});