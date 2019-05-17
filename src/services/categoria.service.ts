import { Injectable } from '@nestjs/common';
import { Categoria } from '../entities/categoria.entity';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaDto } from 'src/dto/categoria.dto';
import { AuthService } from './auth.service';

@Injectable()
export class CategoriaService {
    constructor(
        @InjectRepository(Categoria)
        private readonly categoriaRepo: Repository<Categoria>,
        private authService: AuthService,
     ) { }

    async getAll(): Promise<Categoria[]> {
        return await this.categoriaRepo.find(
            {
                where: `Categoria.empresa = ${this.authService.empresaActiva.id}`,
                relations:
                [
                    'usuarioestatus',
                    'usuariomodificacion',
                ],
            });
    }
    async get(id: number): Promise<Categoria> {
        return await this.categoriaRepo.findOne(id, {
            where: `Categoria.empresa = ${this.authService.empresaActiva.id}`,
            relations:
            [
                'usuarioestatus',
                'usuariomodificacion',
            ],
        });
    }
    async create(categoria: CategoriaDto): Promise<Categoria> {
        const nuevaCategoria: Categoria = new Categoria();

        nuevaCategoria.empresa = this.authService.empresaActiva;
        nuevaCategoria.nombre = categoria.nombre;
        nuevaCategoria.descripcion = categoria.descripcion;
        nuevaCategoria.estatus = categoria.estatus;
        nuevaCategoria.usuarioestatus = this.authService.usuarioActivo;
        nuevaCategoria.usuariomodificacion = this.authService.usuarioActivo;
        return await this.categoriaRepo.save(nuevaCategoria);

    }
    async update( id: number, categoria: CategoriaDto ): Promise<Categoria> {
        const categoriaActualizar =  await this.categoriaRepo.findOne(id);
        categoriaActualizar.nombre = categoria.nombre;
        categoriaActualizar.descripcion = categoria.descripcion;

        if ( categoriaActualizar.estatus !== categoria.estatus) {
            categoriaActualizar.estatus = categoria.estatus;
            categoriaActualizar.usuarioestatus = this.authService.usuarioActivo;
        }

        categoriaActualizar.usuariomodificacion = this.authService.usuarioActivo;
        return await this.categoriaRepo.save(categoriaActualizar);
    }
    async delete(id: number): Promise<DeleteResult> {
        return await this.categoriaRepo.delete(id);
    }
}
