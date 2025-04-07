import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  alpha,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import NotificationCenter from '../notifications/NotificationCenter';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { text: 'Facebook', path: '/facebook', icon: <FacebookIcon /> },
  { text: 'Twitter', path: '/twitter', icon: <TwitterIcon /> },
  { text: 'Instagram', path: '/instagram', icon: <InstagramIcon /> },
  { text: 'Podešavanja', path: '/settings', icon: <SettingsIcon /> },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          noWrap 
          component="div"
          sx={{ 
            fontWeight: 600,
            letterSpacing: '-0.025em',
            fontSize: '1.1rem',
          }}
        >
          Social Manager
        </Typography>
      </Toolbar>
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItem 
            key={item.path} 
            button 
            component={Link} 
            to={item.path}
            className={`list-item-enter hover-lift ${location.pathname === item.path ? 'active' : ''}`}
            sx={{ 
              borderRadius: '8px',
              mb: 0.5,
              py: 0.75,
              px: 1.5,
              '&.active': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              },
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: 'inherit',
              minWidth: 36,
              '& svg': {
                fontSize: '1.25rem',
              },
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{
                '& .MuiTypography-root': {
                  fontSize: '0.875rem',
                  fontWeight: 500,
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 'var(--shadow-sm)',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{ 
              fontWeight: 600,
              letterSpacing: '-0.025em',
              flexGrow: 1,
              fontSize: '1.1rem',
            }}
          >
            Social Media Manager
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <NotificationCenter />
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              size="small"
              sx={{
                fontSize: '0.875rem',
                py: 0.5,
              }}
            >
              Odjavi se
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ 
          width: { sm: drawerWidth }, 
          flexShrink: { sm: 0 },
          zIndex: theme.zIndex.drawer,
        }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.default',
        }}
        className="page-enter"
      >
        <Toolbar />
        <Container 
          maxWidth="lg" 
          sx={{ 
            flex: 1,
            py: 4,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box className="section-enter" sx={{ flex: 1 }}>
            {children}
          </Box>
        </Container>
        <Box
          component="footer"
          sx={{
            py: 4,
            px: 2,
            mt: 'auto',
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              mb: 2,
            }}>
              <Link to="/privacy-policy" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography variant="body2" color="text.secondary">
                  Privacy Policy
                </Typography>
              </Link>
              <Divider orientation="vertical" flexItem />
              <Link to="/terms-of-service" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography variant="body2" color="text.secondary">
                  Terms of Service
                </Typography>
              </Link>
            </Box>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              align="center"
            >
              © {new Date().getFullYear()} Social Media Manager. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 