import {
    Entity,
    Column,
    ManyToOne,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity()
export class Unidad {

@PrimaryGeneratedColumn()
id: number;

@Column()
codigo: string;

@Column()
descripcion: string;

@UpdateDateColumn()
fechamodificacion: Date;

@ManyToOne(type => Usuario, usuario => usuario.id)
usuariomodificacion: Usuario;
}
