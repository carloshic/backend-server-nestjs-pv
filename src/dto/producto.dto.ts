export class ProductoDto {
    constructor(
        public codigo: string,
        public nombre: string,
        public descripcion: string,
        public costo: number,
        public precio: number,
        public unidadId: number,
        public stockMinimo: number,
        public marcaId: number,
        public categoriaId: number,
        public estatus: boolean,
    ) { }
}
