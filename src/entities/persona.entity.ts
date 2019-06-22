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

@Column( {nullable: true})
nombreempresa: string;

@Column({nullable: true})
direccion: string;

@Column({nullable: true})
telefono: string;

@Column({nullable: true})
correo: string;

@Column({nullable: false})
tipo: string;

@Column({nullable: false})
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

@Column({nullable: false, default: false})
esPersonaVentaPublico: boolean;
}
