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
import { markAsRead, markAllAsRead } from '../../store/slices/notificationSlice';

const NotificationCenter: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((state: RootState) => state.notifications);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (notificationId: string) => {
    dispatch(markAsRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
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
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-label="show notifications"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: 360,
          },
        }}
      >
        <Box p={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Notifications</Typography>
            {notifications.length > 0 && (
              <Typography
                variant="body2"
                color="primary"
                style={{ cursor: 'pointer' }}
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </Typography>
            )}
          </Box>
        </Box>
        <Divider />
        <List>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="No notifications" />
            </ListItem>
          ) : (
            notifications.map((notification) => (
              <ListItem
                key={notification.id}
                style={{
                  backgroundColor: notification.isRead ? 'inherit' : '#f5f5f5',
                }}
              >
                <Box display="flex" alignItems="center" width="100%">
                  <Box mr={2} fontSize="1.5rem">
                    {getNotificationIcon(notification.type)}
                  </Box>
                  <ListItemText
                    primary={notification.content}
                    secondary={new Date(notification.createdAt).toLocaleString()}
                  />
                  {!notification.isRead && (
                    <ListItemSecondaryAction>
                      <Typography
                        variant="body2"
                        color="primary"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Mark as read
                      </Typography>
                    </ListItemSecondaryAction>
                  )}
                </Box>
              </ListItem>
            ))
          )}
        </List>
      </Menu>
    </Box>
  );
};

export default NotificationCenter; 