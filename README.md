# GrownupsVet frontend

> Arquitectura acordada, estado real y próximos pasos: [docs/ESTADO-IMPLEMENTACION.md](./docs/ESTADO-IMPLEMENTACION.md).

Monorepo de GrownupsVet. El producto del propietario se entregará como app móvil nativa para iOS y Android con Expo/React Native. Las pantallas web servidas por TanStack Start en `/` son un prototipo independiente: no son la app Expo ni se reutilizan directamente en ella. El portal administrativo queda fuera del alcance actual.

El backend compartido es [grownupsvet-backend](https://github.com/Estebangmz666/grownupsvet-backend) (Spring Boot 4.1.1). El prototipo web actual usa datos locales y no está conectado al backend. El cliente API incluye tipos y fetchers preparados; su compatibilidad con OpenAPI y su integración incremental siguen pendientes.

## Estructura del monorepo

```
grownupsvet-frontend/
  package.json                    workspaces: apps/*, packages/*
  apps/
    propietario/src/screens/      pantallas web de demostración; no son React Native
    propietario/src/navigation/   navegación web de demostración
    propietario/src/components/   componentes web de demostración
    administrativo/                reservado para una fase futura
  packages/
    ui/                            primitivas web basadas en Radix UI; no son React Native
    api-client/                    contratos TypeScript y fetchers HTTP
    accessibility-kit/             helpers web/ARIA; requieren adaptación para uso nativo
  src/
    routes/                        host web de demostración TanStack Start: propietario en /
    styles.css                     tokens globales y temas
  App.tsx                          entrada Expo existente (aún muestra la pantalla de ejemplo)
```

`src/routes/index.tsx` es un host web que renderiza `PropietarioApp`. Esta superficie sirve como prototipo y no debe considerarse avance de implementación nativa. La entrada Expo real está en `App.tsx` en la raíz y todavía muestra la pantalla inicial de ejemplo.

Los alias cortos actuales (`@propietario/*`, `@ui/*`, `@api-client/*`, etc.) son transitorios; el objetivo es unificar los imports de workspaces bajo `@grownupsvet/*`.

## `packages/api-client`

Paquete candidato a compartirse entre superficies, con contratos TypeScript, configuración de URL base/token y fetchers preparados. No se configura ni se invoca desde la interfaz actual; no hay llamadas al backend. Antes de integrar, hay que verificar los contratos contra OpenAPI y adaptar la persistencia de sesión al runtime nativo.

| Archivo               | Contenido                                                                              |
| --------------------- | -------------------------------------------------------------------------------------- |
| `types.ts`            | Contratos compartidos `UserProfile`, `Pet`, `Appointment`, `Species`, `Sex`, `AppView` |
| `client.ts`           | Configuración, bearer token y errores tipados `ApiError`                               |
| `auth.api.ts`         | Registro, login, logout y recuperación de contraseña                                   |
| `pets.api.ts`         | Listar, crear, editar y archivar mascotas                                              |
| `appointments.api.ts` | Listar, solicitar, cancelar y consultar eventos de citas                               |
| `availability.api.ts` | Consulta de turnos disponibles                                                         |

### Endpoints documentados en el repositorio

La tabla describe endpoints del backend, no fetchers ya implementados ni contratos verificados en esta rama.

| Función                    | Endpoint                                                                                            |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| Registro                   | `POST /api/v1/auth/registrations`                                                                   |
| Login                      | `POST /api/v1/auth/sessions`                                                                        |
| Logout                     | `DELETE /api/v1/auth/sessions/current`                                                              |
| Recuperación de contraseña | `POST /api/v1/auth/password-recoveries` → `.../verifications` → `POST /api/v1/auth/password-resets` |
| Perfil propio              | `GET` / `PATCH /api/v1/users/me` (solo `phoneNumber` editable; fetcher pendiente en esta rama)       |
| Foto de perfil             | `GET` / `PUT` / `DELETE /api/v1/users/me/profile/photo` (fetchers pendientes en esta rama)           |
| Mascotas                   | `POST /api/v1/pets`, `GET /api/v1/pets`, `GET`/`PATCH /api/v1/pets/{petId}`                         |

### Endpoints de citas y disponibilidad

Los fetchers correspondientes están en `appointments.api.ts` y `availability.api.ts`:

| Función                   | Endpoint                                                          | Notas                                                                                                                                                              |
| ------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Ver turnos disponibles    | `GET /api/v1/availability-slots?from&to&veterinarianId&page&size` | Ventana: desde mañana hasta 60 días; excluye turnos ya ocupados                                                                                                    |
| Solicitar cita            | `POST /api/v1/appointments`                                       | Requiere `clientRequestId` (UUID generado en el cliente, para reintentos idempotentes), `petId`, `availabilitySlotId`, `expectedAvailabilitySlotVersion`, `reason` |
| Listar mis citas          | `GET /api/v1/appointments?from&to&status&page&size`               | Filtrado automáticamente por rol; rango máximo 31 días                                                                                                             |
| Ver detalle de una cita   | `GET /api/v1/appointments/{appointmentId}`                        |                                                                                                                                                                    |
| Ver historial de una cita | `GET /api/v1/appointments/{appointmentId}/events`                 |                                                                                                                                                                    |

Estados posibles de una cita: `REQUESTED`, `CONFIRMED`, `REJECTED`, `CANCELLED`. El propietario solo puede crear y consultar sus propias citas; confirmar o rechazar es exclusivo del personal administrativo.

## Alcance y estado

La tabla describe únicamente el prototipo web existente, no el nivel de avance de la app nativa.

Las pantallas web de propietario incluyen una demostración visual y navegación por pestañas:

| Pantalla                   | Estado                                                              |
| -------------------------- | ------------------------------------------------------------------- |
| Inicio de sesión           | Formulario de demostración; no autentica                            |
| Registro                   | Validación local; no crea una cuenta                                |
| Recuperación de contraseña | Pasos de demostración; no envía ni verifica códigos                 |
| Mascotas                   | Datos locales; detalle modal simple, edición pendiente              |
| Citas                      | Datos locales; solicitud de demostración, integración pendiente     |
| Perfil                     | Datos locales; foto, edición persistente y desactivación pendientes |

### Próximos pasos del producto nativo

- [ ] Antes de ampliar el prototipo web, decidir si se conserva como superficie secundaria o se retira; no confundirlo con el producto móvil.
- [ ] Implementar en React Native/Expo los flujos de propietario acordados: autenticación, mascotas (lista, detalle y crear/editar), citas, perfil y estados de carga/vacío/error.
- [ ] Unificar los imports de workspaces con la convención `@grownupsvet/*`; los alias cortos actuales (`@api-client/*`, `@ui/*`, etc.) son transitorios.
- [ ] Conectar la app por fases desde autenticación, validando los endpoints contra OpenAPI y usando almacenamiento seguro nativo para la sesión.
- [ ] Completar la capa API de perfil antes de conectar sus pantallas: en esta rama no existe `profile.service.ts`; `client.ts` es el cliente HTTP actual.
- [ ] Adaptar la accesibilidad al modelo nativo; los helpers ARIA y las primitivas Radix web no sustituyen componentes ni propiedades accesibles de React Native.

- [ ] Definir y verificar la URL pública de despliegue y una imagen absoluta para tarjetas de compartir (Open Graph/Twitter).
- [ ] Verificar el servidor de preview de producción para el preset Cloudflare de Nitro; el build y el servidor de desarrollo funcionan, pero los comandos de preview actuales no sirven la salida generada.
- [ ] Implementar el portal administrativo en una fase posterior; no forma parte de este alcance.

## Accesibilidad prevista

Las pantallas priorizan etiquetas visibles, texto legible, controles amplios y mensajes en español. Esto no sustituye una auditoría de accesibilidad: contraste, navegación por teclado y lectores de pantalla deben validarse antes de dar los flujos por terminados.
