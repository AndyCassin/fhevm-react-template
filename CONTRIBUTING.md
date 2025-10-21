# Contributing to FHEVM SDK

Thank you for your interest in contributing to the FHEVM SDK project! This document provides guidelines and instructions for contributing.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Project Structure](#project-structure)
5. [Making Changes](#making-changes)
6. [Testing](#testing)
7. [Pull Request Process](#pull-request-process)
8. [Coding Standards](#coding-standards)
9. [Commit Messages](#commit-messages)

## Code of Conduct

This project adheres to a code of conduct that all contributors are expected to follow. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm 9+ or yarn 1.22+
- Git
- TypeScript knowledge
- Familiarity with React (for React hooks)
- Understanding of Ethereum and Web3

### Finding Issues to Work On

- Check the [GitHub Issues](https://github.com/your-repo/issues)
- Look for issues labeled `good first issue` or `help wanted`
- Feel free to open new issues for bugs or feature requests

## Development Setup

1. **Fork the Repository**

```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/fhevm-sdk-template.git
cd fhevm-sdk-template
```

2. **Install Dependencies**

```bash
npm install
```

3. **Build the SDK**

```bash
npm run build:sdk
```

4. **Run Examples**

```bash
# Next.js example
npm run dev:nextjs

# Patent License example
npm run dev:patent
```

5. **Run Tests**

```bash
npm test
```

## Project Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/           # Core SDK package
│       ├── src/
│       │   ├── client.ts    # Main FHEVM client
│       │   ├── instance.ts  # Instance management
│       │   ├── encryption.ts # Encryption utilities
│       │   ├── decrypt.ts   # Decryption utilities
│       │   ├── types.ts     # TypeScript types
│       │   └── react/       # React hooks
│       ├── tests/
│       └── package.json
├── examples/
│   ├── nextjs-example/      # Next.js example
│   ├── patent-license/      # Patent license dApp
│   └── node-vanilla/        # Vanilla Node.js example
├── docs/                    # Documentation
└── package.json
```

## Making Changes

### Creating a Branch

Create a feature branch from `main`:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications

### Development Workflow

1. **Make Your Changes**

Edit files in the appropriate directory:
- SDK changes: `packages/fhevm-sdk/src/`
- Example updates: `examples/*/`
- Documentation: `docs/` or `README.md`

2. **Test Your Changes**

```bash
# Run SDK tests
cd packages/fhevm-sdk
npm test

# Test with examples
cd ../..
npm run dev:nextjs
# Test functionality in browser
```

3. **Build and Verify**

```bash
npm run build:sdk
npm run lint
```

## Testing

### SDK Unit Tests

```bash
cd packages/fhevm-sdk
npm test
```

### Example Testing

1. **Next.js Example**

```bash
cd examples/nextjs-example
npm run dev
# Open http://localhost:3000
# Test all functionality manually
```

2. **Patent License Example**

```bash
cd examples/patent-license
npm run compile
npm test
npm start
# Test in browser at http://localhost:3001
```

### Test Coverage

We aim for high test coverage:

```bash
cd packages/fhevm-sdk
npm run test:coverage
```

### Writing Tests

Example test structure:

```typescript
import { describe, it, expect } from 'vitest';
import { createFhevmInstance } from '../src';

describe('createFhevmInstance', () => {
  it('should create instance with provider', async () => {
    const mockProvider = /* mock provider */;
    const instance = await createFhevmInstance({ provider: mockProvider });
    expect(instance).toBeDefined();
  });

  it('should throw error without provider', async () => {
    await expect(createFhevmInstance({})).rejects.toThrow();
  });
});
```

## Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No console.log or debug code
- [ ] TypeScript compiles without errors
- [ ] Examples work correctly

### Submitting a Pull Request

1. **Commit Your Changes**

```bash
git add .
git commit -m "feat: add new encryption method"
```

2. **Push to Your Fork**

```bash
git push origin feature/your-feature-name
```

3. **Create Pull Request**

- Go to GitHub and click "New Pull Request"
- Select your fork and branch
- Fill in the PR template:

```markdown
## Description
Brief description of your changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Code follows style guidelines
```

4. **Review Process**

- Maintainers will review your PR
- Address any requested changes
- Once approved, it will be merged

### PR Guidelines

- Keep PRs focused on a single feature/fix
- Write clear, descriptive PR titles
- Include screenshots for UI changes
- Reference related issues (e.g., "Fixes #123")
- Respond promptly to review feedback

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types, avoid `any`
- Use interfaces for object structures
- Export types for public APIs

Example:

```typescript
// Good
export interface EncryptionOptions {
  type: 'uint32' | 'uint64' | 'bool';
  value: number | boolean;
}

export async function encrypt(
  options: EncryptionOptions
): Promise<EncryptedData> {
  // ...
}

// Avoid
export async function encrypt(options: any): Promise<any> {
  // ...
}
```

### React Hooks

- Follow React hooks rules
- Use meaningful hook names (use*)
- Provide TypeScript types for parameters and returns
- Include error handling

Example:

```typescript
export function useEncryptedInput() {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = async (
    value: number,
    type: EncryptionType
  ): Promise<EncryptedData> => {
    setIsEncrypting(true);
    setError(null);
    try {
      // Encryption logic
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsEncrypting(false);
    }
  };

  return { encrypt, isEncrypting, error };
}
```

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas
- Use semicolons
- Maximum line length: 100 characters

Run formatter:

```bash
npm run format
```

### Documentation

- Add JSDoc comments for public APIs
- Include usage examples
- Document parameters and return types

Example:

```typescript
/**
 * Creates an FHEVM instance for encryption operations
 *
 * @param config - Configuration options
 * @param config.provider - Ethers provider instance
 * @param config.chainId - Optional chain ID
 * @returns Promise resolving to FhevmClient instance
 *
 * @example
 * ```typescript
 * const provider = new BrowserProvider(window.ethereum);
 * const fhevm = await createFhevmInstance({ provider });
 * ```
 */
export async function createFhevmInstance(
  config: FhevmConfig
): Promise<FhevmClient> {
  // ...
}
```

## Commit Messages

Follow conventional commits format:

```
type(scope): subject

body

footer
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or tooling changes

### Examples

```bash
feat(sdk): add support for uint128 encryption

Implements uint128 encryption in the core SDK.
Includes tests and documentation.

Closes #123
```

```bash
fix(react): resolve hook dependency issue

Fix infinite loop in useEncryptedInput caused by
missing dependency in useEffect.

Fixes #456
```

```bash
docs(readme): update installation instructions

Add npm and yarn installation examples.
Include troubleshooting section.
```

## Questions?

- Open a GitHub Discussion
- Create an issue
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers this project.

Thank you for contributing!
