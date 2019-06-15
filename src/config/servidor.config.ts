import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Empresa } from '../entities/empresa.entity';
import { Categoria } from '../entities/categoria.entity';
import { Marca } from '../entities/marca.entity';
import { Unidad } from '../entities/unidad.entity';
import { Producto } from '../entities/producto.entity';
import { Configuracion } from '../entities/configuracion.entity';
import { Operacion } from '../entities/operacion.entity';
import { DetalleOperacion } from '../entities/detalle-operacion.entity';
import { TipoOperacion } from '../entities/tipo-operacion.entity';
import { Persona } from '../entities/persona.entity';
import { Caja } from '../entities/caja.entity';
import { Inventario } from '../entities/inventario.entity';
export const ORM_CONFIG: TypeOrmModuleOptions = {
    type : 'postgres',
    host : 'localhost',
    port : 5432,
    username : 'adminpro',
    password : '123456',
    database : 'villapudua',
    entities : [Usuario, Empresa, Categoria, Marca, Unidad, Producto,
        Configuracion, Operacion, DetalleOperacion, TipoOperacion, Persona, Caja, TipoOperacion,Inventario ], //['src/**/*.entity{.ts,.js}'], 
    synchronize : true,
};
