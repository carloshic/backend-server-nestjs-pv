import { Injectable } from '@nestjs/common';
import { Operacion } from '../entities/operacion.entity';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OperacionService {
    constructor(
        @InjectRepository(Operacion)
        private readonly operacionRepo: Repository<Operacion>,
        private authService: AuthService,
    ) {}

    async getAll(): Promise<Operacion[]> {

        return await this.operacionRepo.find({
            where: 'Operacion.empresa = 1',
            // relations: ['detalleOperacion'],
            order: {
                id: 'ASC',
            },
        });
    }
}
