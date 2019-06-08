import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoOperacion } from '../entities/tipo-operacion.entity';
import { Repository, Equal, DeleteResult } from 'typeorm';
import { AuthService } from './auth.service';
import { TipoOperacionDto } from 'src/dto/tipo-operacion.dto';

@Injectable()
export class TipoOperacionService {
    constructor(
        @InjectRepository(TipoOperacion)
        private readonly tipoOperacionRepo: Repository<TipoOperacion>,
        private authService: AuthService,
    ){}

    async getAll(): Promise<TipoOperacion[]> {
        return await this.tipoOperacionRepo.find( {
            relations: [ 'usuariomodificacion' ],
        } );
    }
    async getById(id: number): Promise<TipoOperacion> {
        return await this.tipoOperacionRepo.findOne(id, { relations: [ 'usuariomodificacion' ] } );
    }

    async getByCode(codigo: string): Promise<TipoOperacion> {
        return await this.tipoOperacionRepo.findOne({ codigo: Equal(codigo) }, {
            relations: [ 'usuariomodificacion' ],
        });
    }
    async create(tipoOperacion: TipoOperacionDto): Promise<TipoOperacion> {
        const nuevaTipoOperacion: TipoOperacion = new TipoOperacion();
        nuevaTipoOperacion.codigo = tipoOperacion.codigo;
        nuevaTipoOperacion.naturaleza = tipoOperacion.naturaleza;
        nuevaTipoOperacion.nombre = tipoOperacion.nombre;
        nuevaTipoOperacion.usuariomodificacion = this.authService.usuarioActivo;
        return await this.tipoOperacionRepo.save(nuevaTipoOperacion);
    }
    async update( id: number, tipoOperacion: TipoOperacionDto ): Promise<TipoOperacion> {
        const tipoOperacionActualizar: TipoOperacion = await this.tipoOperacionRepo.findOne(id);
        tipoOperacionActualizar.codigo = tipoOperacion.codigo;
        tipoOperacionActualizar.naturaleza = tipoOperacion.naturaleza;
        tipoOperacionActualizar.nombre = tipoOperacion.nombre;
        tipoOperacionActualizar.usuariomodificacion = this.authService.usuarioActivo;
        return await this.tipoOperacionRepo.save(tipoOperacionActualizar);
    }
    async delete(id: number): Promise<DeleteResult> {
        return this.tipoOperacionRepo.delete(id);
    }
    async search(term: string) {

        return await this.tipoOperacionRepo
        .find( {
            where: `(LOWER(TipoOperacion.codigo) LIKE '%${term.toLowerCase()}%'
             OR LOWER(TipoOperacion.nombre) LIKE '%${term.toLowerCase()}%')`,
            relations: [ 'usuariomodificacion' ],
        });
    }
}