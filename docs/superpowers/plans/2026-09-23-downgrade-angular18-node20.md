# Migración a Node 20 + Angular 18 (Karma) — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Proyecto funcionando con Node 20 y Angular 18.2, con `ng test` sobre Karma + Jasmine y build con polyfill de `zone.js`.

**Architecture:** Se baja el proyecto de Angular 21 a 18.2 (`@angular/*`), se añade `zone.js` (obligatorio en v18), se sustituye el runner de tests Vitest por el builder de Karma estándar (`@angular-devkit/build-angular:karma`), y se deja el proyecto listo para Node 20 (`.nvmrc` + `engines`, lockfile regenerado con Node 20.19.6).

**Tech Stack:** Angular 18.2, TypeScript 5.5, Karma 6 + Jasmine 5, zone.js 0.14, Karma-Chrome-Launcher 3 (con ChromeHeadlessCI sobre Brave vía `CHROME_BIN`), Node 20.

**Spec:** `docs/superpowers/specs/2026-09-23-downgrade-angular18-node20-design.md`

## Global Constraints

- Versiones: `@angular/*` y `@angular/cli` → `^18.2.0`; `@angular-devkit/build-angular` → `^18.2.0`; `zone.js` → `~0.14.0`; `typescript` → `~5.5.4`.
- `engines.node` = `">=20.11.1 <21"` (Angular 18 requiere Node ≥20.11.1).
- Builder de build/serve: seguir con `@angular/build:application` / `@angular/build:dev-server` (sin cambios de arquitectura).
- Todos los pasos de verificación se ejecutan con Node 20: `PATH="$HOME/.nvm/versions/node/v20.19.6/bin:$PATH"`.
- No se toca la lógica de app: solo `app-module.ts` (eliminar `provideBrowserGlobalErrorListeners`).
- Navegador de test: Brave en `/usr/bin/brave`; `CHROME_BIN` configurable por env.

## Review Focus

- App arranca con zone.js en v18 (cambio de detección): el build incluye `polyfills: ["zone.js"]` y el `src/main.ts` no cambia.
- `ng test` corre headless en terminal sin abrir ventana (launcher `ChromeHeadless`).
- La cobertura genera el directorio `coverage/newcv` con reportes `html` y `text-summary`.
- Navegador ausente en otra máquina: `CHROME_BIN` se lee del env como fallback (`process.env.CHROME_BIN || '/usr/bin/brave'`).
- El lockfile queda regenerado bajo Node 20 (sin residuos de Node 24/npm 11 que bloqueen `npm ci` en Node 20).

---

### Task 1: Dependencias Angular 18 y tooling de Node 20

Bloquea este task solo si el build vuelve a compilar: elimina la API v21 y añade zone.js. Si el `ng build` falla por otro API de v21 detectada en el barrido, corregir esa línea en este mismo task.

**Files:**
- Modify: `package.json` (dependencias + `engines`)
- Create: `.nvmrc`
- Modify: `src/app/app-module.ts` (eliminar `provideBrowserGlobalErrorListeners`)
- Regenerado: `package-lock.json` (eliminar y reinstalar)

**Interfaces:**
- Consumes: nada (primera tarea).
- Produces: `package.json` con versiones 18.2 instaladas; `.nvmrc` con `20`; `app-module.ts` compilable en v18; lockfile bajo Node 20. Las tareas 2 y 3 asumen que `ng build` ya compila.

- [ ] **Step 1: Editar `package.json`**

Reemplazar `dependencies` y `devDependencies` por:

```json
"dependencies": {
  "@angular/common": "^18.2.0",
  "@angular/compiler": "^18.2.0",
  "@angular/core": "^18.2.0",
  "@angular/forms": "^18.2.0",
  "@angular/platform-browser": "^18.2.0",
  "@angular/platform-browser-dynamic": "^18.2.0",
  "@angular/router": "^18.2.0",
  "rxjs": "~7.8.0",
  "tslib": "^2.3.0",
  "zone.js": "~0.14.0"
},
"devDependencies": {
  "@angular/build": "^18.2.0",
  "@angular/cli": "^18.2.0",
  "@angular/compiler-cli": "^18.2.0",
  "@angular-devkit/build-angular": "^18.2.0",
  "@types/jasmine": "~5.1.0",
  "jasmine-core": "~5.1.0",
  "karma": "~6.4.0",
  "karma-chrome-launcher": "~3.2.0",
  "karma-coverage": "~2.2.0",
  "karma-jasmine": "~5.1.0",
  "karma-jasmine-html-reporter": "~2.1.0",
  "prettier": "^3.8.1",
  "typescript": "~5.5.4"
}
```

Notas: se eliminan `vitest`, `jsdom`, `webdriverio` y `@vitest/*` (no aparecen en el bloque). Añadir tras `"private": true`:

```json
"engines": {
  "node": ">=20.11.1 <21"
}
```

- [ ] **Step 2: Crear `.nvmrc`**

Contenido:

```
20
```

- [ ] **Step 3: Crear `src/test.ts`** (lo pide el karma builder del Task 2; evitamos otro `ng generate`)

```ts
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
```

- [ ] **Step 4: Eliminar la API de v21 en `app-module.ts`**

Editar `src/app/app-module.ts`:
- Línea de import: `import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';` → `import { NgModule } from '@angular/core';`
- Eliminar la línea `providers: [provideBrowserGlobalErrorListeners()],` (dejar `providers: [],` si no molesta el linter, o quitar la clave; el bloque `@NgModule` queda con `declarations`, `imports`, `bootstrap`).

- [ ] **Step 5: Reinstalar con Node 20 y regenerar el lockfile**

```bash
rm -rf node_modules package-lock.json
export PATH="$HOME/.nvm/versions/node/v20.19.6/bin:$PATH"
node -v   # esperado: v20.19.6
npm install
```

Esperado: instalación completa sin errores de engine/peer; `npm ls` sin dependencias faltantes.

- [ ] **Step 6: Verificar que `ng build` compila en v18**

```bash
export PATH="$HOME/.nvm/versions/node/v20.19.6/bin:$PATH"
npx ng build
```

Esperado: exit 0, build en `dist/newcv` generado, sin errores TS (incluye validar que `signal`, `styleUrl`, control flow y demás son compatibles con v18).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json .nvmrc src/test.ts src/app/app-module.ts
git commit -m "build: downgrade to Angular 18 and pin Node 20"
```

---

### Task 2: Runner de tests Karma + Jasmine

**Files:**
- Modify: `angular.json` (target `test` + polyfills de `build`)
- Modify: `karma.conf.js` (reescribir)
- Modify: `tsconfig.json` (module + moduleResolution)
- Modify: `tsconfig.spec.json` (types)

**Interfaces:**
- Consumes: dependencias Karma instaladas (Task 1); `src/test.ts` ya creado.
- Produces: `ng test` funcional vía Karma en ChromeHeadless/ChromeHeadlessCI; `ng build` con polyfill zone.js. Los tests existentes (`src/**/*.spec.ts`) deben pasar tal cual.

- [ ] **Step 1: Añadir polyfills de zona al build en `angular.json`**

En el bloque `projects.newcv.architect.build.options`, después de `"browser": "src/main.ts"`, añadir:

```json
"polyfills": ["zone.js"]
```

- [ ] **Step 2: Cambiar el target `test` a Karma en `angular.json`**

Reemplazar el bloque `projects.newcv.architect.test` por:

```json
"test": {
  "builder": "@angular-devkit/build-angular:karma",
  "options": {
    "main": "src/test.ts",
    "polyfills": ["zone.js", "zone.js/testing"],
    "tsConfig": "tsconfig.spec.json",
    "karmaConfig": "karma.conf.js",
    "codeCoverage": true
  }
}
```

- [ ] **Step 3: Reescribir `karma.conf.js`**

Contenido completo:

```js
// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

// Sin Chrome instalado en el entorno: usa Brave como CHROME_BIN por defecto.
process.env.CHROME_BIN = process.env.CHROME_BIN || '/usr/bin/brave';

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {},
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/newcv'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    reporters: ['progress', 'kjhtml'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu'],
      },
    },
    browsers: ['ChromeHeadless'],
    restartOnFileChange: true,
  });
};
```

- [ ] **Step 4: Ajustar `tsconfig.json`**

En `compilerOptions`:
- `"module": "preserve"` → `"module": "es2022"`
- Añadir `"moduleResolution": "bundler"`

- [ ] **Step 5: Ajustar `tsconfig.spec.json`**

En `compilerOptions.types`:
- `"vitest/globals"` → `"jasmine"`

- [ ] **Step 6: Ejecutar los tests con Karma (CI headless)**

```bash
export PATH="$HOME/.nvm/versions/node/v20.19.6/bin:$PATH"
npx ng test --watch=false --no-progress --browsers=ChromeHeadlessCI --code-coverage
```

Esperado: exit 0, `Executed 16 of 16 SUCCESS` (o el número que haya), y reporte `coverage/newcv/index.html` + resumen `text-summary` en consola.

- [ ] **Step 7: Verificar que el comando original del usuario ya no falla**

```bash
export PATH="$HOME/.nvm/versions/node/v20.19.6/bin:$PATH"
npx ng test --no-watch --no-progress --browsers=ChromeHeadlessCI --code-coverage
```

Esperado: mismo resultado verde (este comando valida que queda un alias `--no-watch` correcto y que `--code-coverage` ya no es "Unknown argument").

- [ ] **Step 8: Commit**

```bash
git add angular.json karma.conf.js tsconfig.json tsconfig.spec.json
git commit -m "test: switch to Karma + Jasmine runner with coverage"
```

---

### Task 3: Verificación final

**Files:**
- Ninguno en producción. Este task valida el estado del repo completo.

**Interfaces:**
- Consumes: resultado de Tasks 1 y 2 (build v18 OK, tests Karma OK).
- Produces: confirmación de que el repo cumple el requisito Node 20 + Angular 18.

- [ ] **Step 1: Confirmar versiones**

```bash
export PATH="$HOME/.nvm/versions/node/v20.19.6/bin:$PATH"
node -v          # v20.19.6
npm -v           # 10.x (el npm de Node 20)
npx ng version   # Angular CLI: 18.2.x
```

- [ ] **Step 2: Build de producción**

```bash
export PATH="$HOME/.nvm/versions/node/v20.19.6/bin:$PATH"
npx ng build --configuration production
```

Esperado: exit 0 sin warnings de budgets.

- [ ] **Step 3: Suite completa de tests con cobertura**

```bash
export PATH="$HOME/.nvm/versions/node/v20.19.6/bin:$PATH"
npx ng test --no-watch --no-progress --browsers=ChromeHeadlessCI --code-coverage
```

Esperado: exit 0, 16/16 success, coverage generado.

- [ ] **Step 4: Sanity de lockfile**

```bash
export PATH="$HOME/.nvm/versions/node/v20.19.6/bin:$PATH"
npm ci --dry-run
```

Esperado: no reporta discrepancias con `package-lock.json`.

- [ ] **Step 5: Commit final si quedó algún cambio residual**

```bash
git status
git add -A
git commit -m "chore: final verification for Node 20 + Angular 18"
```
(Si `git status` está limpio, omitir el commit.)