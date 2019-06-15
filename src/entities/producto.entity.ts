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

@ManyToOne(type => Unidad, unidad => unidad.id, {
    eager: true,
})
unidad: Unidad;

@Column()
stockminimo: number;

@Column({ nullable: true})
imagen: string;

@ManyToOne(type => Marca, marca => marca.id, {
    eager: true,
})
marca: Marca;

@ManyToOne(type => Categoria, categoria => categoria.id, {
    eager: true,
})
categoria: Categoria;

@Column()
estatus: boolean;

@ManyToOne(type => Usuario, usuario => usuario.id, {
    eager: true,
})
usuarioestatus: Usuario;

@UpdateDateColumn()
fechamodificacion: Date;

@ManyToOne(type => Usuario, usuario => usuario.id, {
    eager: true,
})
usuariomodificacion: Usuario;
}
