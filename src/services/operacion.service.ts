import { Injectable } from '@nestjs/common';
import { Operacion } from '../entities/operacion.entity';
import { AuthService } from './auth.service';
import { Repository, getConnection, Equal } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OperacionDto } from '../dto/operacion.dto';
import { DetalleOperacion } from '../entities/detalle-operacion.entity';
import { Inventario } from '../entities/inventario.entity';
import { ProductoService } from './producto.service';
import { PersonaService } from './persona.service';
import { TipoOperacionService } from './tipo-operacion.service';

@Injectable()
export class OperacionService {
    constructor(
        @InjectRepository(Operacion)
        private readonly operacionRepo: Repository<Operacion>,
        private authService: AuthService,
        private productoService: ProductoService,
        private personaService: PersonaService,
        private tipoOperacionService: TipoOperacionService,
    ) {}

    async getAll(): Promise<Operacion[]> {

        return await this.operacionRepo.find({
            where: 'Operacion.empresa = 1',
            // relations: ['detalleOperacion'],
            order: {
                id: 'ASC',
            },
        });
    }

    async create( operacionDto: OperacionDto): Promise<Operacion> {
        return new Promise(async (resolve, reject) => {
            const queryRunner = getConnection().createQueryRunner();
            await queryRunner.startTransaction();

            try {
                const operacion: Operacion = new Operacion();
                const detalle: DetalleOperacion[] = [];
                const mensajesStockAgotado: string[] = [];
                operacion.empresa = this.authService.empresaActiva;
                operacion.persona = await this.personaService.getById(operacionDto.personaId);
                operacion.total = operacionDto.total;
                operacion.tipooperacion = await this.tipoOperacionService.getById(operacionDto.tipooperacionId);
                operacion.usuariomodificacion = this.authService.usuarioActivo;

                // GUARDAR ENCABEZADO
                const operacionGuardarda: Operacion = await queryRunner.manager.save(operacion);

                for ( const detalleOperacion of operacionDto.detalleOperacion ) {
                    const det = new DetalleOperacion();
                    const producto = await this.productoService.getById(detalleOperacion.productoId);
                    det.empresa = this.authService.empresaActiva;
                    det.operacion = operacionGuardarda;
                    det.producto = producto;
                    det.cantidad = detalleOperacion.cantidad;
                    det.total = detalleOperacion.total;
                    det.usuariomodificacion = this.authService.usuarioActivo;
                    detalle.push(det);

                    const inventarioAct = await queryRunner.manager
                        .getRepository(Inventario).findOne( { where: {
                            empresa : Equal(this.authService.empresaActiva.id),
                            producto: Equal(detalleOperacion.productoId) },
                        });

                    if ( inventarioAct ) {

                        inventarioAct.stock += detalleOperacion.cantidad * operacion.tipooperacion.naturaleza;

                        if ( inventarioAct.stock < 0) {
                            mensajesStockAgotado.push(`${ inventarioAct.producto.codigo } - ${inventarioAct.producto.nombre}`);
                        }

                        if ( mensajesStockAgotado.length === 0 ) {
                            await queryRunner.manager.save(inventarioAct);
                        }

                    } else {
                        throw new Error(`No se encontro registro de inventario para el producto: ${producto.nombre}`);
                    }
                }

                if ( mensajesStockAgotado.length === 0 ) {

                    // GUARDAR DETALLE
                    const detalleOperacionGuardado: DetalleOperacion[] = await queryRunner.manager.save(detalle);

                    await queryRunner.commitTransaction();
                    await queryRunner.release();
                    resolve(operacionGuardarda);

                } else {
                    let mensaje: string = 'Los productos: <br>';

                    mensajesStockAgotado.forEach(elemento => {
                        mensaje += elemento + '<br>';
                    });
                    mensaje += 'no tienen suficienten stock';

                    throw new Error(mensaje);
                }
            } catch (error) {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
                reject(error);
            }
        });
    }
}
