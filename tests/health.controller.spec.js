const healthController = require('../health/health.controller');

describe('Health Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('health', () => {
    it('deve retornar 200 com a mensagem "I\'m alive!"', async () => {
      await healthController.health(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "I'm alive!" });
    });

    it('deve retornar 400 em caso de erro', async () => {
      const mockError = new Error('Erro ao acessar a API!');
      mockRes.status.mockImplementationOnce(() => {
        throw mockError;
      });

      try {
        await healthController.health(mockReq, mockRes);
      } catch (error) {
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
          error: 'Erro ao acessar a API!',
          details: mockError.message,
        });
      }
    });
  });
});