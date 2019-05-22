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
    async getAll(incluirInactivos = 'false'): Promise<Unidad[]> {

        let strEstatus: string;

        if ( incluirInactivos === 'false' ) {
            strEstatus = ' Unidad.estatus = true ';
        } else {
            strEstatus = '1=1';
        }
        return await this.unidadRepo.find( {
            where: `${strEstatus}`,
            relations: [ 'usuariomodificacion' ],
        } );
    }
    async getById(id: number): Promise<Unidad> {
        return await this.unidadRepo.findOne(id, { relations: [ 'usuariomodificacion' ] } );
    }
    async create(unidad: UnidadDto): Promise<Unidad> {
        const nuevaUnidad: Unidad = new Unidad();
        nuevaUnidad.codigo = unidad.codigo;
        nuevaUnidad.descripcion = unidad.descripcion;
        nuevaUnidad.estatus = unidad.estatus;
        nuevaUnidad.usuariomodificacion = this.authService.usuarioActivo;
        return await this.unidadRepo.save(nuevaUnidad);
    }
    async update( id: number, unidad: UnidadDto ): Promise<Unidad> {
        const unidadActualizar: Unidad = await this.unidadRepo.findOne(id);
        unidadActualizar.codigo = unidad.codigo;
        unidadActualizar.descripcion = unidad.descripcion;
        unidadActualizar.estatus = unidad.estatus;
        unidadActualizar.usuariomodificacion = this.authService.usuarioActivo;
        return await this.unidadRepo.save(unidadActualizar);
    }
    async delete(id: number): Promise<DeleteResult> {
        return this.unidadRepo.delete(id);
    }
    async search(term: string, incluirInactivos: string) {
        let strEstatus: string;

        if ( incluirInactivos === 'false' ) {
            strEstatus = 'AND Unidad.estatus = true ';
        } else {
            strEstatus = 'AND 1=1';
        }

        return await this.unidadRepo
        .find( {
            where: `(LOWER(Unidad.codigo) LIKE '%${term.toLowerCase()}%'
             OR LOWER(Unidad.descripcion) LIKE '%${term.toLowerCase()}%') ${strEstatus}`,
            relations: [ 'usuariomodificacion' ],
        });
    }
}
