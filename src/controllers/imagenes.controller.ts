import { Controller, Get, Res, Param } from '@nestjs/common';
import * as fs from 'fs';
import { ROOT_APP } from '../global';

@Controller('imagenes')
export class ImagenesController {
    @Get('/:tipo/:img')
    getImage(@Res() response, @Param('tipo') tipo: string, @Param('img') img: number) {

        let path = `${ROOT_APP}\\uploads\\${ tipo }\\${ img }`;
        fs.exists(path, existe => {

            if (!existe) {
                path = `${ROOT_APP}\\assets\\no-img.jpg`;
            }

            response.sendFile(path);

        });
    }
}
