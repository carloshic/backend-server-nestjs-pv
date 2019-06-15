import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORM_CONFIG } from './config/servidor.config';
import { AppService } from './app.service';
import { AuthService } from './services/auth.service';
import { EmpresaService } from './services/empresa.service';
import { UsuarioService } from './services/usuario.service';
import { CategoriaService } from './services/categoria.service';
import { MarcaService } from './services/marca.service';
import { ProductoService } from './services/producto.service';
import { UnidadService } from './services/unidad.service';
import { AppController } from './app.controller';
import { AuthController } from './controllers/auth.controller';
import { UploadController } from './controllers/upload.controller';
import { ImagenesController } from './controllers/imagenes.controller';
import { BusquedaController } from './controllers/busqueda.controller';
import { EmpresaController } from './controllers/empresa.controller';
import { UsuarioController } from './controllers/usuario.controller';
import { ProductoController } from './controllers/producto.controller';
import { MarcaController } from './controllers/marca.controller';
import { CategoriaController } from './controllers/categoria.controller';
import { UnidadController } from './controllers/unidad.controller';
import { Usuario } from './entities/usuario.entity';
import { Empresa } from './entities/empresa.entity';
import { Categoria } from './entities/categoria.entity';
import { Marca } from './entities/marca.entity';
import { Unidad } from './entities/unidad.entity';
import { Producto } from './entities/producto.entity';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { ValidadorController } from './controllers/validador.controller';
import { ConfiguracionService } from './services/configuracion.service';
import { ConfiguracionController } from './controllers/configuracion.controller';
import { Configuracion } from './entities/configuracion.entity';
import { Operacion } from './entities/operacion.entity';
import { DetalleOperacion } from './entities/detalle-operacion.entity';
import { TipoOperacion } from './entities/tipo-operacion.entity';
import { Persona } from './entities/persona.entity';
import { Caja } from './entities/caja.entity';
import { OperacionService } from './services/operacion.service';
import { OperacionController } from './controllers/operacion.controller';
import { PersonaController } from './controllers/persona.controller';
import { PersonaService } from './services/persona.service';
import { TipoOperacionService } from './services/tipo-operacion.service';
import { TipoOperacionController } from './controllers/tipo-operacion.controller';
import { InventarioService } from './services/inventario.service';
import { InventarioController } from './controllers/inventario.controller';
import { Inventario } from './entities/inventario.entity';
// ORM Config
// Services
// Controllers 
// Entities
// Middlewares

@Module({
  imports: [
    TypeOrmModule.forRoot(ORM_CONFIG),
    TypeOrmModule.forFeature([Usuario, Empresa, Categoria, Marca, Unidad, Producto,
      Configuracion, Operacion, DetalleOperacion, TipoOperacion, Persona, Caja, Inventario]),
  ],
  controllers: [AppController,
    AuthController,
    UploadController,
    ImagenesController,
    BusquedaController,
    EmpresaController,
    UsuarioController,
    ProductoController,
    MarcaController,
    CategoriaController,
    ProductoController,
    UnidadController,
    ValidadorController,
    ConfiguracionController,
    OperacionController,
    PersonaController,
    TipoOperacionController,
    InventarioController,
  ],
  providers: [
    AppService, ConfiguracionService,AuthService, EmpresaService, UsuarioService, CategoriaService,
    MarcaService, ProductoService, UnidadService,  OperacionService, PersonaService, TipoOperacionService, InventarioService,
  ],
  exports: [ ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer ) {
    consumer.apply(AuthMiddleware).exclude( { path: 'usuario', method: RequestMethod.POST } ).forRoutes(UsuarioController);
    consumer.apply(AuthMiddleware)
    .exclude( { path: 'empresa', method: RequestMethod.POST }, { path: 'empresa', method: RequestMethod.GET } ).forRoutes(EmpresaController);
    consumer.apply(AuthMiddleware).forRoutes(MarcaController);
    consumer.apply(AuthMiddleware).forRoutes(CategoriaController);
    consumer.apply(AuthMiddleware).forRoutes(ProductoController);
    consumer.apply(AuthMiddleware).forRoutes(UnidadController);
    consumer.apply(AuthMiddleware).forRoutes(ConfiguracionController);
    consumer.apply(AuthMiddleware).forRoutes(PersonaController);
    consumer.apply(AuthMiddleware).forRoutes(TipoOperacionController);
    consumer.apply(AuthMiddleware).forRoutes(InventarioController);
  }
}
