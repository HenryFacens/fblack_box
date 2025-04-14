const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const userController = require('../user/user.controller');

jest.mock('../../models');
jest.mock('jsonwebtoken');
jest.mock('nodemailer');
jest.mock('bcrypt');

describe('User Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      header: jest.fn(),
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('deve retornar 401 se o token não for fornecido', async () => {
      mockReq.header.mockReturnValue(null);

      await userController.getProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token não fornecido' });
    });

    it('deve retornar 404 se o usuário não for encontrado', async () => {
      mockReq.header.mockReturnValue('Bearer validToken');
      jwt.verify.mockReturnValue({ id: 1 });
      User.findByPk.mockResolvedValue(null);

      await userController.getProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Usuário não encontrado' });
    });

    it('deve retornar o perfil do usuário com sucesso', async () => {
      const mockUser = { id: 1, nome: 'Teste' };
      mockReq.header.mockReturnValue('Bearer validToken');
      jwt.verify.mockReturnValue({ id: 1 });
      User.findByPk.mockResolvedValue(mockUser);

      await userController.getProfile(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('updateProfile', () => {
    it('deve retornar 401 se o token não for fornecido', async () => {
      mockReq.header.mockReturnValue(null);

      await userController.updateProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token não fornecido' });
    });

    it('deve retornar 404 se o usuário não for encontrado', async () => {
      mockReq.header.mockReturnValue('Bearer validToken');
      jwt.verify.mockReturnValue({ id: 1 });
      User.findByPk.mockResolvedValue(null);

      await userController.updateProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Usuário não encontrado' });
    });

    it('deve atualizar o perfil do usuário com sucesso', async () => {
      const mockUser = { id: 1, update: jest.fn() };
      mockReq.header.mockReturnValue('Bearer validToken');
      jwt.verify.mockReturnValue({ id: 1 });
      User.findByPk.mockResolvedValue(mockUser);
      mockReq.body = { nome: 'Novo Nome' };

      await userController.updateProfile(mockReq, mockRes);

      expect(mockUser.update).toHaveBeenCalledWith({ nome: 'Novo Nome' });
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Perfil atualizado com sucesso', user: mockUser });
    });
  });

  describe('forgotPassword', () => {
    it('deve retornar 404 se o usuário não for encontrado', async () => {
      mockReq.body = { email: 'naoexiste@example.com' };
      User.findOne.mockResolvedValue(null);

      await userController.forgotPassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Usuário não encontrado' });
    });

    it('deve enviar o link de redefinição de senha com sucesso', async () => {
      const mockUser = { id: 1, email: 'usuario@example.com' };
      User.findOne.mockResolvedValue(mockUser);
      const sendMailMock = jest.fn();
      nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

      mockReq.body = { email: 'usuario@example.com' };

      await userController.forgotPassword(mockReq, mockRes);

      expect(sendMailMock).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Link de redefinição enviado para seu e-mail' });
    });
  });

  describe('resetPassword', () => {
    it('deve retornar 400 se as senhas não coincidirem', async () => {
      mockReq.body = { newPassword: '123456', confirmPassword: '654321' };

      await userController.resetPassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'As senhas não coincidem' });
    });

    it('deve redefinir a senha com sucesso', async () => {
      const mockUser = { id: 1, update: jest.fn() };
      jwt.verify.mockReturnValue({ id: 1 });
      User.findByPk.mockResolvedValue(mockUser);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      mockReq.body = { token: 'validToken', newPassword: '123456', confirmPassword: '123456' };

      await userController.resetPassword(mockReq, mockRes);

      expect(mockUser.update).toHaveBeenCalledWith({ senha: 'hashedPassword' });
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Senha redefinida com sucesso' });
    });
  });

  describe('deleteProfile', () => {
    it('deve retornar 401 se o token não for fornecido', async () => {
      mockReq.header.mockReturnValue(null);

      await userController.deleteProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token não fornecido' });
    });

    it('deve deletar o perfil do usuário com sucesso', async () => {
      const mockUser = { id: 1, destroy: jest.fn() };
      mockReq.header.mockReturnValue('Bearer validToken');
      jwt.verify.mockReturnValue({ id: 1 });
      User.findByPk.mockResolvedValue(mockUser);

      await userController.deleteProfile(mockReq, mockRes);

      expect(mockUser.destroy).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Perfil deletado com sucesso' });
    });
  });
});