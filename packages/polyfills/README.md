<p align="center">
  <img src="../../.config/assets/icon.svg" />
</p>

<h1 align="center">@little-apps/polyfills</h1>

## About

Set of polyfills used across Little App's  libraries and apps

## Consuming the package

Add `@little-apps/polyfills` to your project's dependencies.

```json
{
  "dependencies": {
    "@little-apps/polyfills": "*"
  }
}
```

After running `pnpm i`, you can import the package in your code.

```ts
import {...} from '@little-apps/polyfills';
```

## Contributing

### Building the project

#### Build the project

```bash
pnpm build
```

#### Build the project's code

```bash
pnpm build:code
```

#### Build the project's types

```bash
pnpm build:types
```

### Development mode

#### Start the project in development mode

```bash
pnpm dev
```

#### Start the project's code in development mode

```bash
pnpm dev:code
```

#### Start the project's types in development mode

```bash
pnpm dev:types
```

### Testing

#### Run tests

```bash
pnpm test
```

#### Collect test coverage

```bash
pnpm test:coverage
```

#### Run tests in watch mode

```bash
pnpm test:dev
```

## Contributors

- [Olavo Amorim Santos](https://github.com/olavoasantos)
