import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { SEED, SESSION_TIMEOUT } from '../config/auth.config';
import { CResponse } from '../utils/cresponse';
import { Status } from '../utils/status-response';
import { AuthService } from '../services/auth.service';
import { Configuracion } from '../entities/configuracion.entity';
import { ConfiguracionService } from '../services/configuracion.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private configuracionService: ConfiguracionService,
    ) { }

  async use(request: any, response: any, next: any) {
    if ( !request.headers.authorization ) {
      return response.status(HttpStatus.OK)
      .json(new CResponse(Status.ERROR, 'Autenticacion requerida', null, { }, { message: 'No se recibio el token de autenticacion '}));
    }
    const token: string = request.headers.authorization;

    if ( token.length < 100 ) {
      return response.status(HttpStatus.OK)
      .json(new CResponse(Status.ERROR, 'Autenticacion requerida', null, { }, { message: 'No se recibio el token de autenticacion '}));
    }

    try {
        let CONFIG_BD_SESSION_TIMEOUT = SESSION_TIMEOUT;

        const payload: IJwtPayload = await this.authService.verificarToken(token, SEED);

        const configTimeOut: Configuracion = await this.configuracionService.getByCodeExt('SESSION_TIME_OUT', payload.empresa.id);

        if ( configTimeOut ) {
          CONFIG_BD_SESSION_TIMEOUT = Number(configTimeOut.valor);
        }

        this.authService.crearToken(payload.empresa, payload.usuario, CONFIG_BD_SESSION_TIMEOUT);

        next();

    } catch ( err ) {
      return response.status(HttpStatus.OK)
        .json(new CResponse(Status.SESSION_EXPIRED, 'Error de autenticacion', null, { }, { message: `Token no valido [${ err.message }]` }));
    }

  }
}
