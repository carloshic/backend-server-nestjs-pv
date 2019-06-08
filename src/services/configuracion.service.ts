import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Configuracion } from '../entities/configuracion.entity';
import { AuthService } from './auth.service';
import { Repository, DeleteResult, Equal } from 'typeorm';
import { ConfiguracionDto } from 'src/dto/configuracion.dto';

@Injectable()
export class ConfiguracionService {
    private relaciones = [
        'empresa',
        'usuariomodificacion',
    ];
    constructor(
        @InjectRepository(Configuracion)
        private readonly configuracionRepo: Repository<Configuracion>,
        private authService: AuthService,
    ) { }

    async getAll(): Promise<Configuracion[]> {
        return await this.configuracionRepo.find({
            where : { empresa : Equal(this.authService.empresaActiva.id) },
            relations: this.relaciones,
        });
    }
    async getById(id: number): Promise<Configuracion> {
        return await this.configuracionRepo.findOne(id, {
            where : { empresa : Equal(this.authService.empresaActiva.id) },
            relations: this.relaciones,
        });
    }

    async getByCode(codigo: string): Promise<Configuracion> {
        return await this.configuracionRepo.findOne({
            where : { empresa : Equal(this.authService.empresaActiva.id), codigo: Equal(codigo) },
            relations: this.relaciones,
        });
    }
    async create(configuracion: ConfiguracionDto): Promise<Configuracion> {
        const nuevaConfiguracion: Configuracion = new Configuracion();

        nuevaConfiguracion.empresa = this.authService.empresaActiva;
        nuevaConfiguracion.codigo = configuracion.codigo;
        nuevaConfiguracion.valor = configuracion.valor;
        nuevaConfiguracion.usuariomodificacion = this.authService.usuarioActivo;
        return await this.configuracionRepo.save(nuevaConfiguracion);

    }
    async update( id: number, configuracion: ConfiguracionDto ): Promise<Configuracion> {
        const ConfiguracionActualizar: Configuracion =  await this.configuracionRepo.findOne(id);
        ConfiguracionActualizar.codigo = configuracion.codigo;
        ConfiguracionActualizar.valor = configuracion.valor;
        ConfiguracionActualizar.usuariomodificacion = this.authService.usuarioActivo;
        return await this.configuracionRepo.save(ConfiguracionActualizar);
    }
    async delete(id: number): Promise<DeleteResult> {
        return await this.configuracionRepo.delete(id);
    }

    async search(term: string, incluirInactivos: string) {
        return await this.configuracionRepo
        .find( {
            where: `Configuracion.empresa = ${this.authService.empresaActiva.id}
             AND (LOWER(Configuracion.codigo) LIKE '%${term.toLowerCase()}%'
             OR LOWER(Configuracion.valor) LIKE '%${term.toLowerCase()}%')`,
            relations: this.relaciones,
        });
    }
}
