# Theme System Documentation

This project includes a comprehensive theme system with dark/light mode support using Ant Design and React Context.

## Features

- 🌙 **Dark/Light Mode Toggle**: Switch between themes with a single click
- 💾 **Persistent Storage**: Theme preference is saved to localStorage
- 🖥️ **System Preference Detection**: Automatically detects user's system theme preference
- 🎨 **Ant Design Integration**: Full integration with Ant Design's theme system
- 🎯 **CSS Variables**: Support for custom CSS variables
- ⚡ **Smooth Transitions**: Smooth theme transitions with CSS animations

## Components

### ThemeProvider
The main theme provider that wraps your app and provides theme context.

**Location**: `src/contexts/ThemeContext.js`

**Usage**:
```jsx
import { ThemeProvider } from '../contexts/ThemeContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### ThemeToggle
A button component that toggles between dark and light modes.

**Location**: `src/components/ThemeToggle.js`

**Usage**:
```jsx
import ThemeToggle from '../components/ThemeToggle';

// In your component
<ThemeToggle />

// With custom props
<ThemeToggle size="large" style={{ marginLeft: 8 }} />
```

## Hooks

### useTheme
The main theme hook that provides theme state and functions.

**Location**: `src/contexts/ThemeContext.js`

**Usage**:
```jsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { isDarkMode, toggleTheme, setTheme, theme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>
        Switch to {isDarkMode ? 'light' : 'dark'} mode
      </button>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
    </div>
  );
}
```

### useThemeMode
A simplified hook for theme management.

**Location**: `src/hooks/useThemeMode.js`

**Usage**:
```jsx
import { useThemeMode } from '../hooks/useThemeMode';

function MyComponent() {
  const { isDark, isLight, theme, toggle, setLight, setDark } = useThemeMode();
  
  return (
    <div>
      <p>Is Dark: {isDark ? 'Yes' : 'No'}</p>
      <p>Is Light: {isLight ? 'Yes' : 'No'}</p>
      <button onClick={toggle}>Toggle Theme</button>
      <button onClick={setLight}>Light Mode</button>
      <button onClick={setDark}>Dark Mode</button>
    </div>
  );
}
```

## CSS Variables

The theme system provides CSS variables that automatically update based on the current theme.

**Available Variables**:
- `--background-color`: Main background color
- `--text-color`: Main text color

**Usage**:
```css
.my-component {
  background-color: var(--background-color);
  color: var(--text-color);
}
```

## Ant Design Theme Configuration

The theme system automatically configures Ant Design components with appropriate colors for both light and dark modes.

**Customization**:
You can modify the theme configuration in `src/contexts/ThemeContext.js`:

```jsx
const antdTheme = {
  algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    colorPrimary: '#1890ff', // Your primary color
    borderRadius: 6,
  },
  components: {
    // Custom component themes
    Layout: {
      bodyBg: isDarkMode ? '#141414' : '#ffffff',
      headerBg: isDarkMode ? '#001529' : '#ffffff',
      siderBg: isDarkMode ? '#001529' : '#ffffff',
    },
    // Add more component customizations...
  },
};
```

## Implementation in Dashboard

The theme toggle has been added to the dashboard header. You can find it in `src/app/dashboard/page.js`:

```jsx
<Space>
  <Button
    type="text"
    icon={<BellOutlined />}
    style={{ fontSize: '16px' }}
  />
  <ThemeToggle />
  
  <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
    {/* User menu */}
  </Dropdown>
</Space>
```

## Best Practices

1. **Always use the theme context**: Don't hardcode colors, use the theme system
2. **Use CSS variables**: For custom styling, use the provided CSS variables
3. **Test both themes**: Always test your components in both light and dark modes
4. **Smooth transitions**: The system includes smooth transitions, avoid abrupt changes
5. **Accessibility**: Ensure sufficient contrast ratios in both themes

## Troubleshooting

### Theme not persisting
- Check if localStorage is available in your environment
- Ensure the ThemeProvider is wrapping your app correctly

### Ant Design components not themed
- Make sure the ConfigProvider is being used (it's included in ThemeProvider)
- Check that you're using the latest version of Ant Design

### CSS variables not working
- Ensure the `data-theme` attribute is being set on the html element
- Check that your CSS is using the correct variable names

## Adding to New Components

To add theme support to a new component:

1. **Import the hook**:
```jsx
import { useTheme } from '../contexts/ThemeContext';
```

2. **Use theme state**:
```jsx
function MyComponent() {
  const { isDarkMode } = useTheme();
  
  return (
    <div style={{ 
      backgroundColor: isDarkMode ? '#141414' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000'
    }}>
      Content
    </div>
  );
}
```

3. **Or use CSS variables**:
```jsx
function MyComponent() {
  return (
    <div className="my-component">
      Content
    </div>
  );
}
```

```css
.my-component {
  background-color: var(--background-color);
  color: var(--text-color);
}
``` 