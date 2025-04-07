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

const Settings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

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

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Application Settings
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Dark Mode"
              secondary="Toggle dark mode for the application"
            />
            <ListItemSecondaryAction>
              <Switch edge="end" />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Email Notifications"
              secondary="Receive email notifications for important updates"
            />
            <ListItemSecondaryAction>
              <Switch edge="end" defaultChecked />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Account Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" color="primary">
            Change Password
          </Button>
          <Button variant="outlined" color="error">
            Delete Account
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings; 