# Themes

EDXIF PRO ships with 33 built-in color themes. This document describes the theme system, lists all available themes, and explains how to modify or extend the theme set.

---

## How Themes Work

Themes are defined as plain TypeScript objects in `src/themes.ts`. Each object conforms to the `Theme` interface:

```typescript
interface Theme {
  id: string;
  name: string;
  primary: string;
  bg: string;
  surface: string;
  border: string;
  text: string;
  textMuted: string;
}
```

All color values are CSS hex strings (e.g., `#1e1e1e`).

When a theme is selected, six CSS custom properties are written to the document root element:

```
--theme-primary
--theme-bg
--theme-surface
--theme-border
--theme-text
--theme-text-muted
```

All interface elements use these custom properties through Tailwind utility classes defined in `src/index.css`. This means a theme change updates the entire interface in a single style recalculation, without any component re-renders.

---

## Color Role Definitions

| Property | Role |
|---|---|
| primary | Accent color used for active elements, highlights, interactive indicators, and the commit button |
| bg | The main page background color |
| surface | The background color for panels, the header, the footer, and cards |
| border | The color of all dividers and outlines |
| text | The primary foreground color for readable content |
| textMuted | A secondary foreground color for labels, placeholders, and less important information |

---

## Available Themes

The following themes are included. The "Primary" column shows the accent color for each theme.

| ID | Display Name | Style |
|---|---|---|
| ida-classic | IDA CLASSIC | White background with deep blue accents, inspired by IDA Pro's classic interface |
| ida-dark | IDA DARK | Dark gray workspace with blue accents, the default theme |
| win95 | WINDOWS 95 | Silver-gray with navy blue accents, evoking Windows 95 system UI |
| matrix | MATRIX | Black background with pure green text and accents |
| monokai | MONOKAI | The classic Monokai editor color scheme |
| nord | NORDIC | Cool blue-gray palette from the Nord color scheme |
| solarized-light | SOLARIZED L | Solarized light variant with warm beige tones |
| solarized-dark | SOLARIZED D | Solarized dark variant with deep teal background |
| cyberpunk | CYBERPUNK | Purple-tinted dark background with magenta borders and cyan text |
| synthwave | SYNTHWAVE | Dark purple with hot pink and teal neon accents |
| dracula | DRACULA | The popular Dracula editor theme |
| gruvbox-dark | GRUVBOX D | Gruvbox dark variant with warm amber and brown tones |
| gruvbox-light | GRUVBOX L | Gruvbox light variant with warm cream tones |
| forest | FOREST | Very dark green-tinted background with soft green text |
| ocean | DEEP OCEAN | Deep teal background with sky blue accents |
| high-contrast-w | H-CONTRAST W | Pure white background with black text, maximum contrast |
| high-contrast-b | H-CONTRAST B | Pure black background with white text, maximum contrast |
| retro-terminal | VT100 | Black background with amber monochrome text, mimicking VT100 terminals |
| cobalt | COBALT | Royal blue background with yellow and white text |
| paper | E-INK | Light gray background with near-black text, simulating e-ink displays |
| midnight | AMETHYST | Near-black purple background with violet accents |
| blood | BLOODLINE | Very dark red background with bright red text |
| sepia | ARCHIVE | Warm sepia tones inspired by aged paper and archival documents |
| obsidian | OBSIDIAN | Deep navy background with indigo-blue accents |
| emerald-box | EMERALD | Dark emerald green with bright green accents |
| slate-box | SLATE | Dark slate background with cool blue-gray accents |
| crimson | CRIMSON | Dark red background with bright red accents |
| amber | AMBER SCAN | Very dark background with warm amber text, mimicking old CRT amber monitors |
| blueprint | BLUEPRINT | Royal blue background with white text, resembling technical blueprints |
| terminal-classic | VT220 G | Black background with green monochrome text, mimicking VT220 terminals |
| hotline | HOTLINE Miami | Deep purple background with hot pink and cyan neon accents |
| space-mono | SPACE MONO | Near-black background with soft emerald green accents |

---

## Adding a Custom Theme

To add a new theme, open `src/themes.ts` and append a new object to the `themes` array.

```typescript
{
  id: 'my-theme',
  name: 'MY THEME',
  primary: '#ff6b00',
  bg: '#1a1a1a',
  surface: '#242424',
  border: '#3a3a3a',
  text: '#f0f0f0',
  textMuted: '#888888',
}
```

**Requirements:**

The `id` field must be unique across all themes. If two themes share an ID, the second one will override the first in the selection list but will never be reachable since the theme lookup uses `Array.find`, which returns the first match.

The `name` field is displayed in the theme selector panel and the header bar. Keep it short (under 15 characters) to avoid layout issues on small screens.

All six color fields are required. Omitting any of them will cause the corresponding interface elements to use the browser's default styling, which will look incorrect against the rest of the theme.

**Contrast recommendations:**

Ensure that `text` has sufficient contrast against `bg` and `surface`. For the `primary` color, ensure it is readable against both `bg` (for text on dark backgrounds) and black (because the COMMIT and EXPORT buttons render black text on the primary color background).

The new theme will appear at the bottom of the theme list in the selector panel. There is no configuration needed beyond adding the object to the array.

---

## Modifying an Existing Theme

To change a color in an existing theme, locate the theme object by its `id` in `src/themes.ts` and update the relevant property. The change takes effect immediately on the next page load or hot module replacement refresh.

To rename a theme without changing its colors, update only the `name` property. The `id` must remain unchanged, otherwise any stored user preferences referencing the old ID will fall back to the default theme on next load.

---

## Default Theme

The default theme is `ida-dark`. This is set in the initial state of the `App` component:

```typescript
const [state, setState] = useState<AppState>({
  ...
  themeId: 'ida-dark',
  ...
});
```

To change the default, replace `'ida-dark'` with the `id` of your preferred theme.
