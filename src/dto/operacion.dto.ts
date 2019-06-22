import { DetalleOperacionDto } from './detalle-operacion.dto';

export class OperacionDto {
    public readonly personaId: number;
    public readonly total: number;
    public readonly tipooperacionId: number;
    public readonly detalleOperacion: DetalleOperacionDto [];
}
