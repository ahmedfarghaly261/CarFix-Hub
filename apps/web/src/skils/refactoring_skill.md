# Refactoring Skill

## Purpose

Use this skill when refactoring an existing **React + Vite + TypeScript** project into a clean, scalable, modular architecture.

The goal is to reorganize the current file structure, move files to the correct locations, update all imports, and keep the app working exactly as before.

This skill is focused on:

- React
- Vite
- TypeScript
- Modular architecture
- Feature-based modules
- Zod validation
- Backend DTO mapping
- Frontend models
- Transformers
- Global API services

---

## Target Architecture

Refactor the project to match this structure:

```txt
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   ├── providers.tsx
│   └── routes.tsx
│
├── services/
│   ├── api.service.ts
│   ├── api-error.ts
│   └── token.service.ts
│
├── modules/
│   ├── auth/
│   │   ├── views/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── dtos/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── transformers/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   │
│   ├── user/
│   │   ├── views/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── dtos/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── transformers/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   │
│   └── dashboard/
│       ├── views/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── dtos/
│       ├── models/
│       ├── schemas/
│       ├── transformers/
│       ├── types/
│       ├── utils/
│       └── index.ts
│
├── components/
│   ├── ui/
│   └── common/
│
├── layouts/
├── hooks/
├── constants/
├── utils/
├── styles/
├── types/
├── main.tsx
└── vite-env.d.ts
```

---

## Refactoring Rules

### 1. Use `modules/` for feature-based code

Each module should own its own:

```txt
views/
components/
hooks/
services/
dtos/
models/
schemas/
transformers/
types/
utils/
index.ts
```

Example modules:

```txt
modules/auth/
modules/user/
modules/dashboard/
modules/products/
modules/orders/
modules/profile/
```

---

### 2. Use `views/` for full pages or screens

Move full route-level pages into module `views/`.

Examples:

```txt
modules/auth/views/LoginView.tsx
modules/auth/views/RegisterView.tsx
modules/user/views/UsersView.tsx
modules/user/views/UserDetailsView.tsx
modules/dashboard/views/DashboardView.tsx
```

If there is an existing `pages/` folder, move its files to the correct module `views/` folder.

Examples:

```txt
pages/Login.tsx      → modules/auth/views/LoginView.tsx
pages/Register.tsx   → modules/auth/views/RegisterView.tsx
pages/Users.tsx      → modules/user/views/UsersView.tsx
pages/Dashboard.tsx  → modules/dashboard/views/DashboardView.tsx
```

---

### 3. Use module `components/` for feature-specific components

Components that are used only inside one feature should stay inside that module.

Examples:

```txt
modules/user/components/UserForm.tsx
modules/user/components/UserTable.tsx
modules/user/components/UserCard.tsx

modules/auth/components/LoginForm.tsx
modules/auth/components/RegisterForm.tsx
```

Do not put feature-specific components in the root `components/` folder.

---

### 4. Use root `components/ui/` for reusable UI primitives

Use this folder for pure reusable UI components.

Examples:

```txt
components/ui/Button.tsx
components/ui/Input.tsx
components/ui/Modal.tsx
components/ui/Card.tsx
components/ui/Select.tsx
components/ui/Textarea.tsx
```

These components should not know about business logic.

---

### 5. Use root `components/common/` for shared app-level components

Use this folder for reusable layout or application components.

Examples:

```txt
components/common/Navbar.tsx
components/common/Sidebar.tsx
components/common/LoadingScreen.tsx
components/common/ErrorMessage.tsx
components/common/EmptyState.tsx
```

---

### 6. Use root `services/` only for global services

Global services should live in:

```txt
src/services/
```

Examples:

```txt
src/services/api.service.ts
src/services/api-error.ts
src/services/token.service.ts
```

Do not put global API configuration inside a module.

---

### 7. Use module `services/` for feature-specific API calls

Each module should have its own service for its own endpoints.

Examples:

```txt
modules/user/services/user.service.ts
modules/auth/services/auth.service.ts
modules/dashboard/services/dashboard.service.ts
```

Feature services should use the global API service.

Example:

```ts
import { apiService } from '@/services/api.service'
```

---

## DTO, Model, Schema, and Transformer Rules

### 8. Use `dtos/` for backend request and response shapes

DTOs should represent the backend data format exactly.

If the backend sends snake_case, the DTO should use snake_case.

Example:

```ts
export interface UserResponseDto {
  _id: string
  full_name: string
  email: string
  role_name: string
  created_at: string
}

export interface CreateUserRequestDto {
  full_name: string
  email: string
  password: string
}
```

DTO files should be placed like this:

```txt
modules/user/dtos/user.dto.ts
```

---

### 9. Use `models/` for frontend clean data shapes

Models should represent the format used by the UI.

The UI should use models, not backend DTOs.

Example:

```ts
export interface User {
  id: string
  name: string
  email: string
  roleName: string
  createdAt: Date
}
```

Model files should be placed like this:

```txt
modules/user/models/user.model.ts
```

---

### 10. Use `schemas/` for Zod validation

Use Zod for form validation and input validation.

Install Zod if it does not exist:

