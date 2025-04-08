import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  List,
  ListItem,
  Text,
  useDisclosure,
  VStack,
  Button,
  useColorModeValue,
  HStack,
  Divider,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  SettingsIcon,
  ViewIcon,
  ChatIcon,
  AtSignIcon,
} from '@chakra-ui/icons';
import { FaFacebook, FaInstagram, FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';
import NotificationCenter from '../notifications/NotificationCenter';

const menuItems = [
  { text: 'Dashboard', path: '/dashboard', icon: <ViewIcon /> },
  { text: 'Facebook', path: '/facebook', icon: <FaFacebook /> },
  { text: 'Twitter', path: '/twitter', icon: <FaTwitter /> },
  { text: 'Instagram', path: '/instagram', icon: <FaInstagram /> },
  { text: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

const footerLinks = [
  { text: 'About Us', path: '/about' },
  { text: 'Contact', path: '/contact' },
  { text: 'Terms of Service', path: '/terms' },
  { text: 'Privacy Policy', path: '/privacy' },
  { text: 'Data Deletion', path: '/data-deletion' },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const footerBgColor = useColorModeValue('gray.50', 'gray.900');
  const footerTextColor = useColorModeValue('gray.600', 'gray.400');

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} position="relative">
      {/* Sidebar */}
      <Box
        as="nav"
        pos="fixed"
        left={0}
        zIndex="sticky"
        h="full"
        pb="10"
        overflowX="hidden"
        overflowY="auto"
        bg={bgColor}
        borderColor={borderColor}
        w="60"
        display={{ base: 'none', md: 'block' }}
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
            Social Manager
          </Text>
        </Flex>
        <VStack spacing={1} align="stretch" px={3}>
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? 'solid' : 'ghost'}
                colorScheme={location.pathname === item.path ? 'blue' : 'gray'}
                leftIcon={item.icon}
                w="full"
                justifyContent="flex-start"
                size="md"
                mb={1}
              >
                {item.text}
              </Button>
            </Link>
          ))}
        </VStack>
      </Box>

      {/* Mobile sidebar */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent>
          <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
            <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
              Social Manager
            </Text>
            <IconButton
              variant="outline"
              onClick={onClose}
              icon={<CloseIcon />}
              aria-label="Close menu"
            />
          </Flex>
          <VStack spacing={1} align="stretch" px={3}>
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? 'solid' : 'ghost'}
                  colorScheme={location.pathname === item.path ? 'blue' : 'gray'}
                  leftIcon={item.icon}
                  w="full"
                  justifyContent="flex-start"
                  size="md"
                  mb={1}
                >
                  {item.text}
                </Button>
              </Link>
            ))}
          </VStack>
        </DrawerContent>
      </Drawer>

      {/* Main content */}
      <Box ml={{ base: 0, md: 60 }} p="4" pb="24">
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          px="4"
          bg={bgColor}
          h="16"
          borderBottomWidth="1px"
          borderColor={borderColor}
          position="fixed"
          top="0"
          right="0"
          left={{ base: 0, md: 60 }}
          zIndex="sticky"
        >
          <IconButton
            aria-label="Menu"
            display={{ base: 'inline-flex', md: 'none' }}
            onClick={onOpen}
            icon={<HamburgerIcon />}
            size="md"
          />
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
            Social Media Manager
          </Text>
          <HStack spacing={4}>
            <NotificationCenter />
            <Button
              leftIcon={<SettingsIcon />}
              colorScheme="red"
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </HStack>
        </Flex>

        <Box pt="16">
          <Container maxW="container.xl" py={8}>
            {children}
          </Container>
        </Box>

        {/* Footer */}
        <Box
          as="footer"
          bg={footerBgColor}
          color={footerTextColor}
          py={8}
          position="absolute"
          bottom={0}
          width="full"
          borderTopWidth={1}
          borderColor={borderColor}
        >
          <Container maxW="container.xl">
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
              <VStack align={{ base: 'center', md: 'flex-start' }} mb={{ base: 4, md: 0 }}>
                <Text fontSize="lg" fontWeight="bold">Social Media Manager</Text>
                <Text fontSize="sm">© 2024 All Rights Reserved</Text>
              </VStack>
              
              <HStack spacing={6} mb={{ base: 4, md: 0 }}>
                {footerLinks.map((link) => (
                  <Link key={link.path} to={link.path}>
                    <Text fontSize="sm" _hover={{ color: 'blue.500' }}>
                      {link.text}
                    </Text>
                  </Link>
                ))}
              </HStack>

              <HStack spacing={4}>
                <IconButton
                  as="a"
                  href="https://github.com"
                  target="_blank"
                  aria-label="GitHub"
                  icon={<FaGithub />}
                  variant="ghost"
                  size="sm"
                />
                <IconButton
                  as="a"
                  href="https://linkedin.com"
                  target="_blank"
                  aria-label="LinkedIn"
                  icon={<FaLinkedin />}
                  variant="ghost"
                  size="sm"
                />
              </HStack>
            </Flex>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 