# Preentrega

## Arquitectura
La API está organizada en capas:

- `routes`: define los endpoints y los conecta con los controllers.
- `controllers`: recibe `req`, llama al service y responde con `res`.
- `services`: contiene las reglas de negocio.
- `repositories`: abstrae el acceso a los DAO.
- `dao`: consulta y modifica las colecciones mediante los modelos Mongoose.

El flujo de una petición es `router -> controller -> service -> repository -> DAO -> MongoDB`.

Los modelos se encuentran en `src/models`: `service.model.js`, `booking.model.js` y `message.model.js`.
Los servicios de una reserva se guardan como referencias `ObjectId` con su cantidad.

## Instalación
1. Copia `.env.example` a `.env`
2. Completa las variables en `.env`
3. Ejecuta `npm install`
4. Ejecuta `npm start`

## Variables de entorno
- `PORT` — puerto donde corre la app
- `NODE_ENV` — `development` o `production`
- `MONGO_URI` — URI de conexión de MongoDB Atlas

## API de servicios
- `GET /api/services` — devuelve servicios con filtros, paginación y ordenamiento. Ejemplo: `/api/services?category=masajes&available=true&page=1&limit=10&sortBy=price&order=desc`
- `GET /api/services/:sid` — devuelve un servicio por id
- `POST /api/services` — crea un servicio nuevo (no enviar `id` en el body)
- `PUT /api/services/:sid` — actualiza un servicio existente (no modificar `id`)
- `DELETE /api/services/:sid` — elimina un servicio

## Formato de servicio
Cada servicio tiene esta estructura:

```js
{
  id,
  name,
  description,
  duration,
  price,
  category,
  available
}
```
}

## Validación y relaciones
Los bodies, query params e IDs de las rutas se validan con Zod antes de llegar a MongoDB. La validación se aplica al crear y actualizar servicios, crear reservas y agregar servicios a reservas.

Las reservas guardan referencias `ObjectId` a servicios junto con `quantity`. `GET /api/bookings/:bid` usa `populate` para devolver los datos completos de cada servicio relacionado sin guardar el objeto completo dentro de la reserva.

## API de reservas (bookings)
- `POST /api/bookings` — crea una reserva. Body: `clientName`, `clientEmail`, `date`, `time`, `status`, `services` (opcional)
- `GET /api/bookings/:bid` — obtiene una reserva por id
- `POST /api/bookings/:bid/services/:sid` — agrega un servicio a la reserva; si ya existe incrementa `quantity`

## Vistas
- `GET /views/services` — renderiza los servicios almacenados en MongoDB.
- `GET /views/availability` — renderiza servicios y reservas actuales.

## Tiempo real
La aplicación utiliza Socket.io. Cuando se crea o actualiza un servicio mediante la API, el servidor emite un evento para que la vista de servicios se actualice sin recargar.

## Ejecutar
```bash
cp .env.example .env
npm install
npm start
```

Prueba con `curl` o Postman a `http://localhost:3000` (o el puerto que configures).

