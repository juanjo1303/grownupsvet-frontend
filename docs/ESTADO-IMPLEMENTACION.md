# GrownupsVet frontend: arquitectura y estado de implementación

> **Decisión de producto:** la app del propietario se entregará como aplicación nativa iOS/Android con Expo y React Native.
> **Estado real de esta rama:** la entrada Expo aún muestra la pantalla de ejemplo; las pantallas de propietario existentes son un prototipo web separado, local y sin conexión al backend. No cuentan como implementación nativa ni deben ampliarse como sustituto de ella.
>
> **Nota (fix/api-client-contract-alignment):** `packages/api-client` fue
> revisado contra el OpenAPI real del backend (incremento 0.7.0) y corregido:
> nombres de campo (`dateOfBirth`/`phoneNumber`/`active`), paginación con
> `items` en vez de `content`, tipos completos de `Appointment`/`Pet`, manejo
> de `errorCode`/`fieldErrors`, y eliminación de un endpoint de cancelación
> que no existe en el backend. El prototipo web sigue sin conectarse a ningún
> endpoint real; este cambio no altera esa decisión.

## 1. Propósito y alcance

Este documento distingue el objetivo acordado del estado real del repositorio para evitar confundir una demostración web con una app móvil de producto. No se migran pantallas ni se cambia código como parte de esta actualización documental.

### Objetivo de producto

- Implementar la aplicación del propietario con React Native y Expo para iOS y Android.
- Conectar el frontend al backend de forma incremental, empezando por autenticación y validando los contratos contra OpenAPI.
- Reutilizar tipos y lógica de API solo después de comprobar su compatibilidad; las vistas y primitivas web no se consideran compartibles con React Native.
- Completar para mascotas lista, detalle y crear/editar, así como componentes independientes para los estados de carga, vacío y error.
- Representar esos estados nativos con `LoadingState`, `EmptyState` y `ErrorState`, no con el `ListState` web actual.

### Fuera del alcance actual

- Implementar el portal administrativo; queda reservado para una fase posterior.

### Estado actual

- La experiencia TanStack Start actual es un prototipo web independiente; aún no se ha decidido si se conservará como superficie secundaria o se retirará.
- No extender el prototipo web en lugar de construir la aplicación nativa.
- Los flujos locales no representan autenticación, persistencia ni acciones reales de cuenta.

## 2. Estructura del repositorio

```text
grownupsvet-frontend/
├── apps/
│   ├── propietario/
│   │   └── src/
│   │       ├── PropietarioApp.tsx          # Orquestador del prototipo web del propietario
│   │       ├── screens/
│   │       │   ├── LoginScreen.tsx
│   │       │   ├── CreateAccountScreen.tsx
│   │       │   ├── ForgotPasswordScreen.tsx
│   │       │   ├── ProfileScreen.tsx
│   │       │   ├── PetsScreen.tsx
│   │       │   └── AppointmentsScreen.tsx
│   │       ├── navigation/
│   │       │   └── BottomNav.tsx
│   │       └── components/
│   │           └── ListState.tsx
│   └── administrativo/
│       └── package.json                    # Workspace reservado; portal diferido
├── packages/
│   ├── ui/src/                             # Primitivas web basadas en Radix; no son React Native
│   ├── api-client/src/                     # Contratos y fetchers preparados
│   └── accessibility-kit/src/              # Helpers iniciales; incluye utilidades ARIA web
├── src/
│   ├── routes/
│   │   ├── __root.tsx                      # HTML raíz, estilos, fuentes y metadatos
│   │   └── index.tsx                       # Host web / que monta PropietarioApp
│   ├── router.tsx                          # Fábrica del router TanStack
│   ├── server.ts                           # Entrada del servidor TanStack Start
│   ├── routeTree.gen.ts                    # Árbol generado de rutas
│   ├── env.d.ts                            # Declaraciones de assets y CSS
│   └── styles.css                          # Tokens, tema y estilos globales web
├── assets/
│   └── favicon.png
├── App.tsx                                 # Entrada Expo actual; aún es la pantalla de ejemplo
├── app.json                                # Configuración de Expo
├── package.json                            # Workspaces, dependencias y scripts
├── tsconfig.json                           # Configuración TypeScript y alias
└── vite.config.ts                          # Host Vite/TanStack Start y alias del bundler
```

Las pantallas bajo `apps/propietario/src/` y las primitivas de `packages/ui` son web. No se pueden renderizar directamente en Expo nativo. La decisión de mantener o retirar el prototipo web queda pendiente; la implementación nativa es el objetivo del producto en cualquiera de los casos.

## 3. Tecnologías

Las versiones indicadas son las declaradas en el manifiesto raíz en el momento de redactar este documento.

