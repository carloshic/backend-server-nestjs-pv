import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Empresa } from '../entities/empresa.entity';
import { Categoria } from '../entities/categoria.entity';
import { Marca } from '../entities/marca.entity';
import { Unidad } from '../entities/unidad.entity';
import { Producto } from '../entities/producto.entity';
export const ORM_CONFIG: TypeOrmModuleOptions = {
    type : 'postgres',
    host : 'localhost',
    port : 5432,
    username : 'adminpro',
    password : '123456',
    database : 'villapudua',
    entities : [Usuario, Empresa, Categoria, Marca, Unidad, Producto], //['src/**/*.entity{.ts,.js}'], 
    synchronize : true,
};
