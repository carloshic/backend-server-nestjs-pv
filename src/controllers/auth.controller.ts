import { Controller, Post, UseGuards, Res, Body, HttpStatus, forwardRef, Inject } from '@nestjs/common';
import { Usuario } from '../entities/usuario.entity';
import { CResponse } from '../utils/cresponse';
import { Status } from '../utils/status-response';
import { AuthService } from '../services/auth.service';
import { EmpresaService } from '../services/empresa.service';
import { LoginDto } from '../dto/login.dto';
import { UsuarioService } from '../services/usuario.service';
import * as bcrypt from 'bcryptjs';
import { Configuracion } from '../entities/configuracion.entity';
import { ConfiguracionService } from '../services/configuracion.service';
import { ServerResponse } from 'http';

@Controller('auth')
export class AuthController {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService,
        private usuarioService: UsuarioService,
        private empresaService: EmpresaService,
        private configuracionService: ConfiguracionService,
        ) { }
        // LOGIN
    @Post('login')
    public async login(@Res() response, @Body() login: LoginDto) {
        this.usuarioService.getByEmail(login.email).then(async ( usuario: Usuario ) => {
            if ( !usuario ) {
                response.status(HttpStatus.OK)
                .json(new CResponse(Status.ERROR, 'Credenciales Incorrectas', null, null, {message: 'El usuario proporcionado no existe'}));
            } else {

                if ( usuario.estatus) {

                    if ( bcrypt.compareSync(login.password, usuario.password )) {

                        let CONFIG_SESSION_TIMEOUT = 3600;
                        const empresa = await this.empresaService.getById(login.empresaId);

                        if ( empresa ) {
                            const configTimeOut: Configuracion = await this.configuracionService.getByCodeExt('SESSION_TIME_OUT', empresa.id);

                            if ( configTimeOut ) {
                                CONFIG_SESSION_TIMEOUT = Number(configTimeOut.valor);
                            }

                            const token = this.authService.crearToken(empresa, usuario, CONFIG_SESSION_TIMEOUT);

                            return response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', token, {
                                usuario,
                                empresa,
                                menu: [],
                            }));
                        } else {
                            return response.status(HttpStatus.OK)
                            .json(new CResponse(Status.ERROR, 'Credenciales Incorrectas', null, null, {message: 'La empresa no existe'}));
                        }

                    } else {
                        return response.status(HttpStatus.OK)
                            .json(new CResponse(Status.ERROR, 'Credenciales Incorrectas', null, null, {message: 'Por favór verifica tu contraseña'}));
                    }
                } else {
                    return response.status(HttpStatus.OK)
                    .json(new CResponse(Status.ERROR, 'Usuario Inactivo', null, null, { message: 'Por favor contacte al administrador del sistema'}));
                }
            }

        }).catch((error) => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new CResponse( Status.ERROR, 'Error al obtener usuario', null, 
            { message: error.message, stack: error.stack } ));
        });
    }
    @Post('renuevatoken')
    public async renuevaToken(@Res() response, @Body() login: LoginDto) {
        const empresa = await this.empresaService.getById(login.empresaId);
        const usuario = await this.usuarioService.getByEmail(login.email);
        const token = null;// this.authService.crearToken(empresa, usuario);

        return response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Exito', null, {
            token,
        }));
    }
}
