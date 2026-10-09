---
name: tailwind-to-css-modules
description: >
  Conventions for extracting inline Tailwind utility classes from a
  component into a co-located styles.module.css with semantic class
  names. Activate when asked to move Tailwind classes into a CSS module,
  create/edit a styles.module.css, or convert a component's inline
  styles into named CSS classes.
---

## Goal

Move inline Tailwind utilities out of JSX and into a co-located
`styles.module.css` using meaningful, semantic class names
(`styles.heading`, `styles.imageWrapper`) instead of utility soup.

## General

- Co-locate `styles.module.css` next to the component (e.g.
  `content-images/index.tsx` + `content-images/styles.module.css`).
- First line of every CSS module: `@reference "#globals.css";`
- Import with single quotes: `import styles from './styles.module.css';`
  (the repo ESLint enforces `@stylistic/quotes`).
- Class names are **camelCase** and describe intent, not appearance.
- Always reference via the `styles.` prefix.
- Never touch non-style props (`variant`, `size`, `type`, `aria-label`,
  `disabled`, handlers) — only swap `className`.
- An empty `styles.module.css` starter is:
  ```css
  @reference "#globals.css";
  ```

## Conversion Rules

| Tailwind | CSS module |
|---|---|
| Simple utilities (`flex`, `grid`, `block`, `absolute`, `relative`) | plain CSS properties (`display: flex`, `position: absolute`) |
| `font-semibold` | `font-weight: 600` |
| `font-bold` | `font-weight: 700` |
| `text-3xl` | `font-size: var(--text-3xl)` |
| `rounded-lg` | `border-radius: var(--radius-lg)` |
| `m-5`, `p-5`, `gap-5`, `mt-8`, `mb-5` | `--spacing(5)`, `--spacing(8)` |
| `text-red-500` | `color: var(--color-red-500)` |
| `bg-gray-800` | `background-color: var(--color-gray-800)` |
| `bg-slate-900/80` | `background-color: --alpha(var(--color-slate-900) / 80%)` |
| `size-[25px]`, `w-[150px]`, `h-[150px]` | `width: 150px; height: 150px;` |
| `hover:bg-cyan-600` | `@variant hover { ... }` |
| `focus:outline-0` | `@variant focus { ... }` |
| `bg-cyan-600/70!` | `background-color: --alpha(var(--color-cyan-600) / 70%) !important;` |
| `md:...`, `lg:...`, `dark:...` | `@variant md { ... }`, `@variant lg { ... }`, `@variant dark { ... }` |
| Complex / keyframes / many internal classes (`ring`, `animate-spin`, gradients) | `@apply` inside the class, or leave the utility inline |

### Responsive & other variants (`md:`, `lg:`, `dark:`)

When a utility has a breakpoint or variant prefix, nest it in a
`@variant` block instead of writing a media query by hand:

```css
/* reference */
@apply text-lg md:text-xl lg:text-2xl;
```

```css
.heading {
  font-size: var(--text-lg);

  @variant md {
    font-size: var(--text-xl);
  }

  @variant lg {
    font-size: var(--text-2xl);
  }
}
```

Use the same pattern for every variant, including `dark`:

```css
@variant dark {
  background-color: var(--color-gray-900);
}
```

### State variants (`hover:`, `focus:`)

State variants use `@variant` too — do not hand-write `:hover` /
`:focus` selectors:

```css
/* reference */
@apply text-gray-800 hover:text-blue-600;
```

```css
.link {
  color: var(--color-gray-800);

  @variant hover {
    color: var(--color-blue-600);
  }
}
```

Variants nest, e.g. `dark:hover:`:

```css
.darkButton {
  @variant dark {
    background-color: var(--color-gray-800);

    @variant hover {
      background-color: var(--color-gray-900);
    }
  }
}
```

### Why `!important`

CSS modules are **unlayered**, so they normally beat Tailwind's
`@layer utilities`. But when the original utility carried `!` (used to
override a component variant, e.g. shadcn `Button`), keep that intent
with `!important`.

### Conditional classes

Keep `cn` only for conditional composition:

```tsx
className={cn(styles.deleteButton, {
  [styles.deleteButtonDisabled]: isDeletingImage === image.imageUrl,
})}
```

Because `tailwind-merge` cannot recognize module class names, colors
from variants won't be de-duped — rely on `!important` / unlayered CSS
for the override.

### Repeated `@variant hover` on disabled state

When a base class has a hover variant and a disabled modifier must win
while hovered, repeat the override inside the disabled class, placed
after the base rule:

```css
.deleteButton {
  cursor: pointer;
  background-color: --alpha(var(--color-pink-600) / 70%) !important;

  @variant hover {
    background-color: var(--color-pink-600) !important;
  }
}

.deleteButtonDisabled {
  cursor: not-allowed;
  background-color: var(--color-gray-500) !important;

  @variant hover {
    background-color: var(--color-gray-500) !important;
  }
}
```

## Reference: converted component

Input JSX:

```tsx
<h2 className="text-3xl mt-8 font-semibold mb-5">Imágenes del contenido</h2>
<div className="flex flex-wrap gap-5"> ... </div>
<figure className="relative w-fit">
  <Image className="w-[150px] h-[150px] object-cover rounded-lg" />
  <div className="absolute top-0 right-0 w-full flex justify-between gap-2">
    <Button className={cn('bg-cyan-600/70! hover:bg-cyan-600! cursor-pointer')}>
```

Output:

```tsx
<h2 className={styles.heading}>Imágenes del contenido</h2>
<div className={styles.imagesList}> ... </div>
<figure className={styles.imageWrapper}>
  <Image className={styles.image} />
  <div className={styles.actions}>
    <Button className={styles.copyButton}>
```

```css
@reference "#globals.css";

.heading {
  margin-top: --spacing(8);
  margin-bottom: --spacing(5);
  font-size: var(--text-3xl);
  font-weight: 600;
}

.imagesList {
  display: flex;
  flex-wrap: wrap;
  gap: --spacing(5);
}

.imageWrapper {
  position: relative;
  width: fit-content;
}

.image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: var(--radius-lg);
}

.actions {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: --spacing(2);
}

.copyButton {
  cursor: pointer;
  background-color: --alpha(var(--color-cyan-600) / 70%) !important;

  @variant hover {
    background-color: var(--color-cyan-600) !important;
  }
}
```

Full working example:
`src/app/admin/paginas/(components)/content-images/`.

## Procedure

1. Read the component and any existing `styles.module.css`.
2. List every element that has a `className`, in render order.
3. Choose a semantic camelCase name per element.
4. Write the CSS module (simple properties first, then variants).
5. Replace each inline `className` with `styles.<name>`.
6. Keep `cn(...)` only where classes are conditional.
7. Verify:
   - run the component's test (`npx vitest --run <test file>`)
   - `npm run type-check`
   - `npx eslint <component>` (import must use single quotes)

## Do Not

- Do not rename files or move components.
- Do not extract classes from a different component's file.
- Do not invent wrapper elements just to hold styles.
