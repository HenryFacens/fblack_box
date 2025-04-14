const jwt = require('jsonwebtoken');
const service = require('../../services/linkService');
const linkController = require('../link/link.controller');

jest.mock('jsonwebtoken');
jest.mock('../../services/linkService');

describe('Link Controller', () => {
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

  describe('gerarLink', () => {
    it('deve retornar 401 se o token não for fornecido', async () => {
      mockReq.header.mockReturnValue(null);

      await linkController.gerarLink(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token não fornecido' });
    });

    it('deve retornar 201 e gerar um link de compartilhamento com sucesso', async () => {
      mockReq.header.mockReturnValue('Bearer validToken');
      jwt.verify.mockReturnValue({ id: 1 });
      mockReq.params.reporteId = 123;

      const mockLink = {
        token: 'mockToken123',
        url: '/compartilhamento/acessar/mockToken123',
      };

      service.gerarLinkCompartilhado.mockResolvedValue({ token: mockLink.token });

      await linkController.gerarLink(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        token: mockLink.token,
        url: mockLink.url,
      });
      expect(service.gerarLinkCompartilhado).toHaveBeenCalledWith(123);
    });

    it('deve retornar 500 em caso de erro interno', async () => {
      mockReq.header.mockReturnValue('Bearer validToken');
      jwt.verify.mockReturnValue({ id: 1 });
      mockReq.params.reporteId = 123;

      service.gerarLinkCompartilhado.mockRejectedValue(new Error('Erro interno'));

      await linkController.gerarLink(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor',
        details: 'Erro interno',
      });
    });
  });

  describe('acessarLink', () => {
    it('deve retornar 401 se o token JWT não for fornecido', async () => {
      mockReq.header.mockReturnValue(null);

      await linkController.acessarLink(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token não fornecido' });
    });

    it('deve retornar 200 e acessar o link de compartilhamento com sucesso', async () => {
      mockReq.header.mockReturnValue('Bearer validToken');
      jwt.verify.mockReturnValue({ id: 1 });
      mockReq.params.token = 'mockToken123';

      const mockReporte = {
        id: 123,
        descricaoReporte: 'Teste de reporte',
      };

      service.acessarLink.mockResolvedValue(mockReporte);

      await linkController.acessarLink(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockReporte);
      expect(service.acessarLink).toHaveBeenCalledWith('mockToken123');
    });

    it('deve retornar 400 em caso de erro ao acessar o link', async () => {
      mockReq.header.mockReturnValue('Bearer validToken');
      jwt.verify.mockReturnValue({ id: 1 });
      mockReq.params.token = 'mockToken123';

      service.acessarLink.mockRejectedValue(new Error('Link inválido ou expirado'));

      await linkController.acessarLink(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Link inválido ou expirado' });
    });
  });
});