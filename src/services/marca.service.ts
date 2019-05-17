import { Injectable } from '@nestjs/common';
import { Marca } from '../entities/marca.entity';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MarcaDto } from '../dto/marca.dto';
import { AuthService } from './auth.service';

@Injectable()
export class MarcaService {
    constructor(
        @InjectRepository(Marca)
        private readonly marcaRepo: Repository<Marca>,
        private authService: AuthService,
     ) { }

    async getAll(): Promise<Marca[]> {
        return await this.marcaRepo.find(
            {
                where: `Marca.empresa = ${this.authService.empresaActiva.id}`,
                relations:
                [
                    'empresa',
                    'usuarioestatus',
                    'usuariomodificacion',
                ],
            });
    }
    async get(id: number): Promise<Marca> {
        return await this.marcaRepo.findOne(id, {
            where: `Marca.empresa = ${this.authService.empresaActiva.id}`,
            relations: [
                'empresa',
                'usuarioestatus',
                'usuariomodificacion',
            ],
        });
    }
    async create(marca: MarcaDto): Promise<Marca> {
        const nuevamarca: Marca = new Marca();

        nuevamarca.empresa = this.authService.empresaActiva;
        nuevamarca.nombre = marca.nombre;
        nuevamarca.descripcion = marca.descripcion;
        nuevamarca.estatus = marca.estatus;
        nuevamarca.usuarioestatus = this.authService.usuarioActivo;
        nuevamarca.usuariomodificacion = this.authService.usuarioActivo;
        return await this.marcaRepo.save(nuevamarca);

    }
    async update( id: number, marca: MarcaDto ): Promise<Marca> {
        const marcaActualizar: Marca =  await this.marcaRepo.findOne(id);
        marcaActualizar.nombre = marca.nombre;
        marcaActualizar.descripcion = marca.descripcion;

        if ( marcaActualizar.estatus !== marca.estatus) {
            marcaActualizar.estatus = marca.estatus;
            marcaActualizar.usuarioestatus = this.authService.usuarioActivo;
        }

        marcaActualizar.usuariomodificacion = this.authService.usuarioActivo;
        return await this.marcaRepo.save(marcaActualizar);
    }
    async delete(id: number): Promise<DeleteResult> {
        return await this.marcaRepo.delete(id);
    }
}