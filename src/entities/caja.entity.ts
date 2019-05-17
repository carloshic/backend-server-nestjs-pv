import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    UpdateDateColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Empresa } from './empresa.entity';

@Entity()
export class Caja {

@PrimaryGeneratedColumn()
id: number;

@UpdateDateColumn()
fechamodificacion: Date;

@ManyToOne(type => Empresa, empresa => empresa.id)
empresa: Empresa;

@ManyToOne(type => Usuario, usuario => usuario.id)
usuariomodificacion: Usuario;
}
