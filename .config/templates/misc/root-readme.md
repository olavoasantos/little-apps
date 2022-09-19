<p align="center">
  <img src="./.config/assets/full-logo.svg" />
</p>

## About

<%= description %>

## What's in the box?

### Apps

<%= apps.map(app => `* [${app}](./apps/${app})`).join('\n') %>

### Packages

<%= packages.map(package => `* [${package}](./packages/${package})`).join('\n') %>

## Developing

- [Current Sprint: <%= sprint %>](https://github.com/users/olavoasantos/projects/2/views/2);

### Setup

After cloning the repo, run `pnpm i` to install dependencies.

```bash
pnpm i
```

### Base Commands

#### Build all modules

```bash
pnpm build
```

#### Start the projects in development mode

```bash
pnpm dev
```

#### Format files in the project

```bash
pnpm format
```

#### Lint files in the project

```bash
pnpm lint
```

#### Install git hooks

```bash
pnpm prepare
```

#### `test`

##### Run tests for all packages

```bash
pnpm test
```

##### Collect coverage from all projects

```bash
pnpm test:coverage
```

## Contributors

- [Olavo Amorim Santos](https://github.com/olavoasantos)
