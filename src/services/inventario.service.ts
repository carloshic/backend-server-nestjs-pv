import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventario } from '../entities/inventario.entity';
import { Repository, Equal, DeleteResult, getRepository } from 'typeorm';
import { InventarioDto } from '../dto/inventario.dto';
import { Operacion } from '../entities/operacion.entity';
import { DetalleOperacion } from '../entities/detalle-operacion.entity';
import { TipoOperacionService } from './tipo-operacion.service';
import { TipoOperacion } from '../entities/tipo-operacion.entity';

@Injectable()
export class InventarioService {
    private relaciones = [
        'empresa',
        'producto',
        'usuariomodificacion',
    ];
    constructor(
        private authService: AuthService,
        private tipoOperacionService: TipoOperacionService,
        @InjectRepository(Inventario)
        private readonly inventarioRepo: Repository<Inventario>,
        @InjectRepository(Operacion)
        private readonly operacionRepo: Repository<Operacion>,
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

    async getByProductForSale(codigo: string) { // Promise<Inventario> {
        return await getRepository(Inventario)
        .createQueryBuilder('inventario')
        .innerJoinAndSelect('inventario.producto', 'producto')
        .where('producto.codigo = :codigo', { codigo })
        .andWhere('inventario."empresaId" = :empresa', { empresa: this.authService.empresaActiva.id }).getOne();
    }

    async supply( idInventario: number, inventarioDto: InventarioDto ) {

        const operacion = new Operacion();
        const detalleOperacion = new DetalleOperacion();

        const inventarioActualizar: Inventario =  await this.inventarioRepo.findOne(idInventario);
        const tipoOperacionAbastecimiento: TipoOperacion = await this.tipoOperacionService.getByCode('ABASTECIMIENTO');
        inventarioActualizar.stock += inventarioDto.incremento;
        inventarioActualizar.usuariomodificacion = this.authService.usuarioActivo;

        return await this.inventarioRepo.save(inventarioActualizar);
    }
    async delete(id: number): Promise<DeleteResult> {
        return await this.inventarioRepo.delete(id);
    }
}
