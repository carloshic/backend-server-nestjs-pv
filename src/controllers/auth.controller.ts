import { Controller, Post, UseGuards, Res, Body, HttpStatus, forwardRef, Inject } from '@nestjs/common';
import { Usuario } from '../entities/usuario.entity';
import { CResponse } from '../utils/cresponse';
import { Status } from '../utils/status-response';
import { AuthService } from '../services/auth.service';
import { EmpresaService } from '../services/empresa.service';
import { LoginDto } from '../dto/login.dto';
import { UsuarioService } from '../services/usuario.service';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService,
        private usuarioService: UsuarioService,
        private empresaService: EmpresaService,
        ) {}
        // LOGIN
    @Post('login')
    public async login(@Res() response, @Body() login: LoginDto) {
        this.usuarioService.GetByEmail(login.email).then(async ( usuario: Usuario ) => {
            if ( !usuario ) {
                response.status(HttpStatus.OK).json(new CResponse(Status.NOT_FOUND_RECORD, 'El usuario proporcionado no existe'));
            } else {

                if ( usuario.estatus) {

                    if ( bcrypt.compareSync(login.password, usuario.password )) {

                        const empresa = await this.empresaService.get(login.empresaId);
                        if ( !empresa ) {
                            return response.status(HttpStatus.BAD_REQUEST)
                            .json(new CResponse(Status.ERROR, 'Credenciales Incorrectas', null, {message: 'La empresa no existe'}));
                        }
                        const token = this.authService.crearToken(empresa, usuario);

                        return response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', null, {
                            token,
                            usuario,
                            empresa,
                            menu: [],
                        }));

                    } else {
                        return response.status(HttpStatus.BAD_REQUEST)
                            .json(new CResponse(Status.ERROR, 'Credenciales Incorrectas', null, {message: 'La contraseña es incorrecta'}));
                    }
                } else {
                    return response.status(HttpStatus.BAD_REQUEST)
                    .json(new CResponse(Status.ERROR, 'Usuario Inactivo', null, null, { message: 'Por favor contacte al administrador'}));
                }
            }

        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new CResponse( Status.ERROR, 'Error al obtener usuario', null, error));
        });
    }
    @Post('renuevatoken')
    public async renuevaToken(@Res() response, @Body() login: LoginDto) {
        const empresa = await this.empresaService.get(login.empresaId);
        const usuario = await this.usuarioService.GetByEmail(login.email);
        const token = this.authService.crearToken(empresa, usuario);

        return response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', null, {
            token,
        }));
    }
}
