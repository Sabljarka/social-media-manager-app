import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Button,
  Divider,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useThemeContext } from '../context/ThemeContext';

const Settings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { isDarkMode, toggleTheme } = useThemeContext();

  return (
    <Box sx={{ 
      p: 3,
      maxWidth: 800,
      margin: '0 auto',
    }}>
      <Typography variant="h4" gutterBottom>
        Podešavanja
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Podešavanja aplikacije
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Tamni režim"
              secondary="Uključi/isključi tamni režim za aplikaciju"
            />
            <ListItemSecondaryAction>
              <Switch 
                edge="end" 
                checked={isDarkMode}
                onChange={toggleTheme}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Email obaveštenja"
              secondary="Primaj email obaveštenja za važne ažuriranja"
            />
            <ListItemSecondaryAction>
              <Switch edge="end" defaultChecked />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          User Information
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Username"
              secondary={user?.username}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Email"
              secondary={user?.email}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Role"
              secondary={user?.role}
            />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Akcije na nalogu
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" color="primary">
            Promeni lozinku
          </Button>
          <Button variant="outlined" color="error">
            Obriši nalog
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings; 