# CERCU Frontend

## Product
**Cercu** ("SER-ku") — Hyperlocal home services marketplace for CDMX/Edomex.
Slogan: "Encuentra y agenda en minutos."

Users request services (plumbing, electrical, cleaning, etc.) and get matched with nearby professionals. Professionals pay to take leads, operate on subscription plans, and are gamified with XP/levels/missions/boosts.

## Stack
- **Framework:** Nuxt 3 + Vue 3 (Composition API, `<script setup>`)
- **State:** Pinia (setup/composable style, NOT options API)
- **Styling:** Bootstrap 5.3 + custom SCSS + Neumorphism design system
- **Animations:** GSAP 3.12
- **Maps:** Leaflet via @nuxtjs/leaflet
- **Forms:** VeeValidate 4 + Yup
- **Icons:** nuxt-icon (Material Design Icons)
- **TypeScript:** 5.3

## Commands
```bash
yarn dev          # Dev server on port 3001
yarn build        # Production build
yarn generate     # Static generation
yarn preview      # Preview production build
npx nuxi prepare  # Regenerate .nuxt types (run after adding composables/components)
```

## Backend
- **Repo:** cercu-backend (sibling directory)
- **API Base:** `http://localhost:3003/api/v1` (configurable via `NUXT_PUBLIC_API_BASE`)
- **Auth:** JWT Bearer tokens (access 15m + refresh 7d)

## Project Structure
```
cercu-frontend/
├── assets/scss/           # Design system (variables, mixins, neumorphism, components)
├── components/
│   ├── ui/                # Reusable: AppModal, AppToast, AppButton, AppInput, AppSkeleton, etc.
│   ├── form/              # PhoneInput, OtpInput, ChipSelector, PhotoUploader, StepIndicator
│   ├── auth/              # GoogleSignInButton
│   ├── map/               # MapPicker, MapResults
│   └── gamification/      # PlanCard, LevelProgress, AchievementBadge, BoostCard, MissionCard, TrustGauge, XpGainToast
├── composables/           # useApi, useAnimations, useToast, useGeolocation, useXpEvents, etc.
├── layouts/               # default, blank, auth, admin, professional
├── middleware/             # auth (require login), guest (redirect if logged in), role (admin/pro guard)
├── pages/
│   ├── index.vue          # Landing page
│   ├── buscar.vue         # Search results
│   ├── solicitar/         # Service request flow (form + confirmation)
│   ├── solicitudes.vue    # User's requests dashboard
│   ├── cuenta.vue         # Account settings + trust score
│   ├── auth/              # login, registro, registro-profesional
│   ├── pro/               # Professional dashboard (leads, perfil, gamificacion, planes, boosts)
│   └── admin/             # Admin panel (usuarios, profesionales, leads, categorias, planes, boosts, gamificacion, configuracion)
├── plugins/               # api.ts ($api global), bootstrap.client.ts, session-guard.client.ts
├── stores/                # Pinia stores (auth, leads, categories, search, professional, admin, ui, plans, boosts, gamification, onboarding, serviceRequest)
└── utils/                 # constants.ts, formatters.ts
```

## Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| Primary Indigo | `#3730A3` | Brand, CTAs, headers |
| Indigo Dark | `#2A237A` | Hover states, dark backgrounds |
| Accent Coral | `#FB7185` | Highlights, secondary CTAs |
| Coral Dark | `#E11D48` | Hover accent |
| Neumorphism BG | `#F0F0F8` | Soft background |

### Typography
- **Headings:** Sora (600-700 weight)
- **Body/UI:** Inter (400-600 weight)

### Neumorphism
Cards, inputs, and interactive elements use a dual-shadow neumorphic system:
- `$neu-shadow-sm/md/lg/xl` for elevated states
- `$neu-shadow-inset` for pressed states
- Background: `$neu-bg` (`#F0F0F8`)

### Spacing & Radius
- 8pt grid system
- Card radius: 16px, Input: 12px, Chip: 999px, Modal: 20px

## Key Patterns

### Pages
```vue
<script setup lang="ts">
definePageMeta({ middleware: 'role' })  // For protected routes

const store = useSomeStore()
const { fadeInUp } = useAnimations()

onMounted(() => { store.fetchData() })
</script>
```

### Stores (Pinia composable style)
```typescript
export const useMyStore = defineStore('myStore', () => {
  const items = ref([])
  const loading = ref(false)

  async function fetchItems() {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      const res = await $fetch(`${config.public.apiBase}/items`, {
        headers: { Authorization: `Bearer ${useAuthStore().token}` }
      })
      items.value = res.data
    } finally { loading.value = false }
  }

  return { items, loading, fetchItems }
})
```

### API Calls
Three patterns exist (all add auth headers automatically):
1. **Store actions** — `$fetch()` with `useRuntimeConfig().public.apiBase`
2. **`useApi()` composable** — For pages/components needing auth-aware fetch
3. **`$api` plugin** — Global `$fetch.create()` instance

### Animations
`useAnimations()` provides GSAP utilities:
- Entrance: `fadeInUp`, `fadeInDown`, `scaleIn`
- Stagger: `staggerIn`, `staggerScale`
- Micro: `bounceClick`, `popIn`, `wiggle`, `pulse`
- Gamification: `xpFloat`, `levelUpCelebration`, `progressFill`, `gaugeArc`
- Special: `celebrationBurst`, `successCheck`

### Route Protection
- `/admin/**` — requires admin role (middleware/role.ts)
- `/pro/**` — requires professional role
- `/admin/**` and `/pro/**` — SSR disabled (client-only rendering)

## Business Logic

### Lead Flow
1. User creates service request (category, chips, location, urgency)
2. Backend matches with professionals (scoring algorithm)
3. Pro sees preview (free) → Takes lead (paid from wallet)
4. Negotiation → Confirm → Complete
5. Status: `pending → matched → taken → in_progress → completed`

### Gamification
- **Pro:** XP → Levels (Bronce/Plata/Oro), weekly missions, achievements, boosts
- **User:** Trust Score (0-100), user achievements (phone verified, reviews, etc.)
- **Plans:** Starter (free) / Normal ($299) / Premium ($799)
- **Boosts:** 6h/$49, 24h/$129, 7d/$399 — category-specific, with rotation

### Categories
12 service categories, each with:
- Chips (subcategory options)
- Conditional fields (dynamic form fields)
- Pricing by urgency tier (standard/today/immediate)

## Conventions
- Components: PascalCase (`AppButton.vue`)
- Stores: `useXxxStore` prefix
- Composables: `useXxx` prefix
- CSS classes: kebab-case
- SCSS variables: `$cercu-*` prefix for brand tokens
- All UI text in Spanish (Mexico)
- Prefer Bootstrap grid (`row`/`col-*`) for layout
- Use `<script setup lang="ts">` always
- Use Nuxt auto-imports (no manual import of `ref`, `computed`, `onMounted`, stores, composables)

## Common Issues
- After creating new composables/components, run `npx nuxi prepare` to regenerate types
- Pre-existing TS errors in some files (AppEmptyState, useAnimations return types) — not blocking
- Bootstrap JS features (dropdowns, modals) only work client-side
