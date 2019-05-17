import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    UpdateDateColumn,
    Column,
} from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity()
export class TipoOperacion {

@PrimaryGeneratedColumn()
id: number;

@Column()
codigo: string;

@Column()
nombre: string;

@UpdateDateColumn()
fechamodificacion: Date;

@ManyToOne(type => Usuario, usuario => usuario.id)
usuariomodificacion: Usuario;
}
