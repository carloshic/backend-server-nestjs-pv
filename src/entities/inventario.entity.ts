import {
    Entity,
    Column,
    ManyToOne,
    UpdateDateColumn,
    OneToOne,
    Unique,
    JoinColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Empresa } from './empresa.entity';
import { Producto } from './producto.entity';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Unique(['producto'])
export class Inventario {

@PrimaryGeneratedColumn()
id: number;

@OneToOne(type => Producto, producto => producto.id)
@JoinColumn()
producto: Producto;

@ManyToOne(type => Empresa, empresa => empresa.id)
empresa: Empresa;

@Column()
stock: number;

@UpdateDateColumn()
fechamodificacion: Date;

@ManyToOne(type => Usuario, usuario => usuario.id)
usuariomodificacion: Usuario;
}
