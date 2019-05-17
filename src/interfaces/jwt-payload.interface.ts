import { Usuario } from '../entities/usuario.entity';
import { Empresa } from '../entities/empresa.entity';
export interface IJwtPayload {
    usuario: Usuario;
    empresa: Empresa;
    iat: number;
    exp: number;
}
