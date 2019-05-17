import { Controller, Put, Res, Param, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { UsuarioService } from '../services/usuario.service';
import { EmpresaService } from '../services/empresa.service';
import { CResponse } from '../utils/cresponse';
import { Status } from '../utils/status-response';
import { Usuario } from '../entities/usuario.entity';
import { Empresa } from '../entities/empresa.entity';

import * as fs from 'fs-extra';
import { ROOT_APP } from '../global';
import { AuthService } from '../services/auth.service';
import { ProductoService } from '../services/producto.service';
import { Producto } from '../entities/producto.entity';

@Controller('upload')
export class UploadController {
    private token;
    constructor(
        private usuarioService: UsuarioService,
        private empresaService: EmpresaService,
        private productoService: ProductoService,
        private authService: AuthService ) {
            this.token = this.authService.token;
        }
    @Put(':tipo/:id')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
        filename: (req, file, cb) => {
            const randomName = `${req.params.tipo}-${ req.params.id }-${ new Date().getMilliseconds() }${ extname(file.originalname) }`;
            return cb(null, randomName );
        }}),
      }))
    uploadFile(@UploadedFile() file, @Res() response, @Param('tipo') tipo: string, @Param('id') id: number) {

        let pathDestino =  `${ROOT_APP}\\uploads\\${tipo}`;

        if ( !fs.pathExists(pathDestino)) {
            fs.mkdir(pathDestino);
        }
        pathDestino += `\\${file.filename}`;

        fs.moveSync(file.path, pathDestino);

        switch ( tipo ) {
        case 'usuario':
            this.usuarioService.updateImage(file.filename, id)
            .then((usaurio: Usuario) => {
                response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Imagen actualizada correctamente', this.token, usaurio));
            })
            .catch((error) => {
                response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(new CResponse(Status.ERROR, 'Error al actualizar la imagen del usuario', this.token, {}, error));
            });
            break;
        case 'empresa':
            this.empresaService.updateImage(file.filename, id)
            .then((empresa: Empresa) => {
                response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Imagen actualizada correctamente', this.token, empresa));
            })
            .catch((error) => {
                response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(new CResponse(Status.ERROR, 'Error al actualizar el logo de la empresa', this.token, {}, error));
            });
            break;
        case 'producto':
            this.productoService.updateImage(file.filename, id)
            .then((empresa: Producto) => {
                response.status(HttpStatus.OK).json(new CResponse(Status.OK, 'Imagen actualizada correctamente', this.token, empresa));
            })
            .catch((error) => {
                response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(new CResponse(Status.ERROR, 'Error al actualizar la imagen del producto', this.token, {}, error));
            });
            break;
        default:
            return response.status(HttpStatus.BAD_REQUEST).json(new CResponse(Status.ERROR, 'Tipo de imagen no admitida', this.token));
        }
    }
}
