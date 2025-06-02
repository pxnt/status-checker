# Public Layout Template

A comprehensive, responsive layout template for public-facing pages built with Vue 3, TypeScript, and shadcn-vue components.

## 🎯 Overview

The `PublicLayout.vue` component provides a complete page structure including:
- **Sticky Header** with navigation
- **Mobile-responsive design**
- **Footer** with company information and links
- **Slot-based content area** for flexible page content

## 📁 File Structure

```
src/
├── layouts/
│   └── PublicLayout.vue          # Main layout template
├── views/
│   ├── Home.vue                  # Landing page with hero section
│   ├── Public.vue                # Status checker page  
│   ├── Incidents.vue             # Incident history page
│   ├── Metrics.vue               # Performance metrics page
│   └── About.vue                 # About page
└── router/
    └── index.ts                  # Updated routing configuration
```

## 🎨 Layout Components

### Header Features
- **Logo/Brand** - Clickable logo with Activity icon
- **Desktop Navigation** - Horizontal menu for larger screens
- **Mobile Navigation** - Collapsible menu for mobile devices
- **Active State** - Highlights current page in navigation
- **Sticky Positioning** - Header stays at top when scrolling

### Footer Features
- **Company Information** - Logo, description, and social links
- **Quick Links** - Organized link sections (Product, Support)
- **Copyright Notice** - Dynamic year and legal links
- **Responsive Grid** - Adapts to different screen sizes

## 🔧 Usage

### Basic Implementation

```vue
<template>
  <PublicLayout>
    <!-- Your page content goes here -->
    <div class="py-8">
      <div class="max-w-6xl mx-auto px-4">
        <h1>Page Title</h1>
        <p>Page content...</p>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup lang="ts">
import PublicLayout from '~/layouts/PublicLayout.vue'
</script>
```

### Navigation Configuration

The navigation items are defined in the layout component:

```typescript
const navigationItems = [
  { name: 'Dashboard', href: '/' },
  { name: 'Status', href: '/status' },
  { name: 'Incidents', href: '/incidents' },
  { name: 'Metrics', href: '/metrics' },
  { name: 'About', href: '/about' }
]
```

To customize navigation:
1. Edit the `navigationItems` array in `PublicLayout.vue`
2. Add corresponding routes in `src/router/index.ts`
3. Create the view components

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (md)
- **Desktop**: ≥ 768px (md)

### Mobile Features
- Hamburger menu button
- Collapsible navigation drawer
- Touch-friendly button sizes
- Optimized spacing and typography

### Desktop Features
- Horizontal navigation bar
- Hover effects and transitions
- Multi-column footer layout
- Larger content areas

## 🎨 Styling & Theming

### Color Scheme
- **Primary**: Blue (`blue-600`)
- **Background**: Light gray (`gray-50`)
- **Text**: Dark gray (`gray-900`, `gray-600`)
- **Borders**: Light gray (`gray-200`)

### Typography
- **Headings**: Bold, hierarchical sizing
- **Body**: Regular weight, good contrast
- **Links**: Blue with hover states

### Shadows & Effects
- Subtle shadows for depth
- Smooth transitions
- Hover state feedback

## 🔄 Customization

### Change Brand Colors

```css
/* In your CSS file or component */
.bg-blue-600 {
  background-color: your-primary-color;
}

.text-blue-600 {
  color: your-primary-color;
}
```

### Modify Navigation

```typescript
// In PublicLayout.vue
const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Services', href: '/services' },
  // Add more items...
]
```

### Update Footer Content

```vue
<!-- In PublicLayout.vue footer section -->
<div class="col-span-1 md:col-span-2">
  <div class="flex items-center space-x-2 mb-4">
    <!-- Your logo/brand -->
  </div>
  <p class="text-gray-600 text-sm max-w-md">
    Your company description here...
  </p>
</div>
```

## 📄 Example Pages

### 1. Home Page (`Home.vue`)
- **Hero section** with gradient background
- **Features grid** with icons and descriptions
- **Status preview** using StatusChecker component
- **Call-to-action** section

### 2. Status Page (`Public.vue`)
- **Service status** using accordion components
- **Multiple service groups**
- **Real-time status indicators**

### 3. Metrics Page (`Metrics.vue`)
- **Performance metrics** cards
- **Charts placeholder** for analytics
- **Key performance indicators**

### 4. About Page (`About.vue`)
- **Company information**
- **Mission and values**
- **Contact information**

## 🚀 Getting Started

1. **Use the layout** in your views:
   ```vue
   <template>
     <PublicLayout>
       <!-- Your content -->
     </PublicLayout>
   </template>
   ```

2. **Add routes** in `src/router/index.ts`:
   ```typescript
   {
     path: '/your-page',
     name: 'your-page',
     component: () => import('~/views/YourPage.vue')
   }
   ```

3. **Update navigation** in `PublicLayout.vue` if needed

4. **Start the development server**:
   ```bash
   pnpm dev
   ```

## 🔧 Dependencies

- Vue 3 with Composition API
- Vue Router 4
- shadcn-vue components (Button)
- Lucide Vue icons
- Tailwind CSS for styling

## 🎯 Features

✅ **Responsive Design** - Works on all screen sizes  
✅ **Accessible Navigation** - Keyboard and screen reader friendly  
✅ **SEO Friendly** - Semantic HTML structure  
✅ **Modern Styling** - Clean, professional appearance  
✅ **Mobile First** - Optimized for mobile devices  
✅ **Customizable** - Easy to modify and extend  
✅ **Performance** - Lightweight and fast loading 