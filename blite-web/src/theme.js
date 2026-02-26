import { createTheme, alpha } from '@mui/material/styles';

// --- SKY BLUE BRAND PALETTE ---
const brand = {
  main: '#0EA5E9',   // Sky Blue 500 (Primary Action)
  light: '#38BDF8',  // Sky Blue 400 (Highlights/Hover)
  dark: '#0284C7',   // Sky Blue 600 (Deep interaction/Active)
  contrastText: '#FFFFFF', // White text on buttons
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brand.main,
      light: brand.light,
      dark: brand.dark,
      contrastText: brand.contrastText,
    },
    secondary: {
      main: '#64748B', // Slate 500 (Neutral Grey for secondary items)
    },
    background: {
      default: '#F8FAFC', // Slate 50 (Very soft cool grey background)
      paper: '#FFFFFF',   // Pure white surfaces
    },
    text: {
      primary: '#0F172A', // Slate 900 (High contrast dark text for readability)
      secondary: '#64748B', // Slate 500 (Softer grey for labels)
    },
    divider: '#F1F5F9', // Very subtle divider
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h6: {
      fontWeight: 700,
      color: '#0F172A', // Keep headers dark for contrast
    },
    subtitle2: {
      fontWeight: 600,
      textTransform: 'uppercase',
      fontSize: '0.75rem',
      letterSpacing: '0.05em',
      color: '#64748B',
    },
    mono: {
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    }
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    // 1. Buttons: Softer Sky Blue
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '8px',
          boxShadow: 'none',
        },
        contained: {
          backgroundColor: brand.main,
          color: brand.contrastText,
          '&:hover': {
            backgroundColor: brand.dark, // Slightly deeper sky blue on hover
            boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.2)', // Soft colored shadow
          },
        },
        outlined: {
          borderColor: brand.light,
          color: brand.dark,
          '&:hover': {
            backgroundColor: alpha(brand.main, 0.05), // Very faint sky blue tint
            borderColor: brand.main,
          }
        }
      },
    },
    // 2. Sidebar: Light & Airy
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          marginBottom: '4px',
          '&.Mui-selected': {
            backgroundColor: alpha(brand.main, 0.1), // 10% Sky Blue background
            color: brand.dark, // Deep Sky Blue text
            '&:hover': {
              backgroundColor: alpha(brand.main, 0.15),
            },
            '& .MuiListItemIcon-root': {
              color: brand.main, // Icon becomes Sky Blue
            }
          },
          '&:hover': {
            backgroundColor: '#F1F5F9', // Grey hover for inactive items
          }
        },
      },
    },
    // 3. Inputs: Soft Blue Focus
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: brand.main, // Sky blue border when typing
            borderWidth: '2px',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: brand.light,
          }
        }
      }
    },
    // 4. Cards/Surfaces
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', // Minimal shadow
          border: '1px solid #E2E8F0',
        },
      },
    },
  },
});

export default theme;