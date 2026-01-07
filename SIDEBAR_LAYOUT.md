# Sidebar & Widget Layout System

## Overview

Professional sidebar and widget layout system inspired by Mizuki and henryavery.cn, providing a flexible three-column grid layout with responsive design.

## Components Created

### 1. Core Layout Components

#### **WidgetLayout.astro** (`src/components/widget/WidgetLayout.astro`)
Wrapper component for all sidebar widgets providing consistent styling.

**Features:**
- Card-based design with consistent padding
- Optional title bar with primary accent line
- Collapsible content with "Show more" button
- Web Component implementation for interactive features
- Customizable collapsed height

**Usage:**
```astro
<WidgetLayout id="my-widget" name="Widget Title" isCollapsed={true} collapsedHeight="120px">
  <p>Widget content here</p>
</WidgetLayout>
```

#### **MainGridLayout.astro** (`src/components/layout/MainGridLayout.astro`)
Main container for three-column responsive grid layout.

**Features:**
- Flexible sidebar configuration (left, right, both, or none)
- Automatic responsive behavior (hides sidebars on mobile/tablet)
- Named slots for custom content
- CSS Grid with intelligent column sizing

**Props:**
- `showLeftSidebar` - Display left sidebar with Profile, Categories, Tags
- `showRightSidebar` - Display right sidebar
- `showTOC` - Show table of contents in right sidebar
- `showStats` - Show site statistics in right sidebar
- `showCalendar` - Show calendar widget in right sidebar
- `headings` - Array of MarkdownHeading for TOC

**Usage:**
```astro
<MainGridLayout
  showLeftSidebar={true}
  showRightSidebar={true}
  showTOC={true}
  headings={headings}
>
  <article>Main content here</article>
</MainGridLayout>
```

#### **Sidebar.astro** (`src/components/layout/Sidebar.astro`)
Left sidebar container with Profile, Categories, and Tags widgets.

**Features:**
- Top section (scrolls with page)
- Sticky section (stays visible on scroll)
- Hidden on mobile/tablet (< 1024px)

#### **RightSidebar.astro** (`src/components/layout/RightSidebar.astro`)
Right sidebar container for TOC, Stats, and Calendar.

**Features:**
- Sticky positioning
- Max-height with custom scrollbar
- Configurable widgets via props
- Custom slot for additional content

### 2. Widget Components

#### **Profile.astro** (`src/components/widget/Profile.astro`)
User profile widget with avatar, bio, and social links.

**Configuration:** `src/data/profile.json`
```json
{
  "name": "Henry Avery",
  "avatar": "/avatar.jpg",
  "bio": "Developer & Writer",
  "links": [
    {
      "name": "GitHub",
      "url": "https://github.com/yourusername",
      "icon": "fa6-brands:github"
    }
  ]
}
```

**Features:**
- Circular avatar with hover effect
- Name and divider line
- Centered bio text
- Social media icon buttons (GitHub, Email, RSS)

#### **Categories.astro** (`src/components/widget/Categories.astro`)
Category listing widget.

**Features:**
- List of post categories with count badges
- Hover effects
- Ready for future category implementation

**TODO:** Add category field to posts schema

#### **Tags.astro** (`src/components/widget/Tags.astro`)
Tag cloud widget.

**Features:**
- Collapsible tag list
- Badge-style tags with post counts
- Hover effects
- Ready for future tags implementation

**TODO:** Add tags field to posts schema

#### **Existing Widgets Used:**
- `TOC.astro` - Table of contents with auto-highlighting
- `SiteStats.astro` - Blog statistics (posts, words, running days)
- `Calendar.astro` - Monthly calendar with post indicators

## Layout Configurations

### Homepage Layout
```astro
<MainGridLayout
  showLeftSidebar={true}
  showRightSidebar={true}
  showStats={true}
  showCalendar={true}
>
  <Posts maxPosts={6} />
</MainGridLayout>
```

**Desktop (>1024px):** Left sidebar (Profile, Categories, Tags) | Main content | Right sidebar (Stats, Calendar)
**Tablet/Mobile:** Main content only

### Post Page Layout
```astro
<MainGridLayout
  showLeftSidebar={true}
  showRightSidebar={true}
  showTOC={headings.length > 0}
  headings={headings}
>
  <article>Post content</article>
</MainGridLayout>
```

**Desktop:** Left sidebar | Post content | Right sidebar (TOC)
**Tablet/Mobile:** Post content only

### Posts List / Archive Layout
```astro
<MainGridLayout showLeftSidebar={true}>
  <PostsList />
</MainGridLayout>
```

**Desktop:** Left sidebar | Posts list
**Tablet/Mobile:** Posts list only

### About Page Layout
```astro
<MainGridLayout showLeftSidebar={true}>
  <About content />
</MainGridLayout>
```

## Responsive Breakpoints

```css
/* Mobile: < 1024px */
- Hide all sidebars
- Single column layout

/* Desktop: >= 1024px */
- Show configured sidebars
- Multi-column grid layout
- Sidebar width: 280px

/* Large Desktop: >= 1400px */
- Wider sidebars: 300px
- Max content width: 1400px
```

## Grid System Details

**Without sidebars:**
```css
grid-template-columns: 1fr;
```

**With left sidebar only:**
```css
grid-template-columns: 280px 1fr;
```

**With right sidebar only:**
```css
grid-template-columns: 1fr 280px;
```

**With both sidebars:**
```css
grid-template-columns: 280px 1fr 280px;
```

