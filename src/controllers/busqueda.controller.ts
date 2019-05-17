import { Controller, Get, Res, Param, HttpStatus } from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { CResponse } from '../utils/cresponse';
import { Status } from '../utils/status-response';
import { Usuario } from '../entities/usuario.entity';
import { AuthService } from '../services/auth.service';
import { ProductoService } from '../services/producto.service';
import { Producto } from 'src/entities/producto.entity';

@Controller('busqueda')
export class BusquedaController {

    constructor(
        private usuarioService: UsuarioService,
        private authService: AuthService,
        private productoService: ProductoService,
        ) { }

    @Get(':tipo/:term')
    search(
        @Res() response,
        @Param('tipo') tipo: string,
        @Param('term') term: string,
    ) {
        switch ( tipo ) {
            case 'usuario':
                this.usuarioService.Seach(term).then(( usuarios: Usuario[] ) => {
                    response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', this.authService.token, usuarios));
                }).catch((error) => {
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json(new CResponse(Status.ERROR, 'Ocurrio un error al buscar usuarios', this.authService.token, {}, error));
                });
                break;
            case 'producto':
                this.productoService.seach(term).then(( productos: Producto[] ) => {
                    response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', this.authService.token, productos));
                }).catch((error) => {
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json(new CResponse(Status.ERROR, 'Ocurrio un error al buscar productos', this.authService.token, {}, error));
                });
                break;
            default:
                return response.status(HttpStatus.BAD_REQUEST)
                .json(new CResponse(Status.ERROR, 'Tipo de busqueda no admitida', this.authService.token));
        }
    }
}
