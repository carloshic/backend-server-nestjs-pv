import { Controller, Res, Param, Body, Post, Put, Delete, Get, HttpStatus } from '@nestjs/common';
import { CategoriaService } from '../services/categoria.service';
import { Categoria } from '../entities/categoria.entity';
import { CResponse } from '../utils/cresponse';
import { Status } from '../utils/status-response';
import { CategoriaDto } from '../dto/categoria.dto';
import { AuthService } from '../services/auth.service';

@Controller('categoria')
export class CategoriaController {
    constructor(
        private categoriaService: CategoriaService,
        private authService: AuthService ) { }

    @Get()
    getAll(@Res() response) {
        this.categoriaService.getAll().then(( categorias: Categoria[] ) => {
            if ( categorias.length > 0 ) {
                response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', this.authService.token, categorias));
            } else {
                response.status(HttpStatus.OK).json(new CResponse(Status.NOT_FOUND_RECORD, 'No hay categorias registradas'));
            }
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al obtener el listado de categorias', this.authService.token, {}, error));
        });
    }

    @Get(':id')
    get(
        @Res() response,
        @Param('id') id,
    ) {
        this.categoriaService.get(id).then(( categoria: Categoria ) => {
            if ( categoria ) {
                response.status(HttpStatus.OK)
                .json(new CResponse(Status.OK, 'Exito', this.authService.token, categoria));
            } else {
                response.status(HttpStatus.OK)
                .json(new CResponse(Status.NOT_FOUND_RECORD, `La categoria con ID: ${  id.toString() } no existe`), this.authService.token);
            }
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al obtener la categoria', this.authService.token, {}, error));
        });
    }

    @Post()
    create(
        @Body() body: CategoriaDto,
        @Res() response,
    ) {
        this.categoriaService.create(body).then((categoria: Categoria) => {
            response.status(HttpStatus.OK)
            .json(new CResponse(Status.OK, 'Categoria creada correctamente', this.authService.token, categoria));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al crear la nueva categoria', this.authService.token, {}, error));
        });
    }

    @Put(':id')
    update(
        @Body() categoriadto: CategoriaDto,
        @Res() response,
        @Param('id') id,
    ) {
        this.categoriaService.update(id, categoriadto).then((categoria) => {
            response.status(HttpStatus.OK)
            .json(new CResponse(Status.OK, 'Categoria actualizada con exito', this.authService.token, categoria));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al acutalizar la categoria', this.authService.token, {}, error));
        });
    }

    @Delete(':id')
    delete(
        @Res() response,
        @Param('id') id: number,
    )  {
        this.categoriaService.delete(id).then((categoria) => {
            response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Categoria borrada con exito'), this.authService.token);
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al borrar la categoria', this.authService.token , {}, error));
        });
    }
}
