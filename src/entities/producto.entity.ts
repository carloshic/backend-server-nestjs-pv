import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    UpdateDateColumn,
    Unique,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Empresa } from './empresa.entity';
import { Marca } from './marca.entity';
import { Categoria } from './categoria.entity';
import { Unidad } from './unidad.entity';

@Entity()
@Unique(['empresa', 'codigo'])
export class Producto {

@PrimaryGeneratedColumn()
id: number;

@ManyToOne(type => Empresa, empresa => empresa.id)
empresa: Empresa;

@Column()
codigo: string;

@Column()
nombre: string;

@Column()
descripcion: string;

@Column('decimal', { precision: 8, scale: 2 })
costo: number;

@Column('decimal', { precision: 8, scale: 2 })
precio: number;

@ManyToOne(type => Unidad, unidad => unidad.id)
unidad: Unidad;

@Column()
stockminimo: number;

@Column({ nullable: true})
imagen: string;

@ManyToOne(type => Marca, marca => marca.id)
marca: Marca;

@ManyToOne(type => Categoria, categoria => categoria.id)
categoria: Categoria;

@Column()
estatus: boolean;

@ManyToOne(type => Usuario, usuario => usuario.id)
usuarioestatus: Usuario;

@UpdateDateColumn()
fechamodificacion: Date;

@ManyToOne(type => Usuario, usuario => usuario.id)
usuariomodificacion: Usuario;
}