## Updated Pages

All major pages now use the MainGridLayout system:

1. ✅ **index.astro** - Homepage with dual sidebars (Profile, Stats, Calendar)
2. ✅ **posts.astro** - Posts list with left sidebar
3. ✅ **posts/[slug].astro** - Individual post with dual sidebars (Profile, TOC)
4. ✅ **archive.astro** - Archive timeline with left sidebar
5. ✅ **about.astro** - About page with left sidebar
6. ⏸️ **projects.astro** - Existing complex layout (not modified)

## Customization Guide

### Adding a New Widget

1. **Create the widget component:**
```astro
---
// src/components/widget/MyWidget.astro
import WidgetLayout from './WidgetLayout.astro';
---

<WidgetLayout id="my-widget" name="My Widget">
  <!-- Your widget content -->
</WidgetLayout>
```

2. **Add to Sidebar:**
```astro
// src/components/layout/Sidebar.astro
import MyWidget from '../widget/MyWidget.astro';

<div class="sidebar-sticky">
  <MyWidget />
</div>
```

### Configuring Profile Data

Edit `src/data/profile.json`:
```json
{
  "name": "Your Name",
  "avatar": "/path/to/avatar.jpg",
  "bio": "Your bio text",
  "links": [
    {
      "name": "Platform",
      "url": "https://...",
      "icon": "icon-name"
    }
  ]
}
```

### Adding Categories/Tags Support

**Step 1:** Update posts schema in `src/cms/collections/posts.ts`:
```typescript
category: fields.select({
  label: 'Category',
  options: [
    { label: 'Blog', value: 'blog' },
    { label: 'Tutorial', value: 'tutorial' },
  ],
  defaultValue: 'blog'
}),

tags: fields.multiselect({
  label: 'Tags',
  options: [
    { label: 'Astro', value: 'astro' },
    { label: 'Web Development', value: 'web-development' },
  ]
})
```

**Step 2:** Create category/tag pages:
- `src/pages/category/[category].astro`
- `src/pages/tags/[tag].astro`

**Step 3:** Update Categories.astro and Tags.astro to use real data

## Styling & Theming

All widgets use DaisyUI classes and respect the theme system:

```css
/* Card style */
.card.bg-base-200

/* Primary accent */
.bg-primary

/* Badges */
.badge.badge-ghost

/* Hover effects */
.hover:bg-base-300
```

## Performance Features

1. **Sticky Positioning:** Sidebars stay visible during scroll
2. **CSS Grid:** Efficient layout without JavaScript
3. **Responsive CSS:** Mobile-first with media queries
4. **Lazy Loading:** Svelte components use `client:load`
5. **Custom Scrollbar:** Styled scrollbar for right sidebar overflow

## File Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── MainGridLayout.astro      # Main grid container
│   │   ├── Sidebar.astro              # Left sidebar
│   │   └── RightSidebar.astro         # Right sidebar
│   └── widget/
│       ├── WidgetLayout.astro         # Widget wrapper
│       ├── Profile.astro              # Profile widget
│       ├── Categories.astro           # Categories widget
│       ├── Tags.astro                 # Tags widget
│       ├── TOC.astro                  # Table of contents
│       ├── SiteStats.astro            # Site statistics
│       └── Calendar.astro             # Calendar widget
├── data/
│   ├── profile.json                   # Profile configuration
│   └── projects.json                  # Projects data
└── pages/
    ├── index.astro                    # Homepage
    ├── posts.astro                    # Posts list
    ├── posts/[slug].astro             # Individual post
    ├── archive.astro                  # Archive timeline
    ├── about.astro                    # About page
    └── projects.astro                 # Projects showcase
```

## Testing Checklist

- [x] Dev server starts without errors
- [ ] Homepage displays with dual sidebars
- [ ] Post pages show TOC in right sidebar
- [ ] Posts list shows left sidebar only
- [ ] Mobile view hides sidebars
- [ ] Sticky positioning works on scroll
- [ ] Widget collapse/expand works
- [ ] Profile links are clickable
- [ ] Calendar shows post dates
- [ ] Site stats calculate correctly

## Next Steps

1. **Customize Profile Data:**
   - Replace placeholder avatar
   - Update social media links
   - Write personal bio

2. **Implement Categories/Tags:**
   - Add fields to posts schema
   - Create category/tag pages
   - Update widget logic

3. **Add More Widgets (Optional):**
   - Recent Comments
   - Popular Posts
   - Tag Cloud
   - RSS Feed Links
   - Theme Switcher

4. **Enhance Existing Widgets:**
   - Add loading states
   - Improve animations
   - Add icons
   - Enhance mobile UX

## Troubleshooting

**Sidebars not showing:**
- Check screen width >= 1024px
- Verify `showLeftSidebar` or `showRightSidebar` props are true

**Layout broken:**
- Clear `.astro` cache: `rm -rf .astro`
- Restart dev server

**Widget styles not applying:**
- Ensure DaisyUI is properly configured
- Check Tailwind CSS compilation

**TOC not working:**
- Verify headings are passed to MainGridLayout
- Check that headings have IDs

## Credits

Layout system inspired by:
- [Mizuki Theme](https://github.com/saicaca/fuwari) - Dual sidebar design
- [henryavery.cn](https://henryavery.cn/about/) - Widget layout patterns

---

**Status:** ✅ Phase 1 Complete - All core components implemented and applied to pages
**Dev Server:** http://127.0.0.1:4321/
