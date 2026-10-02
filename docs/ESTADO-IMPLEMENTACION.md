# GrownupsVet frontend: arquitectura y estado de implementación

> **Estado:** arquitectura web del propietario y paquetes iniciales en progreso. La interfaz es una demostración local: no está conectada al backend. El portal administrativo y el cableado nativo de Expo no forman parte de la fase actual.

## 1. Propósito y alcance

Este documento describe la estructura actual del monorepo, las decisiones tomadas y qué está realmente implementado. Distingue las pantallas de demostración de las funcionalidades pendientes para evitar confundir una interacción local con una integración de producto.

### Incluido en la fase actual

- Organizar la experiencia web del propietario dentro de `apps/propietario/`.
- Servir esa experiencia desde el host TanStack Start en la ruta `/`.
- Preparar paquetes compartidos para contratos/endpoints, primitivas de interfaz y utilidades de accesibilidad.
- Usar alias de importación por dominio en TypeScript y Vite.
- Mantener formularios y datos locales mientras el frontend sigue en construcción.

### Fuera del alcance actual

- Implementar el portal administrativo.
- Conectar la interfaz a endpoints o a un servidor backend.
- Considerar los flujos locales como autenticación, persistencia o acciones reales de cuenta.
- Reemplazar la interfaz nativa existente por componentes web: Expo requiere una implementación compatible con React Native.

## 2. Estructura del repositorio

```text
grownupsvet-frontend/
├── apps/
│   ├── propietario/
│   │   ├── App.tsx                         # Entrada Expo actual; aún es la pantalla de ejemplo
│   │   └── src/
│   │       ├── PropietarioApp.tsx          # Orquestador de la demostración web del propietario
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
│   ├── ui/src/                             # Primitivas web compartidas
│   ├── api-client/src/                     # Contratos y fetchers preparados
│   └── accessibility-kit/src/              # Utilidades de accesibilidad iniciales
├── src/
│   ├── routes/
│   │   ├── __root.tsx                      # HTML raíz, estilos, fuentes y metadatos
│   │   └── index.tsx                       # Ruta host / que monta PropietarioApp
│   ├── router.tsx                          # Fábrica del router TanStack
│   ├── server.ts                           # Entrada del servidor TanStack Start
│   ├── routeTree.gen.ts                    # Árbol generado de rutas
│   ├── env.d.ts                            # Declaraciones de assets y CSS
│   └── styles.css                          # Tokens, tema y estilos globales web
├── assets/
│   └── favicon.png
├── app.json                                # Configuración de Expo
├── package.json                            # Workspaces, dependencias y scripts
├── tsconfig.json                           # Configuración TypeScript y alias
└── vite.config.ts                          # Host Vite/TanStack Start y alias del bundler
```

Los componentes UI heredados de `apps/propietario/src/components/ui/` y su configuración local de shadcn fueron retirados: las pantallas usan las primitivas compartidas de `packages/ui`.

## 3. Tecnologías

Las versiones indicadas son las declaradas en el manifiesto raíz en el momento de redactar este documento.

| Área | Tecnología |
|---|---|
| App móvil y runtime nativo existente | Expo SDK `~57.0.22`, React Native `0.86.3` |
| Interfaz web y host | React `19.2.3`, React DOM `19.2.3`, TanStack Start `1.168.60`, TanStack Router `1.170.41` |
| Bundler y estilos web | Vite `8.1.5`, Tailwind CSS `4.2.1`, `tw-animate-css` |
| Lenguaje | TypeScript `~6.0.3`, modo estricto |
| Primitivas accesibles | Radix UI |
| Iconos | `lucide-react` |
| Workspaces | npm workspaces: `apps/*` y `packages/*` |

Las pantallas migradas usan HTML y clases de Tailwind; no son componentes React Native. El host web y la app nativa son superficies diferentes, aunque compartan el mismo repositorio.

## 4. Alias de importación

Los alias están declarados en `tsconfig.json` y en la configuración de Vite. Cada prefijo señala explícitamente su dominio:

| Alias | Destino |
|---|---|
| `@propietario/*` | `apps/propietario/src/*` |
| `@administrativo/*` | `apps/administrativo/src/*` |
| `@ui/*` | `packages/ui/src/*` |
| `@api-client/*` | `packages/api-client/src/*` |
| `@accessibility-kit/*` | `packages/accessibility-kit/src/*` |

Por ejemplo, `@propietario/components/ListState` identifica el componente por su dominio en lugar de depender de cuántos directorios relativos hay que subir. Esto hace que las importaciones sigan siendo legibles si cambia la ubicación de una pantalla.

## 5. Funcionalidad actual de la demostración

