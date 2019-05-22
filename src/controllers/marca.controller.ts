import { Controller, Res, Param, Body, Post, Put, Delete, Get, HttpStatus, Query } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CResponse } from '../utils/cresponse';
import { Status } from '../utils/status-response';
import { MarcaService } from '../services/marca.service';
import { Marca } from '../entities/marca.entity';
import { MarcaDto } from '../dto/marca.dto';

@Controller('marca')
export class MarcaController {
    constructor(
        private marcaService: MarcaService,
        private authService: AuthService) { }
    @Get()
    getAll(@Res() response, @Query('inactivos') incluirInactivos)  {
        this.marcaService.getAll(incluirInactivos).then(( Marcas: Marca[] ) => {
            if ( Marcas.length > 0 ) {
                response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', this.authService.token, Marcas));
            } else {
                response.status(HttpStatus.OK).json(new CResponse(Status.NOT_FOUND_RECORD, 'No hay marcas registradas'));
            }
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al obtener el listado de marcas', this.authService.token, {}, error));
        });
    }

    @Get(':id')
    get(
        @Res() response,
        @Param('id') id,
    ) {
        this.marcaService.getById(id).then(( marca: Marca ) => {
            if ( marca ) {
                response.status(HttpStatus.OK)
                .json(new CResponse(Status.OK, 'Exito', this.authService.token, marca));
            } else {
                response.status(HttpStatus.OK)
                .json(new CResponse(Status.NOT_FOUND_RECORD, `La marca con ID: ${  id.toString() } no existe`));
            }
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al obtener la marca', this.authService.token, {}, error));
        });
    }

    @Post()
    create(
        @Body() body: MarcaDto,
        @Res() response,
    ) {
        this.marcaService.create(body).then((marca: Marca) => {
            response.status(HttpStatus.OK)
            .json(new CResponse(Status.OK, 'Marca creada correctamente', this.authService.token, marca));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al crear la nueva marca', this.authService.token, {}, error));
        });
    }

    @Put(':id')
    update(
        @Body() Marcadto: MarcaDto,
        @Res() response,
        @Param('id') id,
    ) {
        this.marcaService.update(id, Marcadto).then((marca: Marca) => {
            response.status(HttpStatus.OK)
            .json(new CResponse(Status.OK, 'Marca actualizada con exito', this.authService.token, marca));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al acutalizar la marca', this.authService.token, {}, error));
        });
    }

    @Delete(':id')
    delete(
        @Res() response,
        @Param('id') id: number,
    )  {
        this.marcaService.delete(id).then((marca) => {
            response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Marca borrada con exito'), this.authService.token);
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al borrar la marca', this.authService.token , {}, error));
        });
    }
}
