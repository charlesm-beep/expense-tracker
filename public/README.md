# Public Assets

## Social Media Preview Image (OG Image)

The `og-image.svg` file is used for social media link previews when sharing the app.

### Current Status
- SVG version is included for easy editing
- Dimensions: 1200x630px (optimal for Open Graph)

### Converting to PNG (Recommended)

While the SVG works, a PNG version provides better compatibility across all platforms. To convert:

**Option 1: Using a Browser**
1. Open `og-image.svg` in Chrome/Firefox
2. Take a screenshot or use browser dev tools
3. Save as `og-image.png` (1200x630px)

**Option 2: Using ImageMagick**
```bash
convert -background white -size 1200x630 og-image.svg og-image.png
```

**Option 3: Using Online Tools**
- cloudconvert.com
- convertio.co
- Use "SVG to PNG" and set dimensions to 1200x630

### After Converting
Update `index.html` to reference `og-image.png` instead of `og-image.svg`:
```html
<meta property="og:image" content="https://save-it-eta.vercel.app/og-image.png">
<meta property="twitter:image" content="https://save-it-eta.vercel.app/og-image.png">
```

### Testing Social Previews

Test how your link preview looks:
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: Share the link in a post
- **iMessage**: Send the link to yourself