La experiencia web del propietario se monta desde `src/routes/index.tsx`. `PropietarioApp.tsx` maneja la navegación local entre autenticación, pestañas y perfil. Mientras se muestra la app, un aviso indica que la información es de demostración y que no hay conexión al servidor.

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

## 6. Paquetes compartidos

### `packages/api-client`

La capa define tipos y una base para configurar solicitudes HTTP:

- `types.ts`: contratos `UserProfile`, `Pet`, `Appointment`, `AvailabilitySlot`, `Species`, `Sex`, estados y paginación.
- `client.ts`: configuración de URL/token, solicitud HTTP y error `ApiError`.
- `auth.api.ts`: fetchers de login, registro, cierre de sesión y recuperación.
- `pets.api.ts`: fetchers de listado, creación, edición y archivo de mascotas.
- `appointments.api.ts`: fetchers de listado, solicitud, detalle, eventos y cancelación.
- `availability.api.ts`: consulta de turnos disponibles.
- `index.ts`: exportaciones del paquete.

**Es preparación de endpoints, no integración terminada.** La app no configura el cliente ni invoca estos fetchers. Aún faltan revisar los contratos contra OpenAPI, definir el manejo de sesión/token, completar los servicios de perfil y decidir cómo integrar cada mutación una vez que la interfaz esté lista.

### `packages/ui`

Contiene primitivas web compartidas: botones, tarjetas, diálogos, campos, etiquetas, textarea, badges, tabs, skeleton y utilidades de clases. Las pantallas importan desde `@ui/*`. No es una biblioteca de componentes React Native.

### `packages/accessibility-kit`

Contiene helpers iniciales de contraste WCAG, escala de texto y propiedades para anuncios ARIA. Son herramientas base; todavía no equivalen a una auditoría ni a soporte de lector de pantalla probado en todos los flujos.

## 7. Host, estilos y metadatos

- La ruta `/` de TanStack Start importa y renderiza `PropietarioApp`; el host sirve la experiencia web sin mover la lógica de las pantallas al framework de routing.
- `src/router.tsx` crea el router a partir del árbol generado.
- `src/server.ts` provee el handler de TanStack Start que espera el host.
- `src/styles.css` define tokens de color, temas claro/oscuro, tipografía base de 17 px y estilos globales.
- El layout incluye Figtree desde Google Fonts y metadatos básicos de título, descripción, idioma, tema y Open Graph/Twitter.
- Para completar las tarjetas al compartir y los metadatos de despliegue falta conocer la URL pública definitiva y definir/verificar una imagen absoluta de Open Graph. La carga de la fuente también depende de Google Fonts.

## 8. Decisiones de alcance y arquitectura

1. **Primero la interfaz del propietario.** El portal administrativo se reserva para una fase futura y no debe considerarse implementado.
2. **Sin llamadas al backend durante el desarrollo de pantallas.** La interfaz usa datos locales; el cliente compartido prepara contratos/endpoints para una integración posterior.
3. **Host desacoplado.** TanStack Start proporciona la ruta web `/`, mientras que las pantallas se mantienen bajo `apps/propietario`.
4. **Web y nativo se cablean por separado.** El host web puede renderizar las pantallas actuales; Expo requiere pantallas compatibles con React Native y no debe importar directamente estas vistas DOM.
5. **Paquetes compartidos por responsabilidad.** UI, contratos de API y helpers de accesibilidad tienen carpetas separadas.
6. **Alias por dominio.** Se prefirieron prefijos como `@ui/*` y `@propietario/*` para hacer explícito el origen de cada importación.
7. **El progreso de los mocks se comunica en la interfaz y en la documentación.** Ningún flujo local debe confundirse con un registro, login o cambio persistente.

## 9. Pendientes

- [ ] Completar los flujos visuales y de interacción del propietario antes de conectarlos al backend.
- [ ] Implementar edición completa de mascotas; ampliar el detalle y validar acciones de archivo/reactivación.
- [ ] Completar el formulario y estados de solicitud de citas; diseñar estados de carga, vacío y error para todos los recorridos pertinentes.
- [ ] Completar los flujos de perfil: persistencia futura del teléfono, foto y desactivación con confirmación accesible.
- [ ] Revisar los tipos y endpoints del cliente API contra OpenAPI; agregar servicios de perfil y token/sesión cuando la integración esté aprobada.
- [ ] Mantener el cliente API sin configurar ni invocar desde la UI hasta que el frontend esté listo para la integración.
- [ ] Completar accesibilidad con foco consistente, controles por teclado, anuncios en español y pruebas con lectores de pantalla.
- [ ] Conectar `apps/propietario/App.tsx` y las pantallas nativas a una implementación React Native. Las pantallas web actuales no se pueden reutilizar directamente en Expo nativo.
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

# Expo nativo: entrada existente todavía no conectada a las pantallas web
npm start
```
