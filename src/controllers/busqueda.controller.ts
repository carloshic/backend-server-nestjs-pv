import { Controller, Get, Res, Param, HttpStatus, Query } from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { CResponse } from '../utils/cresponse';
import { Status } from '../utils/status-response';
import { Usuario } from '../entities/usuario.entity';
import { AuthService } from '../services/auth.service';
import { ProductoService } from '../services/producto.service';
import { Producto } from '../entities/producto.entity';
import { MarcaService } from '../services/marca.service';
import { Marca } from '../entities/marca.entity';
import { Categoria } from '../entities/categoria.entity';
import { CategoriaService } from '../services/categoria.service';
import { UnidadService } from '../services/unidad.service';
import { Unidad } from '../entities/unidad.entity';
import { ConfiguracionService } from '../services/configuracion.service';
import { Configuracion } from '../entities/configuracion.entity';

@Controller('busqueda')
export class BusquedaController {

    constructor(
        private usuarioService: UsuarioService,
        private authService: AuthService,
        private productoService: ProductoService,
        private marcaService: MarcaService,
        private categoriaService: CategoriaService,
        private unidadService: UnidadService,
        private configuracionService: ConfiguracionService,
        ) { }

    @Get(':tipo/:term')
    search(
        @Res() response,
        @Param('tipo') tipo: string,
        @Param('term') term: string,
        @Query('inactivos') incluirInactivos,
    ) {

        switch ( tipo ) {
            case 'usuario':
                this.usuarioService.search(term, incluirInactivos).then(( usuarios: Usuario[] ) => {
                    response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', this.authService.token, usuarios));
                }).catch((error) => {
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json(new CResponse(Status.ERROR, 'Ocurrió un error al buscar usuarios', this.authService.token, {}, error));
                });
                break;
            case 'producto':
                this.productoService.search(term, incluirInactivos).then(( productos: Producto[] ) => {
                    response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', this.authService.token, productos));
                }).catch((error) => {
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json(new CResponse(Status.ERROR, 'Ocurrió un error al buscar productos', this.authService.token, {}, error));
                });
                break;
            case 'unidad':
                this.unidadService.search(term, incluirInactivos).then(( unidades: Unidad[] ) => {
                    response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', this.authService.token, unidades));
                }).catch((error) => {
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json(new CResponse(Status.ERROR, 'Ocurrió un error al buscar unidades', this.authService.token, {}, error));
                });
                break;
            case 'marca':
                this.marcaService.search(term, incluirInactivos).then(( marcas: Marca[] ) => {
                    response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', this.authService.token, marcas));
                }).catch((error) => {
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json(new CResponse(Status.ERROR, 'Ocurrió un error al intentar buscar marcas', this.authService.token, {}, error));
                });
                break;
            case 'categoria':
                this.categoriaService.search(term, incluirInactivos).then(( categorias: Categoria[] ) => {
                    response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', this.authService.token, categorias));
                }).catch((error) => {
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json(new CResponse(Status.ERROR, 'Ocurrió un error al intentar buscar categorias', this.authService.token, {}, error));
                });
                case 'configuracion':
                    this.configuracionService.search(term, incluirInactivos).then(( configuraciones: Configuracion[] ) => {
                        response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', this.authService.token, configuraciones));
                    }).catch((error) => {
                        response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json(new CResponse(Status.ERROR, 'Ocurrió un error al intentar buscar configuraciones', this.authService.token, {}, error));
                    });
                    break;
            default:
                return response.status(HttpStatus.BAD_REQUEST)
                .json(new CResponse(Status.ERROR, 'Tipo de busqueda no admitida', this.authService.token));
        }
    }
}
