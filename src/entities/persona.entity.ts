import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    UpdateDateColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Empresa } from './empresa.entity';

@Entity()
export class Persona {

@PrimaryGeneratedColumn()
id: number;

@ManyToOne(type => Empresa, empresa => empresa.id)
empresa: Empresa;

@Column()
nombre: string;

@Column()
nombreempresa: string;

@Column()
direccion: string;

@Column()
telefono: string;

@Column()
correo: string;

@Column()
tipo: string;

@Column()
estatus: boolean;

@ManyToOne(type => Usuario, usuario => usuario.id)
usuarioestatus: Usuario;

@UpdateDateColumn()
fechamodificacion: Date;

@ManyToOne(type => Usuario, usuario => usuario.id)
usuariomodificacion: Usuario;
}
