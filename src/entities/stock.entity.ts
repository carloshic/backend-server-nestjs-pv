import {
    Entity,
    Column,
    ManyToOne,
    UpdateDateColumn,
    PrimaryColumn,
    OneToOne,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Empresa } from './empresa.entity';
import { Producto } from './producto.entity';

@Entity()
export class Stock {

@PrimaryColumn()
@OneToOne(type => Producto, producto => producto.id)
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
