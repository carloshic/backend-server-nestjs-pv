import {
    Entity,
    Column,
    ManyToOne,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Empresa } from './empresa.entity';

@Entity()
export class Configuracion {

@PrimaryGeneratedColumn()
id: number;

@ManyToOne(type => Empresa, empresa => empresa.id)
empresa: Empresa;

@Column()
codigo: string;

@Column()
descripcion: string;

@UpdateDateColumn()
fechamodificacion: Date;

@ManyToOne(type => Usuario, usuario => usuario.id)
usuariomodificacion: Usuario;
}
