# Preentrega

Proyecto Node.js con ESM que gestiona servicios y reservas usando FileSystem.

## Instalación
1. Copia `.env.example` a `.env`
2. Completa las variables en `.env`
3. Ejecuta `npm install`
4. Ejecuta `npm start`

## Variables de entorno
- `PORT` — puerto donde corre la app
- `NODE_ENV` — `development` o `production`

## API de servicios
- `GET /api/services` — devuelve todos los servicios (acepta `?category=` y `?available=true`)
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

## API de reservas (bookings)
- `POST /api/bookings` — crea una reserva. Body: `clientName`, `clientEmail`, `date`, `time`, `status`, `services` (opcional)
- `GET /api/bookings/:bid` — obtiene una reserva por id
- `POST /api/bookings/:bid/services/:sid` — agrega un servicio a la reserva; si ya existe incrementa `quantity`

## Ejecutar
```bash
cp .env.example .env
npm install
npm start
```

Prueba con `curl` o Postman a `http://localhost:3000` (o el puerto que configures).
```

