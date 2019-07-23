import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Empresa } from './empresa.entity';
import { TipoOperacion } from './tipo-operacion.entity';
import { Caja } from './caja.entity';
import { Persona } from './persona.entity';
import { DetalleOperacion } from './detalle-operacion.entity';

@Entity()
export class Operacion {

@PrimaryGeneratedColumn()
id: number;

@ManyToOne(type => Empresa, empresa => empresa.id)
empresa: Empresa;

@ManyToOne(type => Persona, persona => persona.id, {
    eager: true,
    nullable: true,
})
persona: Persona;

@Column('decimal', { precision: 8, scale: 2 })
total: number;

@ManyToOne(type => TipoOperacion, operacion => operacion.id,{
    eager: true,
})
tipooperacion: TipoOperacion;

// @OneToMany(type => DetalleOperacion, detalleoperacion => detalleoperacion.operacion, {
//     eager: true,
// })
// detalleOperacion: DetalleOperacion[];

@ManyToOne(type => Caja, caja => caja.id)
caja: Caja;

@UpdateDateColumn()
fechamodificacion: Date;

@ManyToOne(type => Usuario, usuario => usuario.id)
usuariomodificacion: Usuario;

}
