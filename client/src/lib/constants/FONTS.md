# Font System Documentation

## Overview

The font system uses CSS variables (like the color system) to make it easy to change fonts globally and manage font weights properly.

## Font Families

- **Primary (Sans-serif)**: `Outfit` - Used for body text, buttons, and UI elements
- **Secondary (Heading)**: `Inter` - Used for headings and emphasis
- **Monospace**: `JetBrains Mono` - Used for code snippets
- **Serif**: `Georgia` - Available for special sections

## Changing Fonts

To change the primary font across the entire application:

### 1. Update Font Configuration
Edit `src/lib/constants/fonts.ts`:
```typescript
export const FONTS = {
  primary: {
    name: 'Your Font Name',  // ← Change this
    weights: [300, 400, 500, 600, 700],
    googleUrl: 'https://fonts.googleapis.com/css2?family=Your+Font+Name:wght@300;400;500;600;700&display=swap',
  },
  // ...
};
```

### 2. Update HTML
Edit `index.html` to import the new font:
```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font+Name:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### 3. Update CSS Variable
Edit `src/styles/globals.css`:
```css
:root {
  --font-sans: 'Your Font Name', system-ui, sans-serif;
}
```

That's it! The entire app will now use the new font.

## Usage in Components

### Font Families

```tsx
// Body text (default)
<p className="font-sans">This uses Outfit</p>

// Headings
<h1 className="font-heading">This uses Inter</h1>

// Code
<code className="font-mono">const x = 10;</code>

// Serif (special sections)
<p className="font-serif">Elegant text</p>
```

### Font Weights

```tsx
<span className="font-light">Light (300)</span>
<span className="font-normal">Normal (400)</span>
<span className="font-medium">Medium (500)</span>
<span className="font-semibold">Semibold (600)</span>
<span className="font-bold">Bold (700)</span>
<span className="font-extrabold">Extra Bold (800)</span>
```

### Using Font Utility Classes

Import the font utility helpers for consistent typography:

```tsx
import { fontClasses } from '@/lib/utils/fonts';

// Headings
<h1 className={fontClasses.h1}>Main Heading</h1>
<h2 className={fontClasses.h2}>Subheading</h2>
<h3 className={fontClasses.h3}>Section Title</h3>

// Body text
<p className={fontClasses.bodyText}>Regular paragraph</p>
<p className={fontClasses.bodyLarge}>Large paragraph</p>
<p className={fontClasses.bodySmall}>Small text</p>
<p className={fontClasses.caption}>Caption or helper text</p>

// Buttons
<Button className={fontClasses.button}>Click me</Button>
<Button className={fontClasses.buttonLarge}>Large Button</Button>

// Labels
<Label className={fontClasses.label}>Form Label</Label>

// Code
<code className={fontClasses.code}>console.log('hello')</code>
```

### Combining with Other Classes

```tsx
<h1 className={cn(fontClasses.h1, "text-primary mb-4")}>
  Styled Heading
</h1>

<p className={cn(fontClasses.bodyText, "text-muted-foreground")}>
  Muted paragraph
</p>
```

## Available Font Classes

### Font Families
- `font-sans` - Outfit (primary)
- `font-heading` - Inter (headings)
- `font-mono` - JetBrains Mono (code)
- `font-serif` - Georgia (special)

### Font Weights
- `font-light` (300)
- `font-normal` (400)
- `font-medium` (500)
- `font-semibold` (600)
- `font-bold` (700)
- `font-extrabold` (800)

### Predefined Combinations
- `fontClasses.h1` through `fontClasses.h6` - Heading styles
- `fontClasses.bodyText`, `bodyLarge`, `bodySmall` - Body text
- `fontClasses.button`, `buttonLarge` - Button text
- `fontClasses.label` - Form labels
- `fontClasses.caption` - Small helper text
- `fontClasses.code` - Code snippets

## CSS Variables

All fonts are defined as CSS variables in `globals.css`:

```css
:root {
  /* Font Families */
  --font-sans: 'Outfit', system-ui, sans-serif;
  --font-serif: Georgia, serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-heading: 'Inter', var(--font-sans);
  
  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
}
```

## Best Practices

1. **Use semantic classes**: Prefer `font-heading` over `font-sans` for headings
2. **Use utility helpers**: Import `fontClasses` for consistent combinations
3. **Avoid inline weights**: Use Tailwind classes instead of inline styles
4. **Test all weights**: Ensure your chosen font supports all weights (300-700)
5. **Consider performance**: Only import the weights you actually use

## Examples

### Hero Section
```tsx
<section className="text-center">
  <h1 className={cn(fontClasses.h1, "mb-4")}>
    Discover Georgia
  </h1>
  <p className={cn(fontClasses.bodyLarge, "text-muted-foreground")}>
    Experience the beauty of the Caucasus
  </p>
</section>
```

### Card Component
```tsx
<Card>
  <CardHeader>
    <h3 className={fontClasses.h3}>Tour Name</h3>
  </CardHeader>
  <CardContent>
    <p className={fontClasses.bodyText}>
      Tour description goes here...
    </p>
    <p className={fontClasses.caption}>
      Duration: 3 days
    </p>
  </CardContent>
</Card>
```

### Button
```tsx
<Button className={fontClasses.button}>
  Book Now
</Button>
```

## Troubleshooting

### Font not loading?
1. Check the Google Fonts URL in `index.html`
2. Verify the font name matches exactly (case-sensitive)
3. Check browser console for 404 errors
4. Clear browser cache

### Wrong weight displaying?
1. Ensure the weight is imported in the Google Fonts URL
2. Check that the font actually supports that weight
3. Verify the CSS variable is set correctly

### Font not applying?
1. Check that Tailwind is processing the classes
2. Verify the CSS variable exists in `globals.css`
3. Ensure `tailwind.config.js` includes the font family

---

**Last Updated**: January 2, 2026
