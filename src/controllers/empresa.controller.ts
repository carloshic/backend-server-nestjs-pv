import { Controller, Get, Res, HttpStatus, Post, Put, Delete, Param, Body, HttpException, UseGuards } from '@nestjs/common';
import { CResponse } from '../utils/cresponse';
import { EmpresaService } from '../services/empresa.service';
import { Empresa } from '../entities/empresa.entity';
import { EmpresaDto } from '../dto/empresa.dto';
import { Status } from '../utils/status-response';
import { AuthService } from '../services/auth.service';

@Controller('empresa')
export class EmpresaController {
    constructor(
        private empresaService: EmpresaService,
        private authService: AuthService,
        ) { }
    @Get()
    getAll(@Res() response) {
        this.empresaService.getAll().then(( empresas: Empresa[] ) => {
            if ( empresas.length > 0 ) {
                response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', null, empresas));
            } else {
                response.status(HttpStatus.OK).json(new CResponse(Status.NOT_FOUND_RECORD, 'No hay empresas registradas'));
            }
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al obtener el listado de empresas', null, {}, error));
        });
    }

    @Get(':id')
    get(@Res() response, @Param('id') id: number ) {
        this.empresaService.get(id).then(( empresa: Empresa ) => {
            if ( empresa ) {
                response.status(HttpStatus.OK)
                .json(new CResponse(Status.OK, 'Exito', null, empresa));
            } else {
                response.status(HttpStatus.OK)
                .json(new CResponse(Status.NOT_FOUND_RECORD, `La empresa con ID: ${  id.toString() } no existe`));
            }
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new CResponse(Status.ERROR, 'Error al obtener la empresa', null, {}, error));
        });
    }

    @Post()
    create(@Body() empresaDto: EmpresaDto, @Res() response) {
        this.empresaService.create(empresaDto).then((empresa) => {
            response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Empresa creada correctamente', this.authService.token, empresa));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al crear la nueva empresa', null, {}, error));
        });
    }

    @Put(':id')
    update(@Body() empresaDto: EmpresaDto, @Res() response, @Param('id') id: number) {
        this.empresaService.update(id, empresaDto).then((empresa) => {
            response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Empresa actualizada con exito', this.authService.token, empresa));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al acutalizar la empresa', null, {}, error));
        });
    }

    @Delete(':id')
    delete(@Res() response, @Param('id') id: number) {
        this.empresaService.delete(id).then((empresa) => {
            response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Empresa borrada con exito'));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al borrar la empresa', this.authService.token , {}, error));
        });
    }
}
