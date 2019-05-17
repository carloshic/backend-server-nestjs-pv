import { Controller, Get, Res, HttpStatus, Post, Put, Delete, Param, Body, Req } from '@nestjs/common';
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
    getAll(@Res() response) {
        this.usuarioService.GetAll().then(( usuarios: Usuario[] ) => {
            response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', this.authService.token, usuarios));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Ocurrió un error al obtener usuarios', this.authService.token, null, error));
        });
    }

    @Get(':id')
    get(
        @Res() response,
        @Param(':id') id,
    ) {
        this.usuarioService.Get(id).then(( usuario: Usuario ) => {
            response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', this.authService.token, usuario));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Ocurrió un error al obtener usuario', this.authService.token, error));
        });
    }

    @Post()
    create(
        @Body() body: UsuarioDto,
        @Res() response,
    ) {
        this.usuarioService.Create(body).then(( usuario: Usuario ) => {
            response.status(HttpStatus.CREATED).json(new CResponse(Status.OK, 'Usuario Creado', null, usuario));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Ocurrió un error al crear usuario', null, error));
        });
    }

    @Put(':id')
    update(
        @Body() usuario: UsuarioDto,
        @Res() response,
        @Param('id') id,
    ) {
        this.usuarioService.Update(id, usuario).then(( usuarioActualizado: Usuario ) => {
            response.status(HttpStatus.CREATED)
            .json(new CResponse(Status.OK, 'Usuario actualizado correctamente ', this.authService.token, usuarioActualizado));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Ocurrió un error actualizar el usuario', this.authService.token, error));
        });
    }

    @Delete(':id')
    delete(
        @Res() response,
        @Param('id') id: number,
    )  {
        this.usuarioService.Delete(id).then(( ) => {
            response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Usuario borrado', this.authService.token));
        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new CResponse(Status.ERROR, 'Ocurrió un error al borrar el usuario', this.authService.token , { }, error));
        });
    }
}
