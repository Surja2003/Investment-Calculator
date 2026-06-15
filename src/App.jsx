import { useState, useMemo, lazy, Suspense } from 'react';
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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import CalculateIcon from '@mui/icons-material/Calculate';
import CalculatorLogo from './components/CalculatorLogo';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FlagIcon from '@mui/icons-material/Flag';
import TimelineIcon from '@mui/icons-material/Timeline';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CloseIcon from '@mui/icons-material/Close';

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

// Loading fallback component
function PageLoader({ isDark }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 2 }}>
      <CircularProgress sx={{ color: '#10B981' }} size={40} />
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
  const isMobile = useMediaQuery('(max-width:768px)');
  const { isDarkMode } = useTheme();
  
  // Show all tabs; on mobile they are scrollable
  const visibleTabs = NAV_ITEMS;
  
  return (
    <Tabs 
      value={NAV_ITEMS.findIndex(item => item.path === location.pathname)}
      variant={isMobile ? "scrollable" : "standard"}
      scrollButtons={isMobile ? "auto" : false}
      sx={{
        '& .MuiTab-root': {
          minWidth: isMobile ? 'auto' : 120,
          color: isDarkMode ? '#9ca3af' : '#475569',
          fontWeight: 500,
          '&.Mui-selected': {
            color: '#10B981',
            fontWeight: 700,
          },
          textTransform: 'none',
          fontSize: '0.9rem',
        },
      }}
    >
      {visibleTabs.map((item) => (
        <Tab 
          key={item.path}
          label={item.label}
          icon={isMobile ? item.icon : undefined}
          iconPosition="start"
          component={Link}
          to={item.path}
        />
      ))}
    </Tabs>
  );
}

function MobileDrawer({ open, onClose }) {
  const location = useLocation();
  
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          bgcolor: 'background.paper',
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="flex items-center gap-2">
          <CalculatorLogo size="24" />
          <Typography variant="h6">Investment Calculator</Typography>
        </div>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItem 
            button 
            key={item.path}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={onClose}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'rgba(90, 108, 234, 0.1)',
                borderLeft: '3px solid',
                borderColor: 'primary.main',
              }
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

// Header auth UI removed per request

function App() {
  // Use ThemeContext for dark mode
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');

  const theme = useMemo(() => createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      ...(isDarkMode 
        ? THEME_CONSTANTS.colors 
        : {
          primary: { main: '#10B981' },
          secondary: { main: '#06B6D4' },
          success: { main: '#10B981' },
          background: {
            default: '#f8fafc',
            paper: '#ffffff',
          },
          text: {
            primary: '#0f172a',
            secondary: '#475569',
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
              ? '0 4px 20px 0 rgba(0,0,0,0.2)' 
              : '0 2px 10px 0 rgba(0,0,0,0.08)'
          }
        }
      }
    }
  }), [isDarkMode]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DevSimulatorToggle>
        <Router basename="/Investment-Calculator">
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 5 }}>
          <AppBar 
            position="sticky" 
            color={isDarkMode ? "transparent" : "default"}
            elevation={isDarkMode ? 0 : 1}
            sx={{ 
              borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(15,23,42,0.08)',
              backdropFilter: 'blur(8px)',
              backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.92)',
            }}
          >
            <Toolbar>
              {isMobile && (
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer}
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                <CalculatorLogo size="28" />
                <Typography 
                  variant="h6" 
                  component={Link} 
                  to="/" 
                  sx={{ 
                    textDecoration: 'none', 
                    color: 'text.primary',
                    fontWeight: 600,
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Investment Calculator
                </Typography>
              </Box>
              
              {!isMobile && <NavigationTabs />}
              
              <IconButton 
                sx={{ ml: 2 }} 
                onClick={toggleDarkMode}
                color="inherit"
              >
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              {/* Optional login/email removed per request */}
            </Toolbar>
            
            {isMobile && <NavigationTabs />}
          </AppBar>

          <MobileDrawer open={drawerOpen} onClose={toggleDrawer} />

          <MobileBottomNav />

          <Container maxWidth={false} sx={{ mt: { xs: 2, md: 3 }, px: { xs: 0, md: 4 } }}>
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
