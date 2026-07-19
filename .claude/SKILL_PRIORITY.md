# Vanisca Skill Priority Hierarchy

Authority order when two or more skills give competing guidance. Load and follow all relevant skills before coding — this doc only resolves conflicts.

## 0. vanisca-luxury-restaurant — root authority

Single source of truth for the whole project. Overrides everything below on any point it explicitly addresses. Not part of the ranked list (it sits above it), included here for completeness.

## Ranked order (1 = highest authority)

1. **vanisca-luxury-uiux-motion** — owns *what it looks/moves like*: design tokens, type scale, color, canonical eases, restraint rules. Vanisca-specific, brand-authored.
2. **vanisca-experience-engineering** — owns *how it's built/verified*: GSAP patterns, scroll/3D layering, section workflow, performance gates. Defers to #1 on visual/motion values; #1 defers to this on build technique and verification method.
3. **ui-ux-pro-max** — generic, third-party design-intelligence library (styles/palettes/fonts/stacks/motion presets). **Supplemental only.** Use it to fill gaps #1 and #2 don't cover (e.g. an unaddressed component pattern, chart type, icon choice). It never overrides a decision either Vanisca skill has already made — generic best-practice loses to brand-specific rule every time.
4. **vanisca-fullstack-integrations** — backend/API/forms/integrations knowledge. Consult for context and correctness; do not act on it to change backend/API/Activepieces/env behavior without explicit user permission (see Hard Constraints).
5. **vanisca-seo-performance-deployment** — SEO/perf/deployment knowledge. Same rule as #4: informs frontend decisions (image loading, metadata, Lighthouse budget); deployment/production actions require explicit permission.
6. **vanisca-branding-content-media** — copy, multilingual content, AI media prompts, photography direction. Lowest priority for conflicts because it governs content/asset rules rather than structural or visual-system decisions, but still binding within its own domain.

## Hard constraints (override the ranking, never negotiable)

- **Preserve existing functionality.** No visual/brand rule at any rank justifies breaking the reservation/contact pipeline, i18n, SEO, or integrations. Reconcile via safe technique (lazy-load, reduced-motion gate, desktop-only variant) rather than sacrificing a lower-ranked hard constraint.
- **Frontend refinement only unless explicitly authorized.** Default scope is UI/UX/visual/motion work. Backend logic, data flow, and business rules are out of scope unless the user explicitly asks for them.
- **Never modify backend/API/Activepieces/env/deployment without permission.** Skills #4 and #5 are read/reference sources for frontend decisions, not a license to touch server code, environment variables, Activepieces flows, or deployment config. Always confirm with the user first.

## Applying this

1. Identify which skills a task touches; load them via the Skill tool.
2. If they agree, proceed.
3. If they conflict, defer to the higher rank above — except where a hard constraint applies, which always wins.
4. ui-ux-pro-max is consult-when-silent, not consult-first: check the two Vanisca design/build skills before reaching for it.
