# GrownupsVet frontend

> Arquitectura acordada, estado real y próximos pasos: [docs/ESTADO-IMPLEMENTACION.md](./docs/ESTADO-IMPLEMENTACION.md).

Monorepo de GrownupsVet. El producto del propietario se entrega como app móvil nativa para iOS y Android con Expo/React Native. El portal administrativo queda fuera del alcance actual.

El backend compartido es [grownupsvet-backend](https://github.com/Estebangmz666/grownupsvet-backend) (Spring Boot 4.1.1). `packages/api-client` ya está alineado contra su contrato OpenAPI real (incremento 0.7.0).

## Estructura del monorepo

```
grownupsvet-frontend/
  package.json                    workspaces: apps/*, packages/*
  apps/
    propietario/                   app React Native del propietario (en construcción)
    administrativo/                reservado para una fase futura
  packages/
    api-client/                    tipos y fetchers HTTP, alineados al contrato real
    accessibility-kit/              helpers de contraste, escala de texto y live regions
```

## Paquetes compartidos

### `packages/api-client`

Incluye tipos y fetchers HTTP para autenticación y recuperación de acceso, mascotas, citas y disponibilidad. Los contratos se revisaron contra OpenAPI del backend (incremento 0.7.0). La app todavía debe conectar sus flujos a estos servicios.

### `packages/accessibility-kit`

Incluye utilidades de contraste y escala de texto, helpers de anuncios ARIA para web heredados y live regions/anuncios para React Native.

## Estado

- La app móvil del propietario está en construcción; `apps/propietario/App.tsx` conserva la pantalla de ejemplo de Expo.
- La entrada raíz `index.ts` apunta a `./App`; resolver ese punto de entrada está pendiente de una decisión del equipo.
- El portal administrativo está reservado para una fase futura.
- No hay pantallas web de propietario ni host TanStack en el repositorio.

## Comandos

```bash
npm start
npm run android
npm run ios
npm run web
npm run lint
npx tsc --noEmit
```
