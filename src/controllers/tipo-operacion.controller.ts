import { Controller, Res, Param, Body, Post, Put, Delete, Get, HttpStatus } from '@nestjs/common';
import { TipoOperacion } from '../entities/tipo-operacion.entity';
import { TipoOperacionService } from '../services/tipo-operacion.service';
import { AuthService } from '../services/auth.service';
import { CResponse } from '../utils/cresponse';
import { Status } from '../utils/status-response';
import { TipoOperacionDto } from '../dto/tipo-operacion.dto';

@Controller('tipo-operacion')
export class TipoOperacionController {
    constructor(
        private authService: AuthService,
        private tipoOperacionService: TipoOperacionService,
    ) { }
    @Get()
    getAll(@Res() response) {
        this.tipoOperacionService.getAll().then(( tipoOperaciones: TipoOperacion[] ) => {
            if ( tipoOperaciones.length > 0 ) {
                response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', this.authService.token, tipoOperaciones));
            } else {
                response.status(HttpStatus.OK)
                .json(new CResponse(Status.NO_RECORDS_FOUND, 'No hay tipos de operación registradas', this.authService.token));
            }
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al obtener el listado de tipos de operación', this.authService.token, {}, error));
        });
    }

    @Get(':id')
    get(
        @Res() response,
        @Param('id') id,
    ) {
        this.tipoOperacionService.getById(id).then(( tipoOperacion: TipoOperacion ) => {
            if ( tipoOperacion ) {
                response.status(HttpStatus.OK)
                .json(new CResponse(Status.OK, 'Exito', this.authService.token, tipoOperacion));
            } else {
                response.status(HttpStatus.OK)
                .json(new CResponse(Status.NO_RECORDS_FOUND, `El tipo de operación con ID: ${  id.toString() } no existe`), this.authService.token);
            }
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Ocurrió un error al obtener el tipo de operación', this.authService.token, {}, error));
        });
    }
    @Get('/codigo/:codigo')
    getByCode(
        @Res() response,
        @Param('codigo') codigo,
    ) {
        this.tipoOperacionService.getByCode(codigo).then(( tipoOperacion: TipoOperacion ) => {
            if ( tipoOperacion ) {
                response.status(HttpStatus.OK)
                .json(new CResponse(Status.OK, 'Exito', this.authService.token, tipoOperacion));
            } else {
                response.status(HttpStatus.OK)
                .json(
                    new CResponse(Status.NO_RECORDS_FOUND,
                        `El tipo de operación con codigo: ${  codigo.toString() } no existe`), this.authService.token);
            }
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Ocurrió un error al obtener el tipo de operación', this.authService.token, {}, error));
        });
    }

    @Post()
    create(
        @Body() body: TipoOperacionDto,
        @Res() response,
    ) {
        this.tipoOperacionService.create(body).then((tipoOperacion: TipoOperacion) => {
            response.status(HttpStatus.OK)
            .json(new CResponse(Status.OK, 'Tipo de operación creada correctamente', this.authService.token, tipoOperacion));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Ocurrió un error al crear el tipo de operación', this.authService.token, {}, error));
        });
    }

    @Put(':id')
    update(
        @Body() tipoOperaciondto: TipoOperacionDto,
        @Res() response,
        @Param('id') id,
    ) {
        this.tipoOperacionService.update(id, tipoOperaciondto).then((tipoOperacion: TipoOperacion) => {
            response.status(HttpStatus.OK)
            .json(new CResponse(Status.OK, 'TipoOperacion actualizada con exito', this.authService.token, tipoOperacion));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Ocurrió un error al actualizar el tipo de operación', this.authService.token, {}, error));
        });
    }

    @Delete(':id')
    delete(
        @Res() response,
        @Param('id') id: number,
    )  {
        this.tipoOperacionService.delete(id).then(() => {
            response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Tipo de operación borrada con exito', this.authService.token));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Ocurrió un error al borrar la el tipo de operación', this.authService.token , {}, error));
        });
    }
}
