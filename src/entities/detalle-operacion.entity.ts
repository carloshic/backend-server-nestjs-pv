import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    UpdateDateColumn,
    Unique,
    OneToOne,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Empresa } from './empresa.entity';
import { Operacion } from './operacion.entity';
import { Producto } from './producto.entity';

@Entity()
export class DetalleOperacion {

@PrimaryGeneratedColumn()
id: number;

@ManyToOne(type => Empresa, empresa => empresa.id)
empresa: Empresa;

@ManyToOne(type => Operacion, operacion => operacion.id)
operacion: Operacion;

@OneToOne(type => Producto, producto => producto.id, {
    eager: true,
})
producto: Producto;

@Column()
cantidad: number;

@Column('decimal', { precision: 8, scale: 2 })
total: number;

@UpdateDateColumn()
fechamodificacion: Date;

@ManyToOne(type => Usuario, usuario => usuario.id)
usuariomodificacion: Usuario;
}
