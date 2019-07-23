import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Persona } from '../entities/persona.entity';
import { Repository, DeleteResult, Not, Equal } from 'typeorm';
import { AuthService } from './auth.service';
import { PersonaDto } from 'src/dto/persona.dto';

@Injectable()
export class PersonaService {
    private relaciones: string [] = [
        'empresa',
        'usuarioestatus',
        'usuariomodificacion',
    ];
    constructor(
        @InjectRepository(Persona)
        private readonly personaRepo: Repository<Persona>,
        private authService: AuthService,
     ) { }

    async getAll(incluirInactivos = 'false'): Promise<Persona[]> {
        let strEstatus: string;
        if ( incluirInactivos === 'false') {
            strEstatus = ' AND Persona.estatus = true ';
        } else {
            strEstatus = '';
        }

        return await this.personaRepo.find(
        {
            where: `Persona.empresa = ${this.authService.empresaActiva.id} ${strEstatus}`,
            relations: this.relaciones,
            order: {
                id: 'ASC',
            },
        });
    }
    async getById(id: number): Promise<Persona> {
        return await this.personaRepo.findOne(id, {
            where: `Persona.empresa = ${this.authService.empresaActiva.id}`,
            relations: this.relaciones,
        });
    }

    async getPersonaDefaultVenta(): Promise<Persona> {
        return await this.personaRepo.findOne({
            where: { empresa: Equal(this.authService.empresaActiva.id), esPersonaVentaPublico: Equal(true) },
            relations: this.relaciones,
        });
    }
    async create(persona: PersonaDto): Promise<Persona> {

        if ( persona.esPersonaVentaPublico ) {
            const [ personaVEntaPublico, conteo ] = await this.personaRepo.findAndCount({
                where: {
                    empresa: Equal(this.authService.empresaActiva.id),
                    esPersonaVentaPublico: true ,
                },
            });

            if ( conteo >= 1 ) {
                throw new Error(`Solo puede haber una persona que represente las ventas al publico, ya existe ${personaVEntaPublico[0].nombre}`);
            }
        }

        const nuevaPersona: Persona = new Persona();
        nuevaPersona.empresa = this.authService.empresaActiva;
        nuevaPersona.nombre = persona.nombre;
        nuevaPersona.nombreempresa = persona.nombreempresa;
        nuevaPersona.direccion = persona.direccion;
        nuevaPersona.telefono = persona.telefono;
        nuevaPersona.correo = persona.correo;
        nuevaPersona.tipo = persona.tipo;
        nuevaPersona.estatus = persona.estatus;
        nuevaPersona.usuarioestatus = this.authService.usuarioActivo;
        nuevaPersona.usuariomodificacion = this.authService.usuarioActivo;
        nuevaPersona.esPersonaVentaPublico = persona.esPersonaVentaPublico;

        return await this.personaRepo.save(nuevaPersona);

    }
    async update( id: number, persona: PersonaDto ): Promise<Persona> {
        if ( persona.esPersonaVentaPublico ) {
            const [ personaVEntaPublico, conteo ] = await this.personaRepo.findAndCount({
                where: {
                    empresa: Equal(this.authService.empresaActiva.id),
                    esPersonaVentaPublico: true,
                    id: Not(id),
                 },
            });

            if ( conteo >= 1 ) {
                throw new Error(`Solo puede haber una persona que represente las ventas al publico, ya existe ${personaVEntaPublico[0].nombre}`);
            }
        }


        const personaActualizar: Persona =  await this.personaRepo.findOne(id);
        personaActualizar.empresa = this.authService.empresaActiva;
        personaActualizar.nombre = persona.nombre;
        personaActualizar.nombreempresa = persona.nombreempresa;
        personaActualizar.direccion = persona.direccion;
        personaActualizar.telefono = persona.telefono;
        personaActualizar.correo = persona.correo;
        personaActualizar.tipo = persona.tipo;
        if ( personaActualizar.estatus !== persona.estatus) {
            personaActualizar.estatus = persona.estatus;
            personaActualizar.usuarioestatus = this.authService.usuarioActivo;
        }
        personaActualizar.usuarioestatus = this.authService.usuarioActivo;
        personaActualizar.usuariomodificacion = this.authService.usuarioActivo;
        personaActualizar.esPersonaVentaPublico = persona.esPersonaVentaPublico;
        return await this.personaRepo.save(personaActualizar);
    }
    async delete(id: number): Promise<DeleteResult> {
        return await this.personaRepo.delete(id);
    }

    async search(term: string, incluirInactivos: string) {
        let strEstatus: string;

        if ( incluirInactivos === 'false' ) {
            strEstatus = 'AND Persona.estatus = true ';
        } else {
            strEstatus = 'AND 1=1';
        }

        return await this.personaRepo
        .find( {
            where: `Persona.empresa = ${this.authService.empresaActiva.id}
             AND (LOWER(Persona.nombre) LIKE '%${term.toLowerCase()}%'
             OR LOWER(Persona.nombreempresa) LIKE '%${term.toLowerCase()}%') ${strEstatus}`,
            relations: this.relaciones,
        });
    }
}
