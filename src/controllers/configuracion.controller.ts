import { Controller, Res, HttpStatus, Param, Get, Post, Body, Put, Delete } from '@nestjs/common';
import { ConfiguracionService } from '../services/configuracion.service';
import { CResponse } from '../utils/cresponse';
import { Status } from '../utils/status-response';
import { AuthService } from '../services/auth.service';
import { Configuracion } from '../entities/configuracion.entity';
import { ConfiguracionDto } from '../dto/configuracion.dto';

@Controller('configuracion')
export class ConfiguracionController {
    constructor(
        private configuracionService: ConfiguracionService,
        private authService: AuthService,
        ) {

    }
    @Get()
    getAll(@Res() response)  {
        this.configuracionService.getAll().then(( configuracions: Configuracion[] ) => {
            if ( configuracions.length > 0 ) {
                response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', this.authService.token, configuracions));
            } else {
                response.status(HttpStatus.OK)
                .json(new CResponse(Status.NO_RECORDS_FOUND, 'No hay configuracions registradas', this.authService.token));
            }
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al obtener el listado de configuraciones', this.authService.token, [], error));
        });
    }

    @Get(':id')
    get(
        @Res() response,
        @Param('id') id,
    ) {
        this.configuracionService.getById(id).then(( configuracion: Configuracion ) => {
            if ( configuracion ) {
                response.status(HttpStatus.OK)
                .json(new CResponse(Status.OK, 'Exito', this.authService.token, configuracion));
            } else {
                response.status(HttpStatus.OK)
                .json(new CResponse(Status.NO_RECORDS_FOUND, `La configuracion con ID: ${  id.toString() } no existe`, this.authService.token));
            }
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al obtener la configuracion', this.authService.token, {}, error));
        });
    }
    @Get('/codigo/:codigo')
    getByName(
        @Res() response,
        @Param('codigo') codigo,
    ) {
        this.configuracionService.getByCode(codigo).then(( configuracion: Configuracion ) => {
            if ( configuracion ) {
                response.status(HttpStatus.OK)
                .json(new CResponse(Status.OK, 'Exito', this.authService.token, configuracion));
            } else {
                response.status(HttpStatus.OK)
                .json(new CResponse(Status.NO_RECORDS_FOUND, `La configuracion con codigo: ${ codigo } no existe`, this.authService.token));
            }
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al obtener la configuracion', this.authService.token, {}, error));
        });
    }

    @Post()
    create(
        @Body() body: ConfiguracionDto,
        @Res() response,
    ) {
        this.configuracionService.create(body).then((configuracion: Configuracion) => {
            response.status(HttpStatus.OK)
            .json(new CResponse(Status.OK, 'configuracion creada correctamente', this.authService.token, configuracion));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al crear la nueva configuracion', this.authService.token, {}, error));
        });
    }

    @Put(':id')
    update(
        @Body() configuraciondto: ConfiguracionDto,
        @Res() response,
        @Param('id') id,
    ) {
        this.configuracionService.update(id, configuraciondto).then((configuracion: Configuracion) => {
            response.status(HttpStatus.OK)
            .json(new CResponse(Status.OK, 'Configuracion actualizada con exito', this.authService.token, configuracion));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al acutalizar la configuracion', this.authService.token, {}, error));
        });
    }

    // @Delete(':id')
    // delete(
    //     @Res() response,
    //     @Param('id') id: number,
    // )  {
    //     this.configuracionService.delete(id).then((configuracion) => {
    //         response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'configuracion borrada con exito'), this.authService.token);
    //     }).catch((error) => {
    //         response.status(HttpStatus.INTERNAL_SERVER_ERROR)
    //         .json(new CResponse(Status.ERROR, 'Error al borrar la configuracion', this.authService.token , {}, error));
    //     });
    // }
}
