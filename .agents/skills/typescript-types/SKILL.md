---
name: typescript-types
description: Enforce consistent TypeScript type formatting conventions
compatibility: opencode
metadata:
  stack: frontend
  language: typescript
---

## What I do

I ensure all TypeScript types follow project formatting conventions.

## Rules

- Type names must start with uppercase letter (PascalCase)
- Each property in a type must end with semicolon
- Use `Readonly` for immutable object types
- Use `type` for simple types and unions
- Use `interface` for object shapes that might be extended
- Maintain consistent formatting throughout

## Examples of Usage

Here are examples illustrating the rules:

### 1. Basic type

```typescript
type User = {
  name: string;
  email: string;
  active: boolean;
};
```

### 2. Type with optional properties

```typescript
type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
};
```

### 3. Type with unions

```typescript
type Status = 'active' | 'inactive' | 'pending';
```

### 4. Readonly type example

```typescript
type Config = Readonly<{
  apiUrl: string;
  timeout: number;
}>;
```

### 5. Exported vs internal types

```typescript
export type PublicProduct = {
  id: string;
  name: string;
  email: string;
  password: string;
};

type InternalUser = PublicUser & {
  passwordHash: string;
  country: string;
  city: string;
};
```

### 6. Interface for comparison

```typescript
interface ExampleInterface {
  id: string;
  value: number;
}
```
