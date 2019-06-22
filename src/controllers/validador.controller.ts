
import { Controller, Get, Res, HttpStatus, Param } from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../entities/usuario.entity';
import { CResponse } from '../utils/cresponse';
import { Status } from '../utils/status-response';
import { ProductoService } from '../services/producto.service';
import { Producto } from '../entities/producto.entity';

@Controller('validador')
export class ValidadorController {
    constructor(
        private usuarioService: UsuarioService,
        private productoService: ProductoService,
        ) { }
    @Get(':entidad/:tipo/:valor')
    validar(
        @Res() response,
        @Param('entidad') entidad,
        @Param('tipo') tipo,
        @Param('valor') valor) {
        switch ( entidad ) {
            case 'usuario':
                if ( tipo === 'existe_email' ) {
                    this.usuarioService.getByEmail(valor).then(( usuario: Usuario ) => {

                        if ( usuario ) {
                            response.status(HttpStatus.OK).json({ email_existente: true });
                        } else {
                            response.status(HttpStatus.OK).json(null);
                        }
                    }).catch((error) => {
                        response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json(new CResponse(Status.ERROR, 'Ocurrió un error al realizar la validacion', null, error));
                    });
                } else {
                    response.status(HttpStatus.BAD_REQUEST)
                    .json(new CResponse(Status.ERROR, 'tipo no valido', null, null));
                }
                break;
            case 'producto':
                    if ( tipo === 'existe_codigo' ) {

                        this.productoService.getByCode(valor).then(( producto: Producto ) => {

                            if ( producto ) {
                                response.status(HttpStatus.OK).json({ codigo_existente: true });
                            } else {
                                response.status(HttpStatus.OK).json(null);
                            }
                        }).catch((error) => {
                            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .json(new CResponse(Status.ERROR, 'Ocurrió un error al realizar la validacion', null, error));
                        });
                    } else {
                        response.status(HttpStatus.BAD_REQUEST)
                        .json(new CResponse(Status.ERROR, 'tipo no valido', null, null));
                    }
                    break;
            default:
                    response.status(HttpStatus.BAD_REQUEST)
                    .json(new CResponse(Status.ERROR, 'entidad no valido', null, null));

        }
    }
}
