# Reference Visual Identity

Scope: encyclopedia, reference entries, XML explorer and Visual Guide. Original
study routes and Info extra keep their own content and surface tokens.

- Charcoal foundation with vivid semantic accents: pacs cyan, pain purple, camt
  teal, party orange, institution blue, infrastructure violet, schemes gold.
  Defined once as CSS variables (`src/styles/index.css`, `.tone-*` in
  `reference.css`); light theme uses darker equivalents of the same hues.
- Content icons are Microsoft Fluent Emoji (MIT), dimensional "3D-style" SVGs.
  `npm run icons` (`scripts/fluent-icons.mjs`) copies only the listed icons
  from the `@iconify-json/fluent-emoji` dev dependency into
  `public/icons/fluent/` and regenerates `iconNames.ts`. They render as `<img>`
  (no gradient-id clashes, nothing added to the JS bundle, no runtime icon
  service) and are decorative: always paired with visible text. Lucide stays
  for small UI controls (arrows, copy, search).
- The encyclopedia home is a staircase of five scales, largest to smallest
  (`src/content/reference/scales.ts`): architectures → fast payments and
  settlement → operation concepts → ISO 20022 messages (emphasized, grouped by
  pain/pacs/camt) → XML fields. Entries are assigned to scales in data.
- Canvas: neutral ink in dark (#0D1017), white in light. The menu (`.nav-ink`)
  stays deep navy in both themes as the brand frame; its items hover and
  highlight in their own section color.
- Type: Public Sans (self-hosted via `@fontsource-variable/public-sans`, OFL)
  for interface text; monospace for code/XML and Georgia for the guide titles.
- Scales on the home can be folded; the folded set is a per-browser
  convenience stored in localStorage (`payment-lab:collapsed-scales`).
- Encyclopedia texts (`concepts.ts`, `messageReference.ts`) are written for
  the new reference and are separate from the classic glossary/Atlas. Each
  entry has a plain-language version and a time-ordered diagram shown inside
  "En pocas palabras". The visual guide always opens on the sequence.
- `/recorridos` (`journeys.ts`): end-to-end journeys across CUSTOMER_A,
  BANK_A, PAYMENT_SYSTEM, BANK_B and CUSTOMER_B. Each step carries its phase,
  money state and payment state, and message steps carry a simplified
  synthetic XML fragment. SIMPLIFIED MODEL: codes and versions are
  illustrative common ISO usages; schemes define the real flow.
- The annotated pacs.008 XML is a tab of the reference entry
  (`/reference/pacs.008?tab=xml`); `/xml` redirects there.
- Reusable diagram data includes explicit actor roles; icons never infer an
  institution's technical implementation from its name.
- `/visual` gathers the existing curated sequence/architecture models. Topic
  and view are URL parameters; the educational scope travels with the diagram.
- Selected message arrows animate once; reduced motion disables the animation.
- Reference collection supports colored discovery tiles or compact rows. Search
  defaults to rows without changing a user's explicitly selected view.

## User-Supplied References

- Robin Holesinsky, [AI tutoring mobile app to learn languages](https://dribbble.com/shots/27215367-AI-tutoring-mobile-app-to-learn-languages): soft colors and contextual visual cues.
- Tino, [Online Learning App](https://dribbble.com/shots/26575129-Online-Learning-App): clear learning hierarchy and course discovery.

Reviewed as inspiration, not copied as templates or assets. No third-party art,
social features, fake learning statistics, neon gradients or runtime AI were added.
Payment Lab retains its charcoal foundation and existing light-theme preference.

## Illustration

Asset: `public/images/payment-network.png`.
Generated with the built-in image-generation tool, not the API/CLI fallback.
The PNG is a static dimensional illustration, not an interactive 3D scene or a
normative architecture. It is labeled as conceptual and has descriptive alt text.

Final prompt:

> Use case: stylized-concept. Asset type: editorial illustration for Payment Lab,
> an educational encyclopedia about payment systems. Create a single coherent
> wide still-life composition, isolated on transparent background, of a beautifully
> crafted miniature payment network: a coral standing smartphone on the left,
> a small azure bank building with three pillars, a teal central interconnection
> hub with three visibly connected short pathways, a second smaller violet bank
> building on the right, and an ivory upright financial document with simple
> recessed horizontal lines and a small amber seal at the front. The connected
> pathways are matte ribbons, clearly grounded between the objects, not floating.
> Sophisticated tactile product photography / isometric dimensional illustration,
> satin ceramic and folded paper materials, rounded edges but precise architecture,
> warm soft studio light and realistic contact shadows. Friendly and calm, adult
> educational editorial design, not a cartoon or game. Centered composition all
> objects fully visible, horizontal overall silhouette, strong clear object shapes
> readable at 420px wide, transparent alpha background. No actual brands, logos,
> currency symbols, characters, people, text, typography, neon, glow, purple gradient,
> or decorative particles. This is a conceptual illustration, not a normative
> architecture diagram.
