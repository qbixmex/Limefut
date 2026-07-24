---
name: testing-form-fields
description: >
  Conventions for testing individual form field components that use
  react-hook-form with zod validation. Activate when writing tests
  for field-level components.
---

## General

- Test file mirrors source under `src/tests/`
- Naming: `<field-name>.test.tsx`
- All helpers (`TestWrapper`, `Set<Scenario>`, `FormValueDisplay`, etc.) are defined **inside the test file** (not shared)

## Imports

```typescript
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldComponent } from '@/app/admin/.../form-fields/field-component';
import { schema } from '@/shared/schemas';
```

Include `waitFor` from testing-library when the test needs to wait for async validation.

## TestWrapper Pattern

Every test file defines its own `TestWrapper`:

```typescript
function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ fieldName: FieldType }>({
    resolver: zodResolver(mySchema) as any,
    defaultValues: { fieldName: defaultValue },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}
```

- The `as any` cast on resolver is expected
- Default values should match the field's expected shape
- Use generics in `useForm<>` for type safety

## Helper Components

### Value Display (for asserting live form values)

```typescript
function FormValueDisplay() {
  const fieldValue = useWatch({ name: 'fieldName' });
  return <span data-testid="field-value">{fieldValue}</span>;
}
```

### Error Indicator (for asserting validation errors)

```typescript
function FormErrorIndicator() {
  const { formState } = useFormContext();
  const error = formState.errors.fieldName;
  const message = typeof error === 'object' && error !== null && 'message' in error
    ? String(error.message) : '';
  return <span data-testid="form-error">{message}</span>;
}
```

### Scenario Setters (useEffect + setValue)

```typescript
function Set<Scenario>() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('fieldName', value, { shouldValidate: true });
  }, [setValue]);
  return null;
}
```

Always use `shouldValidate: true` so the validation runs immediately.
Name helpers clearly: `SetNonStringValue`, `SetValidFile`, `SetTooLargeFile`, `SetValidDate`, `SetInvalidUUIDs`.

### Validation Trigger (for fields that start empty and need explicit validation)

```typescript
function TriggerValidation() {
  const { trigger } = useFormContext();
  useEffect(() => { trigger(); }, [trigger]);
  return null;
}
```

## Field Types and Required Tests

### Text Input (name, permalink, country)

| # | Test | Assertion |
|---|---|---|
| 1 | Render correctly | `getByRole('textbox')` present |
| 2 | No error when empty (optional field) | `aria-invalid="false"` |
| 3 | Error when non-string value | `<SetNonStringValue />`, alert with type error |
| 4 | Error when < min characters | `userEvent.type()` short value, check alert |
| 5 | No error when valid length | `userEvent.type()` valid value, no alert |
| 6 | Error when > max characters | `userEvent.type()` long value, check alert |

### Textarea (description)

Same test set as Text Input, with textarea-specific max length.

### File / Image (image)

| # | Test | Assertion |
|---|---|---|
| 1 | Render correctly | `getByRole('group')` or label present |
| 2 | No error when empty | No `role('alert')` |
| 3 | Error when not a File | `<SetNonFileValue />`, alert with type error |
| 4 | No error when valid File | `<SetValidFile />`, no alert via `waitFor` |
| 5 | Error when file too large | `<SetTooLargeFile />`, alert with size error |
| 6 | Error when wrong file type | `<SetInvalidTypeFile />`, alert with type error |

### Switch / Toggle (active)

| # | Test | Assertion |
|---|---|---|
| 1 | Render correctly | `getByRole('switch')` with label |
| 2 | Default unchecked | `aria-checked="false"` |
| 3 | Toggle on when clicked | `userEvent.click()`, then `aria-checked="true"` |
| 4 | Toggle off when clicked twice | Click twice, then `aria-checked="false"` |
| 5 | Error when not a boolean | `<SetNonBooleanValue />`, error text |

### Date Picker (startDate, endDate)

| # | Test | Assertion |
|---|---|---|
| 1 | Render correctly | Button with placeholder text |
| 2 | Error when no date | `<TriggerValidation />`, alert with date error |
| 3 | No error when valid date | `<SetValidDate />`, no alert + formatted date visible |

### Multi-Select (categories)

| # | Test | Assertion |
|---|---|---|
| 1 | Render correctly | Placeholder + count text |
| 2 | No error when empty | No `role('alert')` |
| 3 | No error when valid values | `<SetValidUUIDs />`, count updates |
| 4 | Error when invalid values | `<SetInvalidUUIDs />`, `<FormErrorIndicator />` |

### Array Input (cities)

| # | Test | Assertion |
|---|---|---|
| 1 | Render correctly | `getByRole('textbox')` present |
| 2 | No error when empty | `aria-invalid="false"` |
| 3 | No error when valid strings | `<Set valid array />`, no alert via `waitFor` |
| 4 | Error when non-strings | `<Set non-string array />`, `aria-invalid="true"` |

## Auto-permalink Pattern (name field)

When a field auto-generates a permalink on type, include:

```typescript
test('Should auto-generate permalink when typing', async () => {
  render(<NameField isPermalinkEdited={false} />, { wrapper: TestWrapper });
  const user = userEvent.setup();
  await user.type(screen.getByRole('textbox'), 'Some Name');
  expect(screen.getByTestId('permalink-value')).toHaveTextContent(slugify('Some Name'));
});
```

## Example References

Categorías:
- `src/tests/admin/categorias/form-fields/name-field.test.tsx`
- `src/tests/admin/categorias/form-fields/permalink-field.test.tsx`
- `src/tests/admin/categorias/form-fields/name-permalink-fields.test.tsx`

Torneos:
- `src/tests/admin/torneos/form-fields/name-field.test.tsx`
- `src/tests/admin/torneos/form-fields/permalink-field.test.tsx`
- `src/tests/admin/torneos/form-fields/country-field.test.tsx`
- `src/tests/admin/torneos/form-fields/description-textarea.test.tsx`
- `src/tests/admin/torneos/form-fields/image-field.test.tsx`
- `src/tests/admin/torneos/form-fields/active-switch.test.tsx`
- `src/tests/admin/torneos/form-fields/cities-field.test.tsx`
- `src/tests/admin/torneos/form-fields/categories-form-select.test.tsx`
- `src/tests/admin/torneos/form-fields/initial-date-select-field.test.tsx`
- `src/tests/admin/torneos/form-fields/end-date-select-field.test.tsx`