| Área | Objetivo de producto | Implementación actual en esta rama |
|---|---|---|
| Aplicación del propietario | Expo SDK `~57.0.22` y React Native `0.86.3` para iOS/Android | La entrada `App.tsx` aún es la pantalla de ejemplo; no contiene los flujos del propietario |
| Superficie web | No es el entregable móvil acordado; conservarla o retirarla está por decidir | React `19.2.3`, React DOM `19.2.3`, TanStack Start `1.168.60`, TanStack Router `1.170.41` |
| Bundler/estilos web | No aplican a la UI nativa | Vite `8.1.5`, Tailwind CSS `4.2.1`, `tw-animate-css` |
| Lenguaje | TypeScript `~6.0.3`, modo estricto | TypeScript `~6.0.3`, modo estricto |
| UI y accesibilidad | Componentes y APIs accesibles compatibles con React Native | Radix UI, HTML, Tailwind y helpers ARIA; solo para web |
| Workspaces | Monorepo npm | npm workspaces: `apps/*` y `packages/*` |

Expo requiere una implementación React Native. El host TanStack sirve exclusivamente el prototipo web actual; compartir repositorio no hace que sus pantallas sean reutilizables en móvil.

## 4. Alias de importación

Los alias actuales están declarados en `tsconfig.json` y Vite:

| Alias | Destino |
|---|---|
| `@propietario/*` | `apps/propietario/src/*` |
| `@administrativo/*` | `apps/administrativo/src/*` |
| `@ui/*` | `packages/ui/src/*` |
| `@api-client/*` | `packages/api-client/src/*` |
| `@accessibility-kit/*` | `packages/accessibility-kit/src/*` |

Los paquetes publican nombres `@grownupsvet/*`, mientras que el código usa alias cortos como `@api-client/*` y `@ui/*`. Para evitar dos convenciones, el trabajo futuro debe converger en `@grownupsvet/*`; este ajuste queda pendiente y no cambia el código en esta actualización.

## 5. Funcionalidad actual de la demostración

El prototipo web del propietario se monta desde `src/routes/index.tsx`. `PropietarioApp.tsx` maneja navegación local entre autenticación, pestañas y perfil. Mientras se muestra el prototipo, un aviso indica que la información es de demostración y que no hay conexión al servidor. Estos flujos no son parte de la app Expo.

| Pantalla | Qué se puede probar localmente | Qué no hace todavía |
|---|---|---|
| Inicio de sesión | El formulario permite entrar a la demostración. | No valida credenciales ni autentica a una persona. |
| Registro | Valida algunos campos y las contraseñas localmente. | No crea una cuenta ni guarda información. |
| Recuperación | Presenta los pasos de solicitud, verificación y cambio de contraseña. | No envía correo ni valida un código real. |
| Mascotas | Muestra datos de ejemplo, filtra activas/archivadas, agrega y archiva/reanuda mascotas localmente. | No persiste cambios; la vista de detalle es básica y la edición de mascotas sigue pendiente. |
| Citas | Muestra ejemplos, separa próximas e historial y permite simular una solicitud. | No consulta disponibilidad ni persiste, confirma o cancela citas en el backend. |
| Perfil | Muestra datos de ejemplo; permite editar el teléfono en memoria y salir de la demostración. | El teléfono no persiste; foto de perfil y desactivación real no están implementadas. |
| Navegación | Cambia entre Mascotas, Citas y Perfil mediante la barra inferior. | No reemplaza la navegación nativa de Expo. |

Los datos creados durante la demostración se pierden al reiniciar la aplicación. Algunas acciones de cuenta y fotografía muestran avisos o confirmaciones de navegador; no representan operaciones reales.

## 6. Paquetes y grado de reutilización

### `packages/api-client`

La capa define tipos y una base para configurar solicitudes HTTP:

- `types.ts`: contratos `UserProfile`, `Pet`, `Appointment`, `AvailabilitySlot`, `Species`, `Sex`, estados y paginación.
- `client.ts`: configuración de URL/token, solicitud HTTP y error `ApiError`.
- `auth.api.ts`: fetchers de login, registro, cierre de sesión y recuperación.
- `pets.api.ts`: fetchers de listado, creación, edición y archivo de mascotas.
- `appointments.api.ts`: fetchers de listado, solicitud, detalle, eventos y cancelación.
- `availability.api.ts`: consulta de turnos disponibles.
- `index.ts`: exportaciones del paquete.

**Es preparación de endpoints, no integración terminada.** Ninguna interfaz configura el cliente ni invoca estos fetchers. Los tipos y fetchers son candidatos a reutilización, pero deben verificarse contra OpenAPI antes de conectarlos. Esta rama no incluye `profile.service.ts`; tampoco incluye fetchers para perfil o foto. `client.ts` es el cliente HTTP existente.

### `packages/ui`

Contiene primitivas web: botones, tarjetas, diálogos, campos, etiquetas, textarea, badges, tabs, skeleton y utilidades de clases. Las pantallas web importan desde `@ui/*`. No es una biblioteca de componentes React Native.

### `packages/accessibility-kit`

Contiene helpers iniciales de contraste WCAG, escala de texto y propiedades para anuncios ARIA. Son herramientas base de web; necesitan adaptación y validación con las APIs de accesibilidad nativas.

## 7. Host web, estilos y metadatos

- La ruta `/` de TanStack Start importa y renderiza `PropietarioApp`; es el host del prototipo web, no la entrada de la app móvil.
- `src/router.tsx` crea el router a partir del árbol generado.
- `src/server.ts` provee el handler de TanStack Start que espera el host.
- `src/styles.css` define tokens de color, temas claro/oscuro, tipografía base de 17 px y estilos globales.
- El layout incluye Figtree desde Google Fonts y metadatos básicos de título, descripción, idioma, tema y Open Graph/Twitter.
- Para completar las tarjetas al compartir y los metadatos de despliegue falta conocer la URL pública definitiva y definir/verificar una imagen absoluta de Open Graph. La carga de la fuente también depende de Google Fonts.

## 8. Decisiones de alcance y arquitectura

1. **Producto nativo.** La aplicación del propietario se construirá con Expo y React Native; el prototipo TanStack no sustituye ni completa ese producto.
2. **Alcance web pendiente.** No está decidido si se conservará el prototipo web como superficie secundaria o se retirará. No ampliar sus flujos mientras esa decisión siga abierta.
3. **Integración incremental.** Conectar por fases desde autenticación, tras validar contratos contra OpenAPI; no posponer toda integración hasta completar todas las pantallas. El estado actual sigue siendo desconectado.
4. **Separación de plataformas.** Las vistas DOM, Tailwind, Radix UI y atributos ARIA existentes son específicos de web. Expo requiere pantallas, navegación, controles y propiedades de accesibilidad React Native.
5. **Reutilización selectiva.** Tipos y lógica del cliente API pueden compartirse si pasan la validación de contrato/runtime. `packages/ui` y las utilidades ARIA no son primitivas nativas.
6. **Convención de paquetes.** Converger los imports en `@grownupsvet/*`, que coincide con los nombres de los workspaces; los alias cortos actuales son transitorios.
7. **Mocks claramente identificados.** Ningún flujo local debe confundirse con un registro, login o cambio persistente.

## 9. Próximos pasos y pendientes

- [ ] Decidir si se conserva el prototipo web como superficie secundaria o se retira.
- [ ] Implementar y conectar los flujos de propietario en React Native/Expo, empezando por autenticación y validando endpoints contra OpenAPI.
- [ ] Implementar mascotas con lista, detalle y crear/editar; añadir componentes separados para estados de carga, vacío y error.
- [ ] Unificar alias e imports del monorepo bajo `@grownupsvet/*`.
- [ ] Añadir y verificar servicios de perfil; resolver almacenamiento seguro de sesión para Expo antes de habilitar auth.
- [ ] Completar accesibilidad con controles y APIs nativas, incluidos anuncios en español y pruebas con lectores de pantalla.
- [ ] Resolver el preview de producción: Vite genera salida Cloudflare/Nitro en `.output/`, pero `vite preview` intentó buscar `dist/server/server.js`; Nitro preview también falló en el entorno validado.
- [ ] Configurar URL pública e imagen de compartir, y revisar si Figtree debe servirse localmente en lugar de depender de Google Fonts.
- [ ] Implementar el portal administrativo en una fase posterior.
- [ ] Revisar las alertas de auditoría de dependencias reportadas durante la instalación antes de decidir cualquier actualización.

## 10. Validación realizada

| Comprobación | Resultado |
|---|---|
| Instalación de dependencias | Completada con `npm install --package-lock=false --ignore-scripts`, después de alinear versiones de React/React DOM y tipos. npm informó 12 vulnerabilidades de dependencias (8 moderadas y 4 altas); no se aplicó una reparación automática. |
| `npm run build` | Correcto; generó los entornos client, SSR y Nitro/Cloudflare. |
| `tsc --noEmit` | Correcto para las fuentes incluidas en la configuración TypeScript. |
| ESLint en archivos migrados | Correcto para host, pantallas del propietario, navegación y paquetes compartidos. |
| Lint completo del repositorio | Correcto después de retirar el UI heredado y formatear los archivos señalados. ESLint aún imprime una advertencia de formato de módulo para `eslint.config.js`. |
| Navegador en modo desarrollo | Correcto: se verificó login de demostración, lista de mascotas, navegación al perfil y edición local del teléfono. |
| Preview de producción | Pendiente: `vite preview` devolvió HTTP 500 por la ruta de salida; el intento con Nitro preview también falló. |
| Llamadas HTTP desde pantallas | Ninguna: verificado que la UI no configura el cliente ni invoca los fetchers. |

## 11. Comandos útiles

```bash
# Host web TanStack Start
npm run dev

# Compilar host web
npm run build

# Comprobar tipos
npx tsc --noEmit

# Lint del repositorio (incluye actualmente archivos heredados pendientes)
npm run lint

# Expo nativo: entrada existente de ejemplo; los flujos de propietario aún no están implementados
npm start
```
