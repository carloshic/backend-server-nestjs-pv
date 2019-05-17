import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Empresa } from '../entities/empresa.entity';
import { EmpresaDto } from '../dto/empresa.dto';
import { UsuarioService } from './usuario.service';

@Injectable()
export class EmpresaService {
    constructor(
        @InjectRepository(Empresa)
        private readonly empresaRepo: Repository<Empresa>,
        private usuarioService: UsuarioService,
    ) {}

    async getAll(): Promise<Empresa[]> {
        return await this.empresaRepo.find(
            {
                relations:
                [
                    'usuarioestatus',
                    'usuariomodificacion',
                ],
            });
    }
    async get(id: number): Promise<Empresa> {
        return await this.empresaRepo.findOne(id, { relations:
            [
                'usuarioestatus',
                'usuariomodificacion',
            ],
        });
    }
    async create(empresa: EmpresaDto): Promise<Empresa> {
        const nuevo = new Empresa();
        nuevo.nombre = empresa.nombre;
        nuevo.rfc = empresa.rfc;
        nuevo.direccion = empresa.direccion;
        nuevo.logo = empresa.logo;
        nuevo.estatus = empresa.estatus;
        nuevo.usuarioestatus = await this.usuarioService.Get(empresa.usuarioEstatus);
        nuevo.usuariomodificacion = await this.usuarioService.Get(empresa.usuarioEstatus);
        return await this.empresaRepo.save(nuevo);

    }
    async update( id: number, empresa: EmpresaDto ): Promise<Empresa> {
        const empresaActualizar = await this.empresaRepo.findOne(id);
        empresaActualizar.nombre = empresa.nombre;
        empresaActualizar.rfc = empresa.rfc;
        empresaActualizar.direccion = empresa.direccion;
        empresaActualizar.logo = empresa.logo;
        empresaActualizar.estatus = empresa.estatus;
        return await this.empresaRepo.save(empresaActualizar);
    }
    async delete(id: number): Promise<DeleteResult> {
        return await this.empresaRepo.delete(id);
    }
    async updateImage(imageName: string, id: number){
        const empresaActualizar = await this.empresaRepo.findOne(id);
        empresaActualizar.logo = imageName;
        return await this.empresaRepo.save(empresaActualizar);
    }
}
