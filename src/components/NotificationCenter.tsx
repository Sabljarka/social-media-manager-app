import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Badge,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationCenter: React.FC = () => {
  const { notifications } = useSelector((state: RootState) => state.social);

  return (
    <Box sx={{ position: 'relative' }}>
      <IconButton color="inherit">
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      {notifications.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            right: 0,
            backgroundColor: 'white',
            boxShadow: 2,
            borderRadius: 1,
            width: 300,
            maxHeight: 400,
            overflow: 'auto',
            zIndex: 1000,
          }}
        >
          <List>
            {notifications.map((notification) => (
              <ListItem key={notification.id} divider>
                <ListItemText
                  primary={notification.message}
                  secondary={new Date(notification.timestamp).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default NotificationCenter; 