# Cypress Setup & Configuration (QA)

This document outlines the steps taken to set up and configure Cypress for end-to-end testing in this project, including solutions to common configuration issues with Vite/React and ES modules.

## 1. Install Cypress

Run the following command in your project root:

```sh
npx cypress install
```

## 2. Create Cypress Config File

Cypress requires a configuration file. In a project with `"type": "module"` in `package.json`, you must use the `.cjs` extension for CommonJS compatibility.

Create a file named `cypress.config.cjs` in your project root with the following content:

```js
module.exports = {
  e2e: {
    baseUrl: 'http://localhost:5173', // Vite default
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
};
```

## 3. Remove Old Config Files

If you have a `cypress.config.ts` or `cypress.config.js` file, delete or rename it. Cypress will use the `.cjs` file for configuration.

## 4. Add Your Tests

Create your test files in `cypress/e2e/`. Example:

- `cypress/e2e/player.cy.js`

## 5. Run the Dev Server

Start your Vite dev server:

```sh
npm run dev
```

## 6. Open Cypress

In a new terminal, run:

```sh
npx cypress open
```

This will launch the Cypress Test Runner UI.

## 7. Troubleshooting

- **SyntaxError: Unexpected token 'export'**
  - Cause: Cypress tried to load an ES module config file (`.ts` or `.js` with `export default`).
  - Solution: Use a `.cjs` config file with `module.exports` syntax.

- **ReferenceError: module is not defined in ES module scope**
  - Cause: Project uses `"type": "module"` and config file is `.js`.
  - Solution: Rename config to `cypress.config.cjs`.

---

**You are now ready to write and run Cypress tests for your project!** 