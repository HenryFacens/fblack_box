const request = require('supertest');
const express = require('express');
const userRoutes = require('../user/user.routes');
const userController = require('../user/user.controller');

jest.mock('../user/user.controller');

const app = express();
app.use(express.json());
app.use('/api/user', userRoutes);

describe('User Routes', () => {
  describe('GET /api/user/profile', () => {
    it('deve retornar 200 e o perfil do usuário', async () => {
      const mockUser = { id: 1, nome: 'Teste', email: 'teste@email.com' };
      userController.getProfile.mockImplementation((req, res) => {
        res.status(200).json(mockUser);
      });

      const response = await request(app).get('/api/user/profile').set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(userController.getProfile).toHaveBeenCalled();
    });

    it('deve retornar 401 se o token não for fornecido', async () => {
      userController.getProfile.mockImplementation((req, res) => {
        res.status(401).json({ message: 'Token não fornecido' });
      });

      const response = await request(app).get('/api/user/profile');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Token não fornecido' });
      expect(userController.getProfile).toHaveBeenCalled();
    });
  });

  describe('PUT /api/user/update', () => {
    it('deve retornar 200 e atualizar o perfil do usuário', async () => {
      const mockResponse = { message: 'Perfil atualizado com sucesso' };
      userController.updateProfile.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .put('/api/user/update')
        .set('Authorization', 'Bearer validToken')
        .send({ nome: 'Novo Nome', email: 'novo@email.com' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(userController.updateProfile).toHaveBeenCalled();
    });

    it('deve retornar 401 se o token não for fornecido', async () => {
      userController.updateProfile.mockImplementation((req, res) => {
        res.status(401).json({ message: 'Token não fornecido' });
      });

      const response = await request(app).put('/api/user/update').send({ nome: 'Novo Nome' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Token não fornecido' });
      expect(userController.updateProfile).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/user/delete', () => {
    it('deve retornar 200 e deletar o perfil do usuário', async () => {
      const mockResponse = { message: 'Perfil deletado com sucesso' };
      userController.deleteProfile.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app).delete('/api/user/delete').set('Authorization', 'Bearer validToken');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(userController.deleteProfile).toHaveBeenCalled();
    });

    it('deve retornar 401 se o token não for fornecido', async () => {
      userController.deleteProfile.mockImplementation((req, res) => {
        res.status(401).json({ message: 'Token não fornecido' });
      });

      const response = await request(app).delete('/api/user/delete');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Token não fornecido' });
      expect(userController.deleteProfile).toHaveBeenCalled();
    });
  });

  describe('POST /api/user/forgot-password', () => {
    it('deve retornar 200 e enviar o link de redefinição de senha', async () => {
      const mockResponse = { message: 'Link de redefinição enviado para seu e-mail' };
      userController.forgotPassword.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/user/forgot-password')
        .send({ email: 'teste@email.com' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(userController.forgotPassword).toHaveBeenCalled();
    });

    it('deve retornar 404 se o e-mail não for encontrado', async () => {
      const mockResponse = { message: 'Usuário não encontrado' };
      userController.forgotPassword.mockImplementation((req, res) => {
        res.status(404).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/user/forgot-password')
        .send({ email: 'naoexiste@email.com' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual(mockResponse);
      expect(userController.forgotPassword).toHaveBeenCalled();
    });
  });

  describe('POST /api/user/reset-password', () => {
    it('deve retornar 200 e redefinir a senha com sucesso', async () => {
      const mockResponse = { message: 'Senha redefinida com sucesso' };
      userController.resetPassword.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/user/reset-password')
        .send({
          token: 'validToken',
          newPassword: 'novaSenha123',
          confirmPassword: 'novaSenha123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(userController.resetPassword).toHaveBeenCalled();
    });

    it('deve retornar 400 se as senhas não coincidirem', async () => {
      const mockResponse = { message: 'As senhas não coincidem' };
      userController.resetPassword.mockImplementation((req, res) => {
        res.status(400).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/user/reset-password')
        .send({
          token: 'validToken',
          newPassword: 'novaSenha123',
          confirmPassword: 'senhaDiferente456',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(mockResponse);
      expect(userController.resetPassword).toHaveBeenCalled();
    });
  });
});