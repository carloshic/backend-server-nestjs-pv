import { Controller, Get, Res, HttpStatus, Post, Put, Delete, Param, Body, Req, Query } from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { CResponse } from '../utils/cresponse';
import { Usuario } from '../entities/usuario.entity';
import { UsuarioDto } from '../dto/usuario.dto';
import { Status } from '../utils/status-response';
import { AuthService } from '../services/auth.service';

@Controller('usuario')
export class UsuarioController {
    constructor(
        private usuarioService: UsuarioService,
        private authService: AuthService,
        ) { }

    @Get()
    getAll(@Res() response, @Query('inactivos') incluirInactivos) {
        this.usuarioService.getAll(incluirInactivos).then(( usuarios: Usuario[] ) => {
            response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', this.authService.token, usuarios));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Ocurrió un error al obtener usuarios', this.authService.token, [], error));
        });
    }

    @Get('/existe_email/:email')
    validarExisteUsuario(
        @Res() response,
        @Param('email') email,
    ) {
        this.usuarioService.getByEmail(email).then(( usuario: Usuario ) => {
            if ( usuario ) {
                response.status(HttpStatus.OK).json({ email_existente: true });
            } else {
                response.status(HttpStatus.OK).json(null);
            }
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Ocurrió un error al obtener usuario', this.authService.token, {},
            { message: error.message, stack: error.stack }));
        });
    }

    @Get(':id')
    get(
        @Res() response,
        @Param('id') id,
    ) {
        this.usuarioService.getById(id).then(( usuario: Usuario ) => {
            response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', this.authService.token, usuario));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Ocurrió un error al obtener usuario', this.authService.token, {},
            { message: error.message, stack: error.stack }));
        });
    }

    @Post()
    create(
        @Body() body: UsuarioDto,
        @Res() response,
    ) {
        this.usuarioService.create(body).then(( usuario: Usuario ) => {
            response.status(HttpStatus.CREATED).json(new CResponse(Status.OK, 'Usuario Creado', null, usuario));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Ocurrió un error al crear usuario', null, null, { message: error.message, stack: error.stack }));
        });
    }

    @Put(':id')
    update(
        @Body() usuario: UsuarioDto,
        @Res() response,
        @Param('id') id,
    ) {
        this.usuarioService.update(id, usuario).then(( usuarioActualizado: Usuario ) => {
            response.status(HttpStatus.CREATED)
            .json(new CResponse(Status.OK, 'Usuario actualizado correctamente ', this.authService.token, usuarioActualizado));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Ocurrió un error actualizar el usuario', this.authService.token, {},
            { message: error.message, stack: error.stack }));
        });
    }

    @Delete(':id')
    delete(
        @Res() response,
        @Param('id') id: number,
    )  {
        this.usuarioService.delete(id).then(( ) => {
            response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Usuario borrado', this.authService.token));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Ocurrió un error al borrar el usuario', this.authService.token , { },
            { message: error.message, stack: error.stack }));
        });
    }
}