```bash
npm install zod
```

For React Hook Form integration, install:

```bash
npm install react-hook-form @hookform/resolvers
```

Example:

```ts
import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>
```

Schema files should be placed like this:

```txt
modules/user/schemas/user.schema.ts
```

---

### 11. Use `transformers/` for mapping

Transformers should map:

```txt
Backend Response DTO
→ Frontend Model
→ UI
```

And for sending data:

```txt
Form Values
→ Zod Validation
→ Request DTO
→ API Service
```

Example:

```ts
import type { UserResponseDto, CreateUserRequestDto } from '../dtos/user.dto'
import type { User } from '../models/user.model'
import type { CreateUserFormValues } from '../schemas/user.schema'

export function userDtoToModel(dto: UserResponseDto): User {
  return {
    id: dto._id,
    name: dto.full_name,
    email: dto.email,
    roleName: dto.role_name,
    createdAt: new Date(dto.created_at),
  }
}

export function usersDtoToModels(dtos: UserResponseDto[]): User[] {
  return dtos.map(userDtoToModel)
}

export function createUserFormToDto(
  values: CreateUserFormValues,
): CreateUserRequestDto {
  return {
    full_name: values.name,
    email: values.email,
    password: values.password,
  }
}
```

Transformer files should be placed like this:

```txt
modules/user/transformers/user.transformer.ts
```

---

## Global API Service Rules

### 12. Create a global API service

Place the Axios instance here:

```txt
src/services/api.service.ts
```

Example:

```ts
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

import { tokenService } from './token.service'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: true,
    })

    this.setupRequestInterceptor()
    this.setupResponseInterceptor()
  }

  private setupRequestInterceptor() {
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = tokenService.getToken()

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        return config
      },
      (error: AxiosError) => Promise.reject(error),
    )
  }

  private setupResponseInterceptor() {
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          tokenService.removeToken()
        }

        return Promise.reject(error)
      },
    )
  }

  get<T>(url: string, config?: AxiosRequestConfig) {
    return this.api.get<T>(url, config)
  }

  post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) {
    return this.api.post<T>(url, data, config)
  }

  put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) {
    return this.api.put<T>(url, data, config)
  }

  patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) {
    return this.api.patch<T>(url, data, config)
  }

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.api.delete<T>(url, config)
  }
}

export const apiService = new ApiService()
```

---

### 13. Create a global API error helper

Place it here:

```txt
src/services/api-error.ts
```

Example:

```ts
import type { AxiosError } from 'axios'

interface ApiErrorResponse {
  message?: string
  error?: string
}

export function getApiErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse>

  return (
    axiosError.response?.data?.message ||
    axiosError.response?.data?.error ||
    axiosError.message ||
    'Something went wrong'
  )
}
```

---

### 14. Create a global token service

Place it here:

```txt
src/services/token.service.ts
```

Example:

```ts
const TOKEN_KEY = 'token'

export const tokenService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY)
  },
}
```

---

## Naming Rules

Use these names:

```txt
user.service.ts
user.dto.ts
user.model.ts
user.schema.ts
user.transformer.ts
user.types.ts
user.utils.ts
```

Correct spelling:

```txt
utils          ✅
utiles         ❌

transformers   ✅
trassformars   ❌

hooks           ✅ for React
composables     ❌ Vue-style naming
```

---

## Import Rules

Use the alias `@/` where possible.

Examples:

```ts
import { apiService } from '@/services/api.service'
import { Button } from '@/components/ui/Button'
import { MainLayout } from '@/layouts/MainLayout'
```

Use relative imports inside the same module when it is cleaner.

Examples:

```ts
import type { User } from '../models/user.model'
import { userDtoToModel } from '../transformers/user.transformer'
```

After moving files, update all imports.

Check for:

- broken imports
- unused imports
- circular imports
- missing exports
- wrong relative paths

---

## App Folder Rules

Use `src/app/` for app-level setup.

Examples:

```txt
src/app/App.tsx
src/app/router.tsx
src/app/routes.tsx
src/app/providers.tsx
```

`App.tsx` should focus on rendering providers and routes.

`providers.tsx` should contain app providers such as:

- BrowserRouter
- QueryClientProvider
- ThemeProvider
- AuthProvider
- Toast provider

`router.tsx` or `routes.tsx` should contain route definitions.

---

## Layout Rules

Use `src/layouts/` for layout components.

Examples:

```txt
src/layouts/MainLayout.tsx
src/layouts/AuthLayout.tsx
src/layouts/DashboardLayout.tsx
```

Layouts should wrap views, not contain feature-specific business logic.

---

## Global Folder Rules

### Root `hooks/`

Use for hooks shared across multiple modules.

Examples:

```txt
src/hooks/useDebounce.ts
src/hooks/useLocalStorage.ts
src/hooks/useClickOutside.ts
```

### Root `utils/`

Use for utilities shared across the app.

Examples:

```txt
src/utils/formatDate.ts
src/utils/cn.ts
src/utils/validation.ts
```

### Root `constants/`

Use for global constants.

Examples:

