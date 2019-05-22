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
// ORM Config
// Services
// Controllers
// Entities
// Middlewares

@Module({
  imports: [
    TypeOrmModule.forRoot(ORM_CONFIG),
    TypeOrmModule.forFeature([Usuario, Empresa, Categoria, Marca, Unidad, Producto]),
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
  ],
  providers: [AppService, AuthService, EmpresaService, UsuarioService, CategoriaService, MarcaService, ProductoService, UnidadService],
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
  }
}
