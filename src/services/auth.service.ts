import { Injectable} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { Usuario } from '../entities/usuario.entity';
import { Empresa } from '../entities/empresa.entity';
import { SEED} from '../config/auth.config';
import { IToken } from '../interfaces/token.interface';

@Injectable()
export class AuthService {

    // tslint:disable-next-line: variable-name
    private _token: IToken;
    // tslint:disable-next-line: variable-name
    private _empresaActiva: Empresa;
    // tslint:disable-next-line: variable-name
    private _usuarioActivo: Usuario;

    crearToken(empresa: Empresa, usuario: Usuario, timeout: number): IToken {
        const CONFIG_SESSION_TIMEOUT = timeout;

        const accessToken = jwt.sign({
            empresa,
            usuario,
         }, SEED, { expiresIn: CONFIG_SESSION_TIMEOUT });

        this._empresaActiva = empresa;
        this._usuarioActivo = usuario;

        this._token = {
            expiresIn: CONFIG_SESSION_TIMEOUT,
            accessToken,
        };
        return this.token;
    }

    verificarToken(token: string, seed: string): Promise<IJwtPayload> | any {
        return new Promise((resolve, reject) => {
            jwt.verify(token, seed, (err: any, payload: IJwtPayload) => {
                if ( !err ) {
                    resolve(payload);
                } else {
                    reject(err);
                }
            });
        });
    }
    get token(): IToken{
        return this._token;
    }

    get empresaActiva(): Empresa {
        return this._empresaActiva;
    }

    get usuarioActivo(): Usuario {
        return this._usuarioActivo;
    }
}
