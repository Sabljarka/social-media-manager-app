import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Text,
  VStack,
  HStack,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import { RootState } from '../../store';
import { setNotifications } from '../../features/socialSlice';

const NotificationCenter: React.FC = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state: RootState) => state.social);
  const toast = useToast();

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
    toast({
      title: 'Sve notifikacije su označene kao pročitane',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
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
      <Menu>
        <MenuButton
          as={IconButton}
          icon={
            <Badge
              colorScheme="red"
              variant="solid"
              borderRadius="full"
              boxSize="1.25rem"
              position="absolute"
              top="-1"
              right="-1"
              display={notifications.filter(n => !n.read).length > 0 ? 'flex' : 'none'}
              alignItems="center"
              justifyContent="center"
            >
              {notifications.filter(n => !n.read).length}
            </Badge>
          }
          variant="ghost"
          aria-label="Notifikacije"
        >
          <BellIcon />
        </MenuButton>
        <MenuList maxH="400px" w="320px" overflowY="auto">
          <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
            <Text fontWeight="bold" fontSize="lg">Notifikacije</Text>
            {notifications.some(n => !n.read) && (
              <Text
                color="blue.500"
                cursor="pointer"
                onClick={handleMarkAllAsRead}
              >
                Označi sve kao pročitano
              </Text>
            )}
          </Box>
          <Divider />
          <VStack spacing={0} align="stretch">
            {notifications.length === 0 ? (
              <MenuItem>
                <Text>Nema notifikacija</Text>
              </MenuItem>
            ) : (
              notifications.map((notification) => (
                <MenuItem
                  key={notification.id}
                  bg={notification.read ? 'inherit' : 'gray.50'}
                  _hover={{ bg: 'gray.100' }}
                >
                  <HStack spacing={2} w="full">
                    <Text>{getNotificationIcon(notification.type)}</Text>
                    <VStack align="start" spacing={0} flex={1}>
                      <Text>{notification.message}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {new Date(notification.timestamp).toLocaleString()}
                      </Text>
                    </VStack>
                    {!notification.read && (
                      <Text
                        color="blue.500"
                        cursor="pointer"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Označi kao pročitano
                      </Text>
                    )}
                  </HStack>
                </MenuItem>
              ))
            )}
          </VStack>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default NotificationCenter; 