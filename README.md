# GrownupsVet frontend

> Arquitectura, decisiones, funcionalidades de demostración, validación y pendientes: [docs/ESTADO-IMPLEMENTACION.md](./docs/ESTADO-IMPLEMENTACION.md).

Monorepo de GrownupsVet. La experiencia web del propietario se sirve desde el host TanStack Start en `/`; las pantallas y contratos compartidos viven en workspaces. El portal administrativo queda fuera del alcance actual.

El backend compartido es [grownupsvet-backend](https://github.com/Estebangmz666/grownupsvet-backend) (Spring Boot 4.1.1). La interfaz actual es una demostración local y no está conectada al backend. El cliente API solo prepara los contratos y la configuración base de endpoints.

## Estructura del monorepo

```
grownupsvet-frontend/
  package.json                    workspaces: apps/*, packages/*
  apps/
    propietario/src/screens/      pantallas de acceso, perfil, mascotas y citas
    propietario/src/navigation/   navegación inferior móvil
    propietario/src/components/   componentes de dominio
    administrativo/                reservado para una fase futura
  packages/
    ui/                            primitivas visuales compartidas
    api-client/                    contratos TypeScript y fetchers HTTP
    accessibility-kit/             contraste, tipografía y anuncios ARIA
  src/
    routes/                        host TanStack Start: propietario en /
    styles.css                     tokens globales y temas
```

`src/routes/index.tsx` es un host delgado que renderiza `PropietarioApp`; la lógica y pantallas web continúan en `apps/propietario`.

Los alias de TypeScript y Vite son explícitos por dominio: `@propietario/*`, `@administrativo/*`, `@ui/*`, `@api-client/*` y `@accessibility-kit/*`.

## packages/api-client

Paquete compartido con contratos TypeScript, configuración de la URL base/token y fetchers preparados. No se configura en el host ni se invoca desde las pantallas; no hay llamadas al backend durante el desarrollo de esta interfaz. Los fetchers son una preparación de endpoints, no una integración terminada.

| Archivo               | Contenido                                                                              |
| --------------------- | -------------------------------------------------------------------------------------- |
| `types.ts`            | Contratos compartidos `UserProfile`, `Pet`, `Appointment`, `Species`, `Sex`, `AppView` |
| `client.ts`           | Configuración, bearer token y errores tipados `ApiError`                               |
| `auth.api.ts`         | Registro, login, logout y recuperación de contraseña                                   |
| `pets.api.ts`         | Listar, crear, editar y archivar mascotas                                              |
| `appointments.api.ts` | Listar, solicitar, cancelar y consultar eventos de citas                               |
| `availability.api.ts` | Consulta de turnos disponibles                                                         |

### Endpoints conectables hoy

| Función                    | Endpoint                                                                                            |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| Registro                   | `POST /api/v1/auth/registrations`                                                                   |
| Login                      | `POST /api/v1/auth/sessions`                                                                        |
| Logout                     | `DELETE /api/v1/auth/sessions/current`                                                              |
| Recuperación de contraseña | `POST /api/v1/auth/password-recoveries` → `.../verifications` → `POST /api/v1/auth/password-resets` |
| Perfil propio              | `GET` / `PATCH /api/v1/users/me` (solo `phoneNumber` editable)                                      |
| Foto de perfil             | `GET` / `PUT` / `DELETE /api/v1/users/me/profile/photo`                                             |
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

Las pantallas web de propietario incluyen una demostración visual y navegación por pestañas:

| Pantalla                   | Estado                                                              |
| -------------------------- | ------------------------------------------------------------------- |
| Inicio de sesión           | Formulario de demostración; no autentica                            |
| Registro                   | Validación local; no crea una cuenta                                |
| Recuperación de contraseña | Pasos de demostración; no envía ni verifica códigos                 |
| Mascotas                   | Datos locales; detalle modal simple, edición pendiente              |
| Citas                      | Datos locales; solicitud de demostración, integración pendiente     |
| Perfil                     | Datos locales; foto, edición persistente y desactivación pendientes |

### Pendiente antes de considerar completo el frontend

- [ ] Reemplazar los flujos simulados por estados, mensajes y navegación de producto terminados; incluir edición y detalle de mascotas, formulario de cita completo y estados de error/vacío/loading verificados.
- [ ] Cablear los formularios a los servicios API cuando el frontend esté listo para integrarse. Hasta entonces, mantener el cliente desconectado y no hacer solicitudes.
- [ ] Añadir los servicios/contratos de perfil que falten y verificar todos los contratos de endpoint contra OpenAPI antes de habilitar solicitudes.
- [ ] Completar la accesibilidad: anillo de foco compartido, anuncios en español probados con lector de pantalla y flujos accesibles de diálogo/confirmación.
- [ ] Conectar pantallas compatibles con React Native a la entrada Expo `apps/propietario/App.tsx`. La estructura `screens/` actual es web y no se puede renderizar directamente desde Expo nativo; el host TanStack `/` sí monta la aplicación web.
- [ ] Definir y verificar la URL pública de despliegue y una imagen absoluta para tarjetas de compartir (Open Graph/Twitter).
- [ ] Verificar el servidor de preview de producción para el preset Cloudflare de Nitro; el build y el servidor de desarrollo funcionan, pero los comandos de preview actuales no sirven la salida generada.
- [ ] Implementar el portal administrativo en una fase posterior; no forma parte de este alcance.
- [ ] Instalar dependencias y ejecutar typecheck, build y lint para validar la migración.

## Accesibilidad prevista

Las pantallas priorizan etiquetas visibles, texto legible, controles amplios y mensajes en español. Esto no sustituye una auditoría de accesibilidad: contraste, navegación por teclado y lectores de pantalla deben validarse antes de dar los flujos por terminados.
