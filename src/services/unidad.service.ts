import { Injectable } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { Unidad } from '../entities/unidad.entity';
import { AuthService } from './auth.service';
import { UnidadDto } from 'src/dto/unidad.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UnidadService {
    constructor(
        @InjectRepository(Unidad)
        private readonly unidadRepo: Repository<Unidad>,
        private authService: AuthService,
    ) { }
    async getAll(): Promise<Unidad[]> {
        return await this.unidadRepo.find( { relations: [ 'usuariomodificacion' ] } );
    }
    async get(id: number): Promise<Unidad> {
        return await this.unidadRepo.findOne(id, { relations: [ 'usuariomodificacion' ] } );
    }
    async create(unidad: UnidadDto): Promise<Unidad> {
        const nuevaUnidad: Unidad = new Unidad();
        nuevaUnidad.codigo = unidad.codigo;
        nuevaUnidad.descripcion = unidad.descripcion;
        nuevaUnidad.usuariomodificacion = this.authService.usuarioActivo;
        return await this.unidadRepo.save(nuevaUnidad);
    }
    async update( id: number, unidad: UnidadDto ): Promise<Unidad> {
        const unidadActualizar: Unidad = await this.unidadRepo.findOne(id);
        unidadActualizar.codigo = unidad.codigo;
        unidadActualizar.descripcion = unidad.descripcion;
        unidadActualizar.usuariomodificacion = this.authService.usuarioActivo;
        return await this.unidadRepo.save(unidadActualizar);
    }
    async delete(id: number): Promise<DeleteResult> {
        return this.unidadRepo.delete(id);
    }
}
