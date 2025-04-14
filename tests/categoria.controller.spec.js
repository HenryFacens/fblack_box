const request = require('supertest');
const express = require('express');
const categoriaRoutes = require('../categoria/categoria.routes');
const categoriaController = require('../categoria/categoria.controller');

jest.mock('../categoria/categoria.controller');

const app = express();
app.use(express.json());
app.use('/api/categoria', categoriaRoutes);

describe('Categoria Routes', () => {
  describe('POST /api/categoria/create', () => {
    it('deve retornar 201 e criar uma nova categoria com sucesso', async () => {
      const mockResponse = { message: 'Categoria criada com sucesso' };

      categoriaController.createCategoria.mockImplementation((req, res) => {
        res.status(201).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/categoria/create')
        .set('Authorization', 'Bearer validToken')
        .send({ categoriasReporte: 'Nova Categoria' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
      expect(categoriaController.createCategoria).toHaveBeenCalled();
    });

    it('deve retornar 403 se o usuário não for admin', async () => {
      const mockResponse = { message: 'Usuário não é admin' };

      categoriaController.createCategoria.mockImplementation((req, res) => {
        res.status(403).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/categoria/create')
        .set('Authorization', 'Bearer validToken')
        .send({ categoriasReporte: 'Nova Categoria' });

      expect(response.status).toBe(403);
      expect(response.body).toEqual(mockResponse);
      expect(categoriaController.createCategoria).toHaveBeenCalled();
    });

    it('deve retornar 500 em caso de erro interno', async () => {
      const mockResponse = { error: 'Erro interno do servidor' };

      categoriaController.createCategoria.mockImplementation((req, res) => {
        res.status(500).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/categoria/create')
        .set('Authorization', 'Bearer validToken')
        .send({ categoriasReporte: 'Nova Categoria' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual(mockResponse);
      expect(categoriaController.createCategoria).toHaveBeenCalled();
    });
  });

  describe('GET /api/categoria/get', () => {
    it('deve retornar 200 e listar todas as categorias', async () => {
      const mockCategorias = ['Categoria 1', 'Categoria 2'];

      categoriaController.listCategorias.mockImplementation((req, res) => {
        res.status(200).json({ data: mockCategorias });
      });

      const response = await request(app).get('/api/categoria/get');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: mockCategorias });
      expect(categoriaController.listCategorias).toHaveBeenCalled();
    });

    it('deve retornar 500 em caso de erro interno', async () => {
      const mockResponse = { error: 'Erro interno do servidor' };

      categoriaController.listCategorias.mockImplementation((req, res) => {
        res.status(500).json(mockResponse);
      });

      const response = await request(app).get('/api/categoria/get');

      expect(response.status).toBe(500);
      expect(response.body).toEqual(mockResponse);
      expect(categoriaController.listCategorias).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/categoria/:id', () => {
    it('deve retornar 200 e deletar uma categoria com sucesso', async () => {
      const mockResponse = { message: 'Categoria deletada com sucesso' };

      categoriaController.deleteCategoria.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .delete('/api/categoria/1')
        .set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(categoriaController.deleteCategoria).toHaveBeenCalled();
    });

    it('deve retornar 403 se o usuário não for admin', async () => {
      const mockResponse = { message: 'Acesso negado. Somente administradores podem deletar categorias' };

      categoriaController.deleteCategoria.mockImplementation((req, res) => {
        res.status(403).json(mockResponse);
      });

      const response = await request(app)
        .delete('/api/categoria/1')
        .set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(403);
      expect(response.body).toEqual(mockResponse);
      expect(categoriaController.deleteCategoria).toHaveBeenCalled();
    });

    it('deve retornar 404 se a categoria não for encontrada', async () => {
      const mockResponse = { message: 'Categoria não encontrada' };

      categoriaController.deleteCategoria.mockImplementation((req, res) => {
        res.status(404).json(mockResponse);
      });

      const response = await request(app)
        .delete('/api/categoria/999')
        .set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(404);
      expect(response.body).toEqual(mockResponse);
      expect(categoriaController.deleteCategoria).toHaveBeenCalled();
    });

    it('deve retornar 500 em caso de erro interno', async () => {
      const mockResponse = { error: 'Erro interno do servidor' };

      categoriaController.deleteCategoria.mockImplementation((req, res) => {
        res.status(500).json(mockResponse);
      });

      const response = await request(app)
        .delete('/api/categoria/1')
        .set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(500);
      expect(response.body).toEqual(mockResponse);
      expect(categoriaController.deleteCategoria).toHaveBeenCalled();
    });
  });
});