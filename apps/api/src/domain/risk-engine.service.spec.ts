import { Test, TestingModule } from '@nestjs/testing';
import { RiskEngineService } from './risk-engine.service';
import { PrismaService } from '../prisma/prisma.service';
import { ReservationDecision, RiskTier } from '@tattoobase/database';

describe('RiskEngineService', () => {
  let service: RiskEngineService;
  let prisma: PrismaService;

  const mockPrismaService = {
    riskEvent: {
      findMany: jest.fn(),
    },
    riskProfile: {
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RiskEngineService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<RiskEngineService>(RiskEngineService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('evaluateRisk', () => {
    it('Low risk user -> ALLOW', async () => {
      // 履歴なし (100点)
      mockPrismaService.riskEvent.findMany.mockResolvedValue([]);
      
      const result = await service.evaluateRisk('user1');
      
      expect(result.tier).toBe(RiskTier.LOW);
      expect(result.score).toBe(100);
      expect(result.decision).toBe(ReservationDecision.ALLOW);
    });

    it('Medium risk user -> REQUIRE_DEPOSIT', async () => {
      // no_show_count=1 (-30) -> 70点
      mockPrismaService.riskEvent.findMany.mockResolvedValue([
        { eventType: 'no_show', occurredAt: new Date() }
      ]);
      
      const result = await service.evaluateRisk('user2');
      
      expect(result.tier).toBe(RiskTier.MEDIUM);
      expect(result.score).toBe(70);
      expect(result.decision).toBe(ReservationDecision.REQUIRE_DEPOSIT);
    });

    it('High risk user -> REQUIRE_APPROVAL', async () => {
      // no_show_count=2 (-60) -> 40点
      mockPrismaService.riskEvent.findMany.mockResolvedValue([
        { eventType: 'no_show', occurredAt: new Date() },
        { eventType: 'no_show', occurredAt: new Date() }
      ]);
      
      const result = await service.evaluateRisk('user3');
      
      expect(result.tier).toBe(RiskTier.HIGH);
      expect(result.score).toBe(40);
      expect(result.decision).toBe(ReservationDecision.REQUIRE_APPROVAL);
    });
  });
});
