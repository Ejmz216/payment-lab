# Content Guide

All content lives in `src/content/`, separated from UI components in
`src/components/` and `src/routes/`. Types are defined in
`src/types/content.ts`.

## Adding a lesson

1. Add a `Lesson` object to `src/content/lessons/fastPaymentsPath.ts` (or a
   new file under `src/content/lessons/` for a new path).
2. Give it a unique `id`, correct `order`, and fill in `sections`,
   `objectives`, `keyTerms`, and `sources`.
3. Add the `id` to the relevant `LearningPath.lessonIds` array.
4. If it should have a check-yourself scenario, add a `Scenario` to
   `src/content/scenarios.ts` and reference it via `scenarioId`.

## Adding a message

1. Create `src/content/messages/<id>.ts` exporting a `MessageDefinition`.
2. Add it to the `messages` array in `src/content/messages/index.ts`.
3. Each `MessageVersion` needs its own `tree: MessageFieldNode` — never
   assume a message has only one version.
4. Always fill in `sources`, and only assert cardinalities/rules you can
   support with a source; otherwise mark the content as illustrative in
   `cardinalityNotes`.

## Adding a version to an existing message

Add a new entry to that message's `versions` array in its content file. Do
not overwrite an existing version — old versions should remain browsable.

## Adding a glossary term

Add an entry to `src/content/glossary.ts`. Link related terms via
`relatedConcepts` (matching another entry's `id`).

## Adding a scenario or quiz question

Add to `src/content/scenarios.ts`. Scenarios should test reasoning
("what would you investigate?"), not just term recall — prefer these over
quiz questions when possible.

## Adding a "Things People Confuse" entry

Add to `src/content/confusions.ts`.

## Updating sources

Every `Lesson` and `MessageDefinition` carries a `sources: SourceMetadata[]`
array. When content is updated, update `lastReviewed`. Prefer, in order:
ISO 20022 official catalogue, official payment scheme documentation, central
bank / infrastructure documentation, official institution documentation,
high-quality secondary educational sources. Do not copy full third-party
documentation into the repository — write original explanations and cite the
source.

## Content honesty rules

- Never present a scheme-specific or implementation-specific rule as
  universal ISO 20022 behavior.
- Use the `ContentBadge` type (`reference`, `simplified-model`,
  `simulation`, `scheme-dependent`) to be explicit about what kind of claim
  a piece of content is making.
- If you can't support a rule with a source, phrase it as an example or a
  generic/simplified model, or leave it out.
