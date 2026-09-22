import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { useTheme } from './hooks/useTheme';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tab,
  Tabs,
  CssBaseline,
  Container,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import CalculateIcon from '@mui/icons-material/Calculate';
import CalculatorLogo from './components/CalculatorLogo';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FlagIcon from '@mui/icons-material/Flag';
import TimelineIcon from '@mui/icons-material/Timeline';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

// ── Lazy-loaded route components (code splitting) ─────────────────────────────
const ResponsiveCalculator = lazy(() => import('./components/ResponsiveCalculator'));
const Home = lazy(() => import('./pages/Home'));
const CompareMode = lazy(() => import('./pages/CompareMode'));
const EMICalculator = lazy(() => import('./pages/EMICalculator'));
const Glossary = lazy(() => import('./pages/Glossary'));
const ReverseSIP = lazy(() => import('./pages/ReverseSIP'));
const FooterComp = lazy(() => import('./components/Footer'));

import MobileBottomNav from './components/MobileBottomNav';
import DevSimulatorToggle from './components/DevSimulatorToggle';
import { THEME_CONSTANTS } from './constants/theme';
import './App.css';

const BRAND = '#3B6098';

// Loading fallback component
function PageLoader({ isDark }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 2 }}>
      <CircularProgress sx={{ color: 'var(--color-primary)' }} size={40} />
      <Typography variant="body2" sx={{ color: isDark ? '#4b5563' : '#9ca3af', fontSize: '0.8rem' }}>Loading...</Typography>
    </Box>
  );
}

// Navigation routes and labels
const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: <CalculateIcon /> },
  { path: '/sip', label: 'SIP', icon: <CalculateIcon /> },
  { path: '/lumpsum', label: 'Lumpsum', icon: <AttachMoneyIcon /> },
  { path: '/swp', label: 'SWP', icon: <TimelineIcon /> },
  { path: '/goals', label: 'Goal', icon: <FlagIcon /> },
  { path: '/emi', label: 'EMI', icon: <AttachMoneyIcon /> },
  { path: '/compare', label: 'Compare', icon: <CompareArrowsIcon /> },
  { path: '/reverse', label: 'XIRR', icon: <CalculateIcon /> },
  { path: '/glossary', label: 'Glossary', icon: <FlagIcon /> },
];

function NavigationTabs() {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const current = NAV_ITEMS.findIndex(item => item.path === location.pathname);

  return (
    <Tabs
      value={current === -1 ? false : current}
      variant="standard"
      sx={{
        minHeight: 44,
        '& .MuiTabs-indicator': {
          height: 3,
          borderRadius: 3,
          backgroundColor: BRAND,
        },
        '& .MuiTab-root': {
          minHeight: 44,
          minWidth: 'auto',
          px: 1.75,
          color: isDarkMode ? '#9BA9BA' : '#5A6B7E',
          fontWeight: 600,
          '&.Mui-selected': {
            color: 'var(--color-primary)',
            fontWeight: 700,
          },
          textTransform: 'none',
          fontSize: '0.9rem',
        },
      }}
    >
      {NAV_ITEMS.map((item) => (
        <Tab
          key={item.path}
          label={item.label}
          component={Link}
          to={item.path}
        />
      ))}
    </Tabs>
  );
}

function App() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const isMobile = useMediaQuery('(max-width:768px)');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      ...(isDarkMode
        ? THEME_CONSTANTS.colors
        : {
          primary: { main: '#3B6098' },
          secondary: { main: '#4C9A82' },
          success: { main: '#4C9A82' },
          background: {
            default: '#F4F6FA',
            paper: '#FFFFFF',
          },
          text: {
            primary: '#1C2A3A',
            secondary: '#5A6B7E',
          }
        }
      ),
    },
    typography: THEME_CONSTANTS.typography,
    shape: THEME_CONSTANTS.shape,
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: isDarkMode
              ? '0 4px 20px 0 rgba(0,0,0,0.25)'
              : '0 2px 12px 0 rgba(28,42,58,0.08)'
          }
        }
      }
    }
  }), [isDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DevSimulatorToggle>
        <Router basename="/Investment-Calculator">
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 5 }}>
          <AppBar
            position="sticky"
            elevation={0}
            enableColorOnDark
            sx={{
              color: 'text.primary',
              backgroundColor: 'var(--glass-bg)',
              backgroundImage: 'none',
              backdropFilter: 'saturate(180%) blur(22px)',
              WebkitBackdropFilter: 'saturate(180%) blur(22px)',
              borderBottom: '1px solid var(--glass-border)',
              boxShadow: scrolled ? 'var(--glass-shadow)' : 'none',
              transition: 'box-shadow 0.25s ease, background-color 0.25s ease',
            }}
          >
            <Toolbar sx={{ minHeight: scrolled ? 56 : 64, transition: 'min-height 0.25s ease' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                <CalculatorLogo size="28" />
                <Typography
                  variant="h6"
                  component={Link}
                  to="/"
                  sx={{
                    textDecoration: 'none',
                    color: 'text.primary',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    fontSize: { xs: '1rem', sm: '1.15rem' },
                  }}
                >
                  Investment Calculator
                </Typography>
              </Box>

              {!isMobile && <NavigationTabs />}

              <IconButton
                sx={{ ml: 1.5, color: 'text.primary' }}
                onClick={toggleDarkMode}
                aria-label="Toggle theme"
              >
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Toolbar>
          </AppBar>

          <MobileBottomNav />

          <Container maxWidth={false} sx={{ mt: { xs: 2, md: 3 }, px: { xs: 2, md: 4 } }}>
            <Suspense fallback={<PageLoader isDark={isDarkMode} />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sip" element={<ResponsiveCalculator mode="sip" />} />
                <Route path="/lumpsum" element={<ResponsiveCalculator mode="lumpsum" />} />
                <Route path="/swp" element={<ResponsiveCalculator mode="swp" />} />
                <Route path="/goals" element={<ResponsiveCalculator mode="goal" />} />
                <Route path="/emi" element={<EMICalculator />} />
                <Route path="/compare" element={<CompareMode />} />
                <Route path="/reverse" element={<ReverseSIP />} />
                <Route path="/glossary" element={<Glossary />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </Suspense>
          </Container>
        </Box>
        <Suspense fallback={null}>
          <FooterComp />
        </Suspense>
      </Router>
      </DevSimulatorToggle>
    </ThemeProvider>
  );
}

export default App;
