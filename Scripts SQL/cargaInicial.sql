-- Crear la base de datos

CREATE DATABASE villapudua
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Mexico.1252'
    LC_CTYPE = 'Spanish_Mexico.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE villapudua
    IS 'BD Negocios';

GRANT ALL ON DATABASE villapudua TO postgres;

GRANT TEMPORARY, CONNECT ON DATABASE villapudua TO PUBLIC;


-- Crear usuario de aplicacion
CREATE USER adminpro WITH
  LOGIN
  SUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION;
COMMENT ON ROLE adminpro IS 'Usuario para sistema adminpro';

ALTER USER adminpro WITH PASSWORD '123456';
ALTER USER adminpro VALID UNTIL 'infinity';


GRANT ALL ON DATABASE villapudua TO adminpro WITH GRANT OPTION;


-- Iniciar la aplicacion por primera vez antes de ejecutar el siguiente codigo
--Datos minimos para iniciar la aplicaicon.
INSERT INTO USUARIO (email,
nombre,
password,
img,
google,
role,
estatus,
fechamodificacion)
SELECT 'admin@gmail.com','CARLOS','$2a$10$JDXQWdAr/qjNJZTtLxUx.O6UXajE2Onha5pqbGQZxTsIlH7nayXGa','',	false,'ADMIN_ROLE',	true

INSERT INTO public.empresa(
	id, nombre, rfc, direccion, logo, estatus, "usuarioestatusId", "usuariomodificacionId")
	VALUES ('Refaccionaria Cuates', '', '', '', 'A', 1, 1);
	
INSERT INTO public.empresa(
	id, nombre, rfc, direccion, logo, estatus, "usuarioestatusId", "usuariomodificacionId")
	VALUES ('Papeleria Sofia', '', '', '', 'A', 1, 1);


INSERT INTO CONFIGURACION (codigo, valor, "empresaId", "usuariomodificacionId")
SELECT 'PORCENTAJE_UTILIDAD_SUGERIDA', '20', 1, 1

INSERT INTO CONFIGURACION (codigo, valor, "empresaId", "usuariomodificacionId")
SELECT 'SESSION_TIME_OUT', '3600', 1, 1

INSERT INTO CONFIGURACION (codigo, valor, "empresaId", "usuariomodificacionId")
SELECT 'PORCENTAJE_UTILIDAD_SUGERIDA', '20', 2, 1

INSERT INTO CONFIGURACION (codigo, valor, "empresaId", "usuariomodificacionId")
SELECT 'SESSION_TIME_OUT', '3600', 2, 1