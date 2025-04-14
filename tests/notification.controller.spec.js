const jwt = require('jsonwebtoken');
const { Notification } = require('../../models');
const notificationController = require('../notification/notification.controller');

jest.mock('jsonwebtoken');
jest.mock('../../models');

describe('Notification Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      header: jest.fn(),
      params: {},
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('createNotification', () => {
    it('deve retornar 401 se o token não for fornecido', async () => {
      mockReq.header.mockReturnValue(null);

      await notificationController.createNotification(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token não fornecido' });
    });

    it('deve retornar 201 e criar uma notificação com sucesso', async () => {
      mockReq.header.mockReturnValue('Bearer validToken');
      jwt.verify.mockReturnValue({ id: 1 });
      mockReq.params.reporteId = 123;

      const mockNotification = {
        id: 1,
        userId: 1,
        reportId: 123,
        message: 'Status update on report 123',
        read: false,
      };

      Notification.create.mockResolvedValue(mockNotification);

      await notificationController.createNotification(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Notificação criada com sucesso',
        data: mockNotification,
      });
      expect(Notification.create).toHaveBeenCalledWith({
        userId: 1,
        reportId: 123,
        message: 'Status update on report 123',
        read: false,
      });
    });

    it('deve retornar 500 em caso de erro interno', async () => {
      mockReq.header.mockReturnValue('Bearer validToken');
      jwt.verify.mockReturnValue({ id: 1 });
      mockReq.params.reporteId = 123;

      Notification.create.mockRejectedValue(new Error('Erro interno'));

      await notificationController.createNotification(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Erro interno do servidor.' });
    });
  });
});