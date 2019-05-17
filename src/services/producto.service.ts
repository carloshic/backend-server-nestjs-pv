import { Injectable } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { ProductoDto } from '../dto/producto.dto';
import { AuthService } from './auth.service';
import { MarcaService } from './marca.service';
import { CategoriaService } from './categoria.service';
import { UnidadService } from './unidad.service';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { ROOT_APP } from '../global';

@Injectable()
export class ProductoService {
    private readonly relaciones = [
        'empresa',
        'unidad',
        'categoria',
        'usuarioestatus',
        'marca',
        'usuariomodificacion',
    ];
    constructor(
        @InjectRepository(Producto)
        private readonly productoRepo: Repository<Producto>,
        private authService: AuthService,
        private marcaService: MarcaService,
        private categoriaService: CategoriaService,
        private unidadService: UnidadService,
    ) {}
    async getAll(): Promise<Producto[]> {
        return await this.productoRepo.find(
            {
                where: `Producto.empresa = ${this.authService.empresaActiva.id}`,
                relations: this.relaciones,
                order: {
                    id: 'ASC',
                },
            });
    }
    async get(id: number): Promise<Producto> {
        return await this.productoRepo.findOne(id,
            {
                where: `Producto.empresa = ${this.authService.empresaActiva.id}`,
                relations: this.relaciones,
            });
    }
    async create(producto: ProductoDto): Promise<Producto> {
        const nuevoProducto: Producto = new Producto();
        nuevoProducto.empresa = this.authService.empresaActiva;
        nuevoProducto.codigo = producto.codigo;
        nuevoProducto.nombre = producto.nombre;
        nuevoProducto.descripcion = producto.descripcion;
        nuevoProducto.costo = producto.costo;
        nuevoProducto.precio = producto.precio;
        nuevoProducto.unidad = await this.unidadService.get(producto.unidadId);
        nuevoProducto.stockminimo = producto.stockMinimo;
        // nuevoProducto.imagen = producto.imagen;
        nuevoProducto.marca = await this.marcaService.get(producto.marcaId);
        nuevoProducto.categoria = await this.categoriaService.get(producto.categoriaId);
        nuevoProducto.estatus = producto.estatus;
        nuevoProducto.usuarioestatus = this.authService.usuarioActivo;
        nuevoProducto.usuariomodificacion = this.authService.usuarioActivo;
        console.log("LLEGO");
        return await this.productoRepo.save(nuevoProducto);

    }
    async update( id: number, producto: ProductoDto ): Promise<Producto> {

        const nuevoActualizar = await this.productoRepo.findOne(id);
        nuevoActualizar.codigo = producto.codigo;
        nuevoActualizar.nombre = producto.nombre;
        nuevoActualizar.descripcion = producto.descripcion;
        nuevoActualizar.costo = producto.costo;
        nuevoActualizar.precio = producto.precio;
        nuevoActualizar.unidad = await this.unidadService.get(producto.unidadId);
        nuevoActualizar.stockminimo = producto.stockMinimo;
        // nuevoActualizar.imagen = producto.imagen;
        nuevoActualizar.marca = await this.marcaService.get(producto.marcaId);
        nuevoActualizar.categoria = await this.categoriaService.get(producto.categoriaId);
        if ( nuevoActualizar.estatus !== producto.estatus ) {
            nuevoActualizar.estatus = producto.estatus;
            nuevoActualizar.usuarioestatus = this.authService.usuarioActivo;
        }
        nuevoActualizar.usuariomodificacion = this.authService.usuarioActivo;

        return await this.productoRepo.save(nuevoActualizar);
    }
    async delete(id: number): Promise<DeleteResult> {
        return await this.productoRepo.delete(id);
    }

    async updateImage(imageName: string, id: number) {
        const productoActualizar = await this.productoRepo.findOne(id);

        if ( productoActualizar.imagen ) {
            const oldPath =  path.resolve(ROOT_APP + '/uploads/producto/' + productoActualizar.imagen);

            if ( fs.existsSync( oldPath ) ) {
                fs.unlinkSync( oldPath );
            }
        }
        productoActualizar.imagen = imageName;
        return await this.productoRepo.save(productoActualizar);
    }

    async seach(term: string) {
        return await this.productoRepo
        .find( {
            where: `LOWER(Producto.codigo) LIKE '%${term.toLowerCase()}%'
             OR LOWER(Producto.nombre) LIKE '%${term.toLowerCase()}%'
             OR LOWER(Producto.descripcion) LIKE '%${term.toLowerCase()}%' `,
            relations: this.relaciones,
        });
    }
}
