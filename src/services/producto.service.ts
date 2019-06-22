import { Injectable } from '@nestjs/common';
import { Repository, DeleteResult, getConnection, Equal } from 'typeorm';
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
import { Inventario } from '../entities/inventario.entity';
import { InventarioService } from './inventario.service';

@Injectable()
export class ProductoService {
    private readonly relaciones = [
        // 'empresa',
        // 'unidad',
        // 'categoria',
        // 'usuarioestatus',
        // 'marca',
        // 'usuariomodificacion',
    ];
    constructor(
        @InjectRepository(Producto)
        private readonly productoRepo: Repository<Producto>,
        private authService: AuthService,
        private marcaService: MarcaService,
        private categoriaService: CategoriaService,
        private unidadService: UnidadService,
        private inventarioService: InventarioService,
    ) {}
    async getAll(incluirInactivos = 'false'): Promise<Producto[]> {
        let strEstatus: string;

        if ( incluirInactivos === 'false' ) {
            strEstatus = ' AND Producto.estatus = true ';
        } else {
            strEstatus = '';
        }

        return await this.productoRepo.find(
            {
                where: `Producto.empresa = ${this.authService.empresaActiva.id} ${strEstatus}`,
                relations: this.relaciones,
                order: {
                    id: 'ASC',
                },
            });
    }
    async getById(id: number): Promise<Producto> {
        return await this.productoRepo.findOne(id, { where : { empresa: Equal(this.authService.empresaActiva.id) }});
    }

    async getByCode(codigo: string) {
        return await this.productoRepo.findOne({where: {
            empresa: Equal(this.authService.empresaActiva.id),
            codigo,
        }});
    }

    async create(producto: ProductoDto): Promise<Producto> {
         return new Promise(async (resolve, reject) => {
            const queryRunner = getConnection().createQueryRunner();
            await queryRunner.startTransaction();

            try {
                const nuevoProducto: Producto = new Producto();
                const inventario: Inventario = new Inventario();
                nuevoProducto.empresa = this.authService.empresaActiva;
                nuevoProducto.codigo = producto.codigo;
                nuevoProducto.nombre = producto.nombre;
                nuevoProducto.descripcion = producto.descripcion;
                nuevoProducto.costo = producto.costo;
                nuevoProducto.precio = producto.precio;
                nuevoProducto.unidad = await this.unidadService.getById(producto.unidadId);
                nuevoProducto.stockminimo = producto.stockminimo;
                nuevoProducto.marca = await this.marcaService.getById(producto.marcaId);
                nuevoProducto.categoria = await this.categoriaService.getById(producto.categoriaId);
                nuevoProducto.estatus = producto.estatus;
                nuevoProducto.usuarioestatus = this.authService.usuarioActivo;
                nuevoProducto.usuariomodificacion = this.authService.usuarioActivo;

                const productoBD: Producto = await queryRunner.manager.save(nuevoProducto);

                inventario.empresa = this.authService.empresaActiva;
                inventario.producto = productoBD;
                inventario.stock = 0;
                inventario.usuariomodificacion = this.authService.usuarioActivo;

                await queryRunner.manager.getRepository(Inventario).save(inventario);

                await queryRunner.commitTransaction();
                await queryRunner.release();
                resolve(productoBD);
            } catch (error) {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
                reject(error);
            }
        });
    }
    async update( id: number, producto: ProductoDto ): Promise<Producto> {

        const productoActualizar = await this.productoRepo.findOne(id);
        productoActualizar.codigo = producto.codigo;
        productoActualizar.nombre = producto.nombre;
        productoActualizar.descripcion = producto.descripcion;
        productoActualizar.costo = producto.costo;
        productoActualizar.precio = producto.precio;
        productoActualizar.unidad = await this.unidadService.getById(producto.unidadId);
        productoActualizar.stockminimo = producto.stockminimo;
        productoActualizar.marca = await this.marcaService.getById(producto.marcaId);
        productoActualizar.categoria = await this.categoriaService.getById(producto.categoriaId);
        if ( productoActualizar.estatus !== producto.estatus ) {
            productoActualizar.estatus = producto.estatus;
            productoActualizar.usuarioestatus = this.authService.usuarioActivo;

            if ( !producto.estatus ) {
                const inventario: Inventario = await this.inventarioService.getByProductForSale(productoActualizar.codigo);
                if ( inventario.stock > 0) {
                    throw new Error(`El producto no puede ser dado de baja hasta que se agote su stock,
                     actualmente hay en existencia ${ inventario.stock }`);
                }
            }
        }
        productoActualizar.usuariomodificacion = this.authService.usuarioActivo;

        return await this.productoRepo.save(productoActualizar);
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

    async search(term: string, incluirInactivos: string) {

        let strEstatus: string;

        if ( incluirInactivos === 'false' ) {
            strEstatus = 'AND Producto.estatus = true ';
        } else {
            strEstatus = 'AND 1=1';
        }

        return await this.productoRepo
        .find( {
            where: `Producto.empresa = ${this.authService.empresaActiva.id}
             AND (LOWER(Producto.codigo) LIKE '%${term.toLowerCase()}%'
             OR LOWER(Producto.nombre) LIKE '%${term.toLowerCase()}%'
             OR LOWER(Producto.descripcion) LIKE '%${term.toLowerCase()}%') ${strEstatus}`,
            relations: this.relaciones,
        });
    }
}
