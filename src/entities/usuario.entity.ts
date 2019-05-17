import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    nombre: string;

    @Column()
    password: string;

    @Column()
    img: string;

    @Column()
    google: boolean;

    @Column()
    role: string;

    @Column()
    estatus: boolean;

    @UpdateDateColumn()
    fechamodificacion: Date;
}
