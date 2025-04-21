# Backend de Coordinación

Sistema para la optimización de gestión de documentos en el área de coordinación.

## Estructura del proyecto

- `/config`: Configuraciones del sistema, incluida la conexión a la BD
- `/controllers`: Controladores para la lógica de negocio
- `/routes`: Definición de rutas API
- Archivos HTML para vistas

## Requisitos previos

- Node.js (v14+ recomendado)
- MySQL

## Instalación

1. Clonar el repositorio
2. Instalar dependencias: express, mysql2, dotenv y cors
3. Configurar variables de entorno:
- Copiar `.env.example` a un nuevo archivo `.env`
- Editar `.env` con las configuraciones locales
4. Iniciar el servidor con el comando `node app.js`
