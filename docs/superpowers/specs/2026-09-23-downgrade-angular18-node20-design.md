# Diseño: Migración a Node 20 + Angular 18 (con Karma + Jasmine)

**Fecha:** 2026-09-23
**Contexto:** Requisito académico: el proyecto debe correr con Node 20 y Angular 18.

## Estado actual

- Node 24.19.0 (vía fnm), Angular 21.2.x.
- Framework NgModule (no standalone). Bootstrap con `platformBrowser().bootstrapModule`.
- Build/tests basados en `@angular/build:unit-test` (Vitest) + `jsdom`.
- Sin `zone.js` (Angular 21 corre sin zonas) — *obligatorio* en Angular 18.
- `karma.conf.js` residual que referencia paquetes Karma ya no instalados.
- Tests: 16 pruebas Jasmine-clásicas (`describe`/`it`/`expect` + TestBed), sin API específica de Vitest → portables a Karma sin cambios.
- Código usa una API de Angular 20/21: `provideBrowserGlobalErrorListeners()` en `app-module.ts`.
- Sin `src/test.ts`. Navegador disponible: Brave en `/usr/bin/brave` (sin Chrome).

## Estado objetivo

- Angular `^18.2.x` corriendo sobre **Node 20** (`>=20.11.1 <21`).
- `ng test` con el stack estándar del curso: **Karma + Jasmine** via `@angular-devkit/build-angular:karma`.
- `ng build` con el application builder (`@angular/build:application`) + polyfill de `zone.js`.
- Tests existentes pasando (16) con cobertura (`--code-coverage`).

## Cambios por archivo

### `package.json`
- Dependencias Angular (`@angular/common`, `@angular/compiler`, `@angular/core`, `@angular/forms`, `@angular/platform-browser`, `@angular/router`, `@angular/compiler-cli`, `@angular/cli`, `@angular/build`) → `^18.2.x`.
- Añadir `@angular/platform-browser-dynamic` `^18.2.x` (runner de tests de Karma).
- Añadir `zone.js` `~0.14.x` (runtime + polyfill).
- `typescript` → `~5.5.x`.
- Karma stack nuevo (devDependencies): `karma` `^6.4`, `karma-chrome-launcher` `^3.2`, `karma-jasmine` `^5.1`, `jasmine-core` `^5.1`, `@types/jasmine` `^5.1`, `karma-coverage` `^2.2`, `@angular-devkit/build-angular` `^18.2`.
- Quitar: `vitest`, `jsdom`, `webdriverio`.
- `"engines": { "node": ">=20.11.1 <21" }`.
- Mantener: `rxjs ~7.8.0`, `tslib`, `prettier`, scripts (`test: ng test`).

### `angular.json`
- `build`: añadir `"polyfills": ["zone.js"]`; resto intacto.
- `test`: cambiar a builder `@angular-devkit/build-angular:karma` con options:
  - `main`: `src/test.ts`
  - `polyfills`: `["zone.js", "zone.js/testing"]`
  - `tsConfig`: `tsconfig.spec.json`
  - `karmaConfig`: `karma.conf.js`
  - `codeCoverage`: `true`

### `src/test.ts` (nuevo)
Entrada estándar de Karma: `zone.js/testing` + `initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())`.

### `karma.conf.js`
Reescribir a config estándar v18 sobre la estructura existente:
- `plugins`: `karma-jasmine`, `karma-chrome-launcher`, `karma-jasmine-html-reporter`, `karma-coverage`.
- `frameworks: ['jasmine']`, `restartOnFileChange: true`.
- `CHROME_BIN` apuntando a `/usr/bin/brave` (hay Brave, no Chrome).
- `customLaunchers: { ChromeHeadlessCI: { base: 'ChromeHeadless', flags: ['--no-sandbox'] } }`.
- `browsers: ['ChromeHeadless']`.
- `coverageReporter`: `dir coverage/newcv`, reportes `html` + `text-summary`.
- `singleRun`, `autoWatch` controlados por CLI.

### `src/app/app-module.ts`
Eliminar `provideBrowserGlobalErrorListeners()` y su import (no existe en v18). Sin efecto visible en runtime.

### `tsconfig.json`
- `module` → `"es2022"`, añadir `"moduleResolution": "bundler"` (convención Angular 18).

### `tsconfig.spec.json`
- `types: ["vitest/globals"]` → `"jasmine"`.

### Node 20
- Añadir `.nvmrc` con `20` (compatible con fnm/nvm).
- Reinstalar dependencias y regenerar `package-lock.json` con Node 20.19.6 (disponible vía nvm).

## Fuera de alcance
- Refactor de componentes/servicios.
- Cambiar el scaffolding a standalone.
- Instalar Chrome: se usa Brave vía `CHROME_BIN`.

## Verificación
1. `ng build` (configuración production) sin errores.
2. `ng test --watch=false --browsers=ChromeHeadlessCI --code-coverage` → 16 tests en verde y reporte de cobertura generado.
3. `npm ls` sin dependencias faltantes/inválidas.
4. Confirmar con `node -v` en Node 20.