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

    async GetAll(): Promise<Usuario[]> {
        return await this.usuarioRepo.find();
    }

    async Get(id: number): Promise<Usuario> {
        return await this.usuarioRepo.findOne(id);
    }

    async GetByEmail(email: string): Promise<Usuario> {
        return await this.usuarioRepo.findOne( { email } );
    }

    async Create(usuario: UsuarioDto): Promise<Usuario> {
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

    async Update(id: number, usuario: UsuarioDto): Promise<Usuario> {
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

    async Delete(id: number) {
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

    async Seach(term: string) {
        return await this.usuarioRepo
        .find( { where: `LOWER(Usuario.email) LIKE '%${term.toLowerCase()}%' OR LOWER(Usuario.nombre) LIKE '%${term.toLowerCase()}%' ` } );
    }
 }