```txt
src/constants/routes.ts
src/constants/permissions.ts
src/constants/storage-keys.ts
```

### Root `types/`

Use for global TypeScript types.

Examples:

```txt
src/types/api.types.ts
src/types/common.types.ts
src/types/pagination.types.ts
```

### Root `styles/`

Use for global styles.

Examples:

```txt
src/styles/globals.css
```

---

## Refactoring Workflow

When applying this skill, follow this workflow:

### Step 1: Inspect the current project

Before moving files, inspect the current structure and identify:

1. Auth files
2. User files
3. Dashboard files
4. Global shared UI components
5. Layouts
6. Global services
7. Global hooks
8. Global utils
9. Global constants
10. Global types
11. Current route files
12. Current API setup files
13. Existing form validation logic
14. Existing backend response/request interfaces
15. Existing mapping or formatting functions

---

### Step 2: Plan the moves

Create a clear move plan.

Example:

```txt
pages/Login.tsx → modules/auth/views/LoginView.tsx
components/LoginForm.tsx → modules/auth/components/LoginForm.tsx
services/api.ts → services/api.service.ts
types/user.ts → modules/user/models/user.model.ts
```

Do not move files randomly.

---

### Step 3: Move files safely

Move files into the new structure.

Rules:

- Do not create duplicates.
- Do not leave old unused files behind.
- Preserve component logic.
- Preserve route behavior.
- Preserve API behavior.
- Preserve styles.

---

### Step 4: Split DTOs, models, schemas, and transformers

If backend shapes are mixed with frontend types:

- Move backend shapes to `dtos/`
- Move frontend clean shapes to `models/`
- Move UI-only helper types to `types/`
- Move Zod validation to `schemas/`
- Move mapping functions to `transformers/`

---

### Step 5: Update services

Global API setup should be in:

```txt
src/services/api.service.ts
```

Module API calls should be in:

```txt
src/modules/<module-name>/services/<module-name>.service.ts
```

Example:

```ts
import { apiService } from '@/services/api.service'
```

---

### Step 6: Update imports

After moving files, update imports everywhere.

Prefer:

```ts
import { apiService } from '@/services/api.service'
```

Instead of long relative imports like:

```ts
import { apiService } from '../../../services/api.service'
```

---

### Step 7: Add module exports

Each module should have an `index.ts`.

Example:

```ts
export * from './views/UsersView'
export * from './services/user.service'
export * from './models/user.model'
```

Do not export every internal component unless it is needed outside the module.

---

### Step 8: Validate the project

After refactoring, check:

```bash
npm run build
```

Also check:

```bash
npm run lint
```

If the project uses pnpm:

```bash
pnpm build
pnpm lint
```

Fix:

- TypeScript errors
- broken imports
- unused imports
- route issues
- missing exports
- invalid aliases
- unused old files

---

## Expected Final Output

After completing the refactor, provide:

1. Final folder structure
2. Summary of moved files
3. Summary of updated import paths
4. New DTO files created
5. New model files created
6. New schema files created
7. New transformer files created
8. Any removed duplicate files
9. Any errors fixed
10. Any TODOs that need manual review

---

## Strong Refactoring Prompt

Use this prompt when asking an LLM or coding agent to apply this skill:

```txt
You are a senior React + Vite + TypeScript architect.

Refactor the current project file structure to match the modular architecture described in the Refactoring Skill.

You must inspect the current project first, then move files safely.

Do not change business logic unless required by the file movement.

The app behavior must remain exactly the same.

Apply these rules:

1. Move route-level pages to module `views/`.
2. Move feature-specific components to their module `components/`.
3. Move global reusable UI components to `src/components/ui/`.
4. Move shared app-level components to `src/components/common/`.
5. Move global API setup to `src/services/api.service.ts`.
6. Move token logic to `src/services/token.service.ts`.
7. Move API error helpers to `src/services/api-error.ts`.
8. Move module API calls to `modules/<module>/services/`.
9. Add DTOs for backend request/response shapes.
10. Add models for frontend clean data shapes.
11. Add Zod schemas for form validation.
12. Add transformers to map DTOs to models and form values to request DTOs.
13. Update all imports.
14. Use the alias `@/` where possible.
15. Add `index.ts` files for each module.
16. Remove duplicates and unused old files.
17. Make sure the project builds successfully.

The target structure is:

src/
├── app/
├── services/
├── modules/
├── components/
├── layouts/
├── hooks/
├── constants/
├── utils/
├── styles/
├── types/
├── main.tsx
└── vite-env.d.ts

After finishing, provide:
1. The final folder structure.
2. What files were moved.
3. What imports were updated.
4. What DTO/model/schema/transformer files were created.
5. Any TODOs I should review manually.

Now refactor the project files directly according to this skill.
```

---

## Success Criteria

The refactor is complete only when:

- The app builds successfully.
- Routes still work.
- TypeScript has no broken imports.
- Global services are in `src/services/`.
- Feature code is inside `src/modules/`.
- UI does not depend directly on backend DTOs.
- Zod schemas are used for validation where needed.
- Transformers handle backend/frontend mapping.
- Old duplicate files are removed.
- The final structure is clean and scalable.
