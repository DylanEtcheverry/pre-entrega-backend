# Preentrega

Proyecto Node.js con ESM que gestiona servicios a través de `ServiceManager`.

## Instalación
1. Copia `.env.example` a `.env`
2. Completa las variables en `.env`
3. Ejecuta `npm install`
4. Ejecuta `npm start`

## Variables de entorno
- `PORT` — puerto donde corre la app
- `NODE_ENV` — `development` o `production`

## API de servicios
- `GET /services` — devuelve todos los servicios
- `GET /services/:id` — devuelve un servicio por id
- `POST /services` — crea un servicio nuevo
- `PUT /services/:id` — actualiza un servicio existente
- `DELETE /services/:id` — elimina un servicio

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

