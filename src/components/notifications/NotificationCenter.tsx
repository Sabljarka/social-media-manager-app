import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Badge, 
  IconButton, 
  Menu, 
  MenuItem, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { RootState } from '../../store';
import { setNotifications } from '../../features/socialSlice';

const NotificationCenter: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const { notifications } = useSelector((state: RootState) => state.social);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    );
    dispatch(setNotifications(updatedNotifications));
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    dispatch(setNotifications(updatedNotifications));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return '💬';
      case 'like':
        return '❤️';
      case 'message':
        return '✉️';
      case 'mention':
        return '👤';
      default:
        return '🔔';
    }
  };

  return (
    <Box>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          {notifications.some(n => !n.read) && (
            <Typography 
              variant="body2" 
              color="primary" 
              sx={{ cursor: 'pointer' }}
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Typography>
          )}
        </Box>
        <Divider />
        <List sx={{ width: '100%', p: 0 }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="No notifications" />
            </ListItem>
          ) : (
            notifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  bgcolor: notification.read ? 'inherit' : 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' }
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography component="span">{getNotificationIcon(notification.type)}</Typography>
                      <Typography component="span">{notification.message}</Typography>
                    </Box>
                  }
                  secondary={new Date(notification.timestamp).toLocaleString()}
                />
                {!notification.read && (
                  <ListItemSecondaryAction>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      Mark as read
                    </Typography>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))
          )}
        </List>
      </Menu>
    </Box>
  );
};

export default NotificationCenter; 