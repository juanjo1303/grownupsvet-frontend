# GrownupsVet frontend

Monorepo con los dos clientes de GrownupsVet, construidos en React Native, Expo y TypeScript, organizados con npm workspaces. `apps/propietario` es la aplicación accesible dirigida a adultos mayores dueños de mascotas; `apps/administrativo` es la aplicación de gestión para personal veterinario y administrativo. Ambas consumen el mismo backend compartido ([grownupsvet-backend](https://github.com/Estebangmz666/grownupsvet-backend), Spring Boot 4.1.1) a través del paquete común `packages/api-client`.

Al 30/09/2026, el backend expone el incremento 0.7.0: acceso, perfil y mascotas del alcance inicial, más citas veterinarias, agenda de disponibilidad y personal/invitaciones agregados posteriormente. El frontend, por ahora, solo tiene implementado el cliente HTTP tipado para acceso, perfil y mascotas; citas y disponibilidad ya son endpoints reales del backend pero todavía no tienen su capa de servicio en este repositorio. No existe código de aplicación ejecutable todavía: el trabajo actual son los mockups de las pantallas de `apps/propietario` y la capa de datos que las va a alimentar.

## Estructura del monorepo

```
grownupsvet-frontend/
  package.json                    workspaces: apps/*, packages/*
  apps/
    propietario/                  pendiente de scaffolding con Expo
    administrativo/                pendiente (a cargo de Juan Manuel)
  packages/
    api-client/                    IMPLEMENTADO. Cliente HTTP tipado hacia el backend
    accessibility-kit/              pendiente. Tokens de color, tipografía y componentes
                                    compartidos de accesibilidad
```

Cada app es un proyecto Expo independiente que se ejecuta, compila y despliega por separado. El monorepo solo comparte código fuente entre ambas, no el runtime.

## packages/api-client

Cliente HTTP compartido, alineado al contrato OpenAPI del backend (`/v3/api-docs`). Se apoya en `expo-secure-store` para el JWT en vez de `localStorage`, que no existe en React Native.

| Archivo | Contenido |
|---|---|
| `config.ts` | URL base de la API y timeout por defecto |
| `secureStorage.ts` | Guardar/leer/borrar el JWT cifrado en el dispositivo |
| `types.ts` | Tipos alineados al contrato: `UserProfile`, `Pet`, DTOs de auth, `ApiError` |
| `httpClient.ts` | Header de autorización, parseo de errores `problem+json` a `ApiError` tipado |
| `auth.service.ts` | Registro, login, logout, recuperación de contraseña (3 pasos) |
| `profile.service.ts` | Perfil propio, foto de perfil, desactivación de cuenta |
| `pets.service.ts` | CRUD de mascotas (archivar/reactivar, sin borrado físico) |

### Endpoints conectables hoy

| Función | Endpoint |
|---|---|
| Registro | `POST /api/v1/auth/registrations` |
| Login | `POST /api/v1/auth/sessions` |
| Logout | `DELETE /api/v1/auth/sessions/current` |
| Recuperación de contraseña | `POST /api/v1/auth/password-recoveries` → `.../verifications` → `POST /api/v1/auth/password-resets` |
| Perfil propio | `GET` / `PATCH /api/v1/users/me` (solo `phoneNumber` editable) |
| Foto de perfil | `GET` / `PUT` / `DELETE /api/v1/users/me/profile/photo` |
| Mascotas | `POST /api/v1/pets`, `GET /api/v1/pets`, `GET`/`PATCH /api/v1/pets/{petId}` |

Ejemplo de uso desde una pantalla:

```ts
import { authService, petsService } from '@grownupsvet/api-client';

const { user } = await authService.login({ email, password });
const { content: pets } = await petsService.listMyPets({ active: true });
```

### Endpoints reales pendientes de envolver en servicios

El backend ya implementa citas y disponibilidad (incremento 0.7.0), pero este repositorio todavía no tiene `appointments.service.ts` ni `availability.service.ts`:

| Función | Endpoint | Notas |
|---|---|---|
| Ver turnos disponibles | `GET /api/v1/availability-slots?from&to&veterinarianId&page&size` | Ventana: desde mañana hasta 60 días; excluye turnos ya ocupados |
| Solicitar cita | `POST /api/v1/appointments` | Requiere `clientRequestId` (UUID generado en el cliente, para reintentos idempotentes), `petId`, `availabilitySlotId`, `expectedAvailabilitySlotVersion`, `reason` |
| Listar mis citas | `GET /api/v1/appointments?from&to&status&page&size` | Filtrado automáticamente por rol; rango máximo 31 días |
| Ver detalle de una cita | `GET /api/v1/appointments/{appointmentId}` | |
| Ver historial de una cita | `GET /api/v1/appointments/{appointmentId}/events` | |

Estados posibles de una cita: `REQUESTED`, `CONFIRMED`, `REJECTED`, `CANCELLED`. El propietario solo puede crear y consultar sus propias citas; confirmar o rechazar es exclusivo del personal administrativo.

## Mockups completados (Sprint 1)

Diseñados sobre la app Propietario, con navegación consistente (tabs raíz: Mascotas, Citas, Perfil; stacks internos con botón de volver explícito) y los cuatro estados obligatorios (feliz, carga, vacío, error) donde aplica.

| Pantalla | Estados diseñados |
|---|---|
| Login | Feliz |
| Registro | Feliz |
| Recuperación de contraseña | 3 pasos (solicitar, verificar código, nueva contraseña) |
| Mis mascotas | Feliz, carga, vacío, error |
| Detalle de mascota | Feliz |
| Crear/Editar mascota | Feliz (una sola pantalla para ambos modos) |
| Mis citas | Feliz, carga, vacío, error |
| Solicitar cita | Feliz |
| Perfil | Feliz |

Acuerdos de accesibilidad aplicados en todos los mockups: etiquetas visibles sobre cada campo (no solo placeholder), controles de al menos 44×44 dp, texto base de 16–18px, mensajes de error en lenguaje simple (nunca el texto crudo del backend), y diálogos de confirmación antes de cualquier acción destructiva (archivar mascota, desactivar cuenta).

## Pendientes

- [ ] Scaffolding real de `apps/propietario` con Expo + TypeScript
- [ ] `metro.config.js` en cada app para resolver `@grownupsvet/api-client` desde el monorepo
- [ ] `appointments.service.ts` y `availability.service.ts` en `packages/api-client`
- [ ] `packages/accessibility-kit` con los componentes compartidos (`ConfirmDialog`, `useReadAloud`, estados de carga/vacío/error)
- [ ] Scaffolding de `apps/administrativo` (Juan Manuel)
- [ ] Confirmar reparto de portales en Jira
