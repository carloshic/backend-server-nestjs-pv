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

@Column({default: false})
descripcion: string;

@Column()
estatus: boolean;

@UpdateDateColumn()
fechamodificacion: Date;

@ManyToOne(() => Usuario, usuario => usuario.id)
usuariomodificacion: Usuario;
}
