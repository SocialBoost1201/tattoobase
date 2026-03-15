import { Module } from '@nestjs/common';
import { BookingStateMachineService } from './booking-state-machine.service';
import { RiskEngineService } from './risk-engine.service';

@Module({
    providers: [BookingStateMachineService, RiskEngineService],
    exports: [BookingStateMachineService, RiskEngineService],
})
export class DomainModule { }
