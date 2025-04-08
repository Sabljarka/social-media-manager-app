import React from 'react';
import {
  Box,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  IconButton,
  Button,
  Stack,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  AddIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import {
  FaFacebook,
  FaInstagram,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';

interface User {
  email: string;
  token: string;
  username?: string;
}

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { facebookPages, instagramAccounts } = useSelector((state: RootState) => state.social);
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.700');

  return (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Welcome, {(user as User)?.username || (user as User)?.email}!
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {/* Facebook Section */}
        <Card bg={cardBg}>
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Text fontSize="xl" fontWeight="bold">
                Facebook Pages
              </Text>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="facebook"
                onClick={() => navigate('/facebook')}
              >
                Add Page
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            {facebookPages.length > 0 ? (
              <Stack spacing={4}>
                {facebookPages.map((page) => (
                  <Card key={page.id} variant="outline">
                    <CardHeader>
                      <Flex align="center">
                        <Avatar icon={<FaFacebook />} src={page.picture} />
                        <Box ml={4} flex="1">
                          <Text fontWeight="bold">{page.name}</Text>
                          <Text fontSize="sm" color="gray.500">{page.category}</Text>
                        </Box>
                        <IconButton
                          aria-label="Settings"
                          icon={<SettingsIcon />}
                          variant="ghost"
                          size="sm"
                        />
                      </Flex>
                    </CardHeader>
                    <CardBody pt={0}>
                      <Text fontSize="sm" color="gray.500">
                        Followers: {page.followers}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Posts: {page.posts?.length || 0}
                      </Text>
                    </CardBody>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Text textAlign="center" color="gray.500">
                No Facebook pages connected. Click "Add Page" to get started.
              </Text>
            )}
          </CardBody>
        </Card>

        {/* Instagram Section */}
        <Card bg={cardBg}>
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Text fontSize="xl" fontWeight="bold">
                Instagram Accounts
              </Text>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="pink"
                onClick={() => navigate('/instagram')}
              >
                Add Account
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            {instagramAccounts.length > 0 ? (
              <Stack spacing={4}>
                {instagramAccounts.map((account) => (
                  <Card key={account.id} variant="outline">
                    <CardHeader>
                      <Flex align="center">
                        <Avatar icon={<FaInstagram />} src={account.picture} />
                        <Box ml={4} flex="1">
                          <Text fontWeight="bold">{account.username}</Text>
                          <Text fontSize="sm" color="gray.500">
                            {account.businessAccount ? 'Business Account' : 'Personal Account'}
                          </Text>
                        </Box>
                        <IconButton
                          aria-label="Settings"
                          icon={<SettingsIcon />}
                          variant="ghost"
                          size="sm"
                        />
                      </Flex>
                    </CardHeader>
                    <CardBody pt={0}>
                      <Text fontSize="sm" color="gray.500">
                        Followers: {account.followers}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Posts: {account.posts?.length || 0}
                      </Text>
                    </CardBody>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Text textAlign="center" color="gray.500">
                No Instagram accounts connected. Click "Add Account" to get started.
              </Text>
            )}
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard; 