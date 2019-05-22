import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioDto } from '../dto/usuario.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepo: Repository<Usuario>,
    ) {}

    async getAll(incluirInactivos = 'false'): Promise<Usuario[]> {
        let strEstatus: string;

        if ( incluirInactivos === 'false' ) {
            strEstatus = ' Usuario.estatus = true ';
        } else {
            strEstatus = '';
        }

        return await this.usuarioRepo.find({
            where: `${strEstatus}`,
        });
    }

    async getById(id: number): Promise<Usuario> {
        return await this.usuarioRepo.findOne(id);
    }

    async getByEmail(email: string): Promise<Usuario> {
        return await this.usuarioRepo.findOne( { email } );
    }

    async create(usuario: UsuarioDto): Promise<Usuario> {
        const nuevo = new Usuario();
        nuevo.email = usuario.email;
        nuevo.google = usuario.google;
        nuevo.img = usuario.img;
        nuevo.nombre = usuario.nombre;
        nuevo.password = bcrypt.hashSync(usuario.password, 10);
        nuevo.role = usuario.role;
        nuevo.estatus = usuario.estatus;
        return await this.usuarioRepo.save(nuevo);
    }

    async update(id: number, usuario: UsuarioDto): Promise<Usuario> {
        const usuarioActualizar = await this.usuarioRepo.findOne(id);
        usuarioActualizar.email = usuario.email;
        usuarioActualizar.google = usuario.google;
        usuarioActualizar.img = usuario.img;
        usuarioActualizar.nombre = usuario.nombre;
        usuarioActualizar.password = usuario.password;
        usuarioActualizar.estatus = usuario.estatus;
        usuarioActualizar.role = usuario.role;

        return await this.usuarioRepo.save(usuarioActualizar);
    }

    async delete(id: number) {
        return await this.usuarioRepo.delete(id);
    }

    async updateImage(imageName: string, id: number){
        const usuarioActualizar = await this.usuarioRepo.findOne(id);

        if ( usuarioActualizar.img ) {
            const oldPath =  path.resolve('./uploads/usuario/' + usuarioActualizar.img);

            if ( fs.existsSync( oldPath ) ) {
                fs.unlinkSync( oldPath );
            }
        }
        usuarioActualizar.img = imageName;
        return await this.usuarioRepo.save(usuarioActualizar);
    }

    async search(term: string, incluirInactivos: string) {
        let strEstatus: string;
        if ( incluirInactivos === 'false' ) {
            strEstatus = 'AND Usuario.estatus = true ';
        } else {
            strEstatus = '';
        }
        return await this.usuarioRepo
        .find( { where: `(LOWER(Usuario.email) LIKE '%${term.toLowerCase()}%' OR LOWER(Usuario.nombre) LIKE '%${term.toLowerCase()}%')
        ${strEstatus}` } );
    }
 }
