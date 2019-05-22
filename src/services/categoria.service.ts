import { Injectable } from '@nestjs/common';
import { Categoria } from '../entities/categoria.entity';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaDto } from 'src/dto/categoria.dto';
import { AuthService } from './auth.service';

@Injectable()
export class CategoriaService {
    private relaciones: string[] = [
        'usuarioestatus',
        'usuariomodificacion',
    ];
    constructor(
        @InjectRepository(Categoria)
        private readonly categoriaRepo: Repository<Categoria>,
        private authService: AuthService,
     ) { }

    async getAll(incluirInactivos = 'false'): Promise<Categoria[]> {
        let strEstatus: string;

        if ( incluirInactivos === 'false' ) {
            strEstatus = ' AND Categoria.estatus = true ';
        } else {
            strEstatus = '';
        }
        return await this.categoriaRepo.find(
            {
                where: `Categoria.empresa = ${this.authService.empresaActiva.id} ${strEstatus}`,
                relations: this.relaciones,
            });
    }
    async getById(id: number): Promise<Categoria> {
        return await this.categoriaRepo.findOne(id, {
            where: `Categoria.empresa = ${this.authService.empresaActiva.id}`,
            relations: this.relaciones,
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

    async search(term: string, incluirInactivos: string) {
        let strEstatus: string;

        if ( incluirInactivos === 'false' ) {
            strEstatus = 'AND Categoria.estatus = true ';
        } else {
            strEstatus = 'AND 1=1';
        }

        return await this.categoriaRepo
        .find( {
            where: `Categoria.empresa = ${this.authService.empresaActiva.id}
             AND (LOWER(Categoria.nombre) LIKE '%${term.toLowerCase()}%'
             OR LOWER(Categoria.descripcion) LIKE '%${term.toLowerCase()}%') ${strEstatus}`,
             relations: this.relaciones,
        });
    }
}
