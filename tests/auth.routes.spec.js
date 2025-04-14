const request = require('supertest');
const express = require('express');
const authRoutes = require('../auth/auth.routes');
const authController = require('../auth/auth.controller');

jest.mock('../auth/auth.controller');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('deve retornar 201 e cadastrar um novo usuário com sucesso', async () => {
      const mockResponse = { message: 'Usuário cadastrado com sucesso' };

      authController.register.mockImplementation((req, res) => {
        res.status(201).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nome: 'Teste',
          email: 'teste@email.com',
          senha: 'senha123',
          cpf: '12345678900',
          birthdate: '2000-01-01',
          cep: '01001000',
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
      expect(authController.register).toHaveBeenCalled();
    });

    it('deve retornar 400 se os dados forem inválidos', async () => {
      const mockResponse = { message: 'Email já cadastrado ou dados inválidos' };

      authController.register.mockImplementation((req, res) => {
        res.status(400).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nome: '',
          email: 'email_invalido',
          senha: '123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(mockResponse);
      expect(authController.register).toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/login', () => {
    it('deve retornar 200 e autenticar o usuário com sucesso', async () => {
      const mockResponse = { token: 'mockToken123' };

      authController.login.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'teste@email.com',
          senha: 'senha123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(authController.login).toHaveBeenCalled();
    });

    it('deve retornar 400 se as credenciais forem inválidas', async () => {
      const mockResponse = { message: 'Credenciais inválidas' };

      authController.login.mockImplementation((req, res) => {
        res.status(400).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'email_invalido',
          senha: 'senha_errada',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(mockResponse);
      expect(authController.login).toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/logout', () => {
    it('deve retornar 200 ao realizar logout com sucesso', async () => {
      const mockResponse = { message: 'Logout realizado com sucesso' };

      authController.logout.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer mockToken123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(authController.logout).toHaveBeenCalled();
    });

    it('deve retornar 500 em caso de erro interno', async () => {
      const mockResponse = { error: 'Erro ao realizar logout' };

      authController.logout.mockImplementation((req, res) => {
        res.status(500).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer mockToken123');

      expect(response.status).toBe(500);
      expect(response.body).toEqual(mockResponse);
      expect(authController.logout).toHaveBeenCalled();
    });
  });
});