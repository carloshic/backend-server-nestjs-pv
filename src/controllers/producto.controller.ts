import { Controller, Res, Param, Body, Post, Put, Delete, Get, HttpStatus, Query } from '@nestjs/common';
import { ProductoDto } from '../dto/producto.dto';
import { ProductoService } from '../services/producto.service';
import { CResponse } from '../utils/cresponse';
import { Status } from '../utils/status-response';
import { Producto } from '../entities/producto.entity';
import { AuthService } from '../services/auth.service';

@Controller('producto')
export class ProductoController {
    constructor(
        private authService: AuthService,
        private productService: ProductoService,
        ) { }
    @Get()
    getAll(@Res() response, @Query('inactivos') incluirInactivos ) {
        this.productService.getAll(incluirInactivos).then(( productos: Producto[] ) => {
            if ( productos.length > 0 ) {
                response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', this.authService.token, productos));    
            } else {
                response.status(HttpStatus.OK).json(new CResponse(Status.NO_RECORDS_FOUND, 'No hay productos registradas', this.authService.token));
            }
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Ocurrió un error al obtener el listado de productos', this.authService.token, {},
            { message: error.message, stack: error.stack }));
        });
    }

    @Get(':id')
    get(
        @Res() response,
        @Param('id') id,
    ) {
        this.productService.getById(id).then(( producto: Producto ) => {
            if ( producto ) {
                response.status(HttpStatus.OK)
                .json(new CResponse(Status.OK, 'Exito', this.authService.token, producto));
            } else {
                response.status(HttpStatus.OK)
                .json(new CResponse(Status.NO_RECORDS_FOUND, `El producto con ID: ${  id.toString() } no existe`, this.authService.token));
            }
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al obtener la producto', this.authService.token, {},
            { message: error.message, stack: error.stack }));
        });
    }

    @Get('/codigo/:codigo')
    getByCode(
        @Res() response,
        @Param('codigo') id,
    ) {
        this.productService.getByCode(id).then(( producto: Producto ) => {
            if ( producto ) {
                response.status(HttpStatus.OK)
                .json(new CResponse(Status.OK, 'Exito', this.authService.token, producto));
            } else {
                response.status(HttpStatus.OK)
                .json(new CResponse(Status.NO_RECORDS_FOUND, `El producto con codigo: ${  id.toString() } no existe`, this.authService.token));
            }
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Error al obtener la producto', this.authService.token, {},
            { message: error.message, stack: error.stack }));
        });
    }

    @Post()
    create(
        @Body() body: ProductoDto,
        @Res() response,
    ) {
        this.productService.create(body).then((producto: Producto) => {
            response.status(HttpStatus.OK)
            .json(new CResponse(Status.OK, 'Se creó el producto correctamente', this.authService.token, producto));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Ocurrió un error al crear el nuevo producto', null, this.authService.token,
            { message: error.message, stack: error.stack }));
        });
    }

    @Put(':id')
    update(
        @Body() producto: ProductoDto,
        @Res() response,
        @Param('id') id,
    ) {
        this.productService.update(id, producto).then((marca: Producto) => {
            response.status(HttpStatus.OK)
            .json(new CResponse(Status.OK, 'Se actualizó el producto con exito', this.authService.token, marca));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Ocurrió un error al actualizar el producto', this.authService.token, {},
            { message: error.message, stack: error.stack }));
        });
    }

    @Delete(':id')
    delete(
        @Res() response,
        @Param('id') id: number,
    )  {
        this.productService.delete(id).then(( ) => {
            response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Producto borrado con exito', this.authService.token));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Ocurrió un error al borrar el producto', this.authService.token , { },
            { message: error.message, stack: error.stack }));
        });
    }
}
