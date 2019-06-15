import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventario } from '../entities/inventario.entity';
import { Repository, Equal, DeleteResult } from 'typeorm';
import { InventarioDto } from 'src/dto/inventario.dto';
import { ProductoService } from './producto.service';

@Injectable()
export class InventarioService {
    private relaciones = [
        'empresa',
        'producto',
        'usuariomodificacion',
    ];
    constructor(
        private authService: AuthService,
        private productoService: ProductoService,
        @InjectRepository(Inventario)
        private readonly inventarioRepo: Repository<Inventario>,
    ) { }

    async getAll(): Promise<Inventario[]> {
        return await this.inventarioRepo.find({
            where : { empresa : Equal(this.authService.empresaActiva.id) },
            relations: this.relaciones,
        });
    }
    async getById(id: number): Promise<Inventario> {
        return await this.inventarioRepo.findOne(id, {
            where : { empresa : Equal(this.authService.empresaActiva.id) },
            relations: this.relaciones,
        });
    }

    async getByCode(codigo: string): Promise<Inventario> {
        return await this.inventarioRepo.findOne({
            where : { empresa : Equal(this.authService.empresaActiva.id), codigo: Equal(codigo) },
            relations: this.relaciones,
        });
    }

    async supply( idInventario: number, inventarioDto: InventarioDto ) {
        const inventarioActualizar: Inventario =  await this.inventarioRepo.findOne(idInventario);
        inventarioActualizar.stock += inventarioDto.incremento;
        inventarioActualizar.usuariomodificacion = this.authService.usuarioActivo;
        return await this.inventarioRepo.save(inventarioActualizar);
    }
    async delete(id: number): Promise<DeleteResult> {
        return await this.inventarioRepo.delete(id);
    }

    // async search(term: string, incluirInactivos: string) {
    //     return await this.inventarioRepo
    //     .find( {
    //         where: `Inventario.empresa = ${this.authService.empresaActiva.id}
    //          AND (LOWER(Inventario.codigo) LIKE '%${term.toLowerCase()}%'
    //          OR LOWER(Inventario.valor) LIKE '%${term.toLowerCase()}%')`,
    //         relations: this.relaciones,
    //     });
    // }

}
