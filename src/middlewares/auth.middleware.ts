import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { SEED } from '../config/auth.config';
import * as jwt from 'jsonwebtoken';
import { CResponse } from '../utils/cresponse';
import { Status } from '../utils/status-response';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) { }

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
      const payload: IJwtPayload = await this.authService.verificarToken(token, SEED);

      const tokenRenovado = this.authService.crearToken(payload.empresa, payload.usuario);

      request.token = tokenRenovado;

      next();

    } catch ( err ) {
      return response.status(HttpStatus.OK)
        .json(new CResponse(Status.SESSION_EXPIRED, 'Error de autenticacion', null, { }, { message: `Token no valido [${ err.message }]` }));
    }

  }
}
