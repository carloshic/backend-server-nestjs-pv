import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { OperacionService } from '../services/operacion.service';
import { Operacion } from '../entities/operacion.entity';
import { CResponse } from '../utils/cresponse';
import { AuthService } from '../services/auth.service';
import { Status } from '../utils/status-response';

@Controller('operacion')
export class OperacionController {
    constructor(
        private operacionService: OperacionService,
        private authService: AuthService,
    ) {}
    @Get()
    getAll(@Res() response) {
        this.operacionService.getAll().then(( productos: Operacion[] ) => {
            if ( productos.length > 0 ) {
                response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', this.authService.token, productos));
            } else {
                response.status(HttpStatus.OK).json(new CResponse(Status.NO_RECORDS_FOUND, 'No hay operaciones registradas', this.authService.token));
            }
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Ocurrió un error al obtener el listado de operaciones', this.authService.token, {}, error));
        });
    }
}
