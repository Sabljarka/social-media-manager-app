import React, { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Icon,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { authService } from '../../services/authService';
import FacebookManager from '../facebook/FacebookManager';
import FacebookPagesList from '../facebook/FacebookPagesList';

const Dashboard: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<Record<string, boolean>>({});
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const toast = useToast();

  const platforms = [
    { name: 'Facebook', icon: FaFacebook, color: 'blue.500', connect: authService.connectFacebook },
    { name: 'Instagram', icon: FaInstagram, color: 'pink.500', connect: authService.connectInstagram },
    { name: 'TikTok', icon: FaTiktok, color: 'black', connect: authService.connectTikTok },
    { name: 'YouTube', icon: FaYoutube, color: 'red.500', connect: authService.connectYouTube },
  ];

  useEffect(() => {
    checkStatuses();
  }, []);

  const checkStatuses = async () => {
    const statuses: Record<string, boolean> = {};
    for (const platform of platforms) {
      statuses[platform.name] = await authService.checkConnectionStatus(platform.name);
    }
    setConnectionStatus(statuses);
  };

  const handleConnect = async (platform: string, connect: () => Promise<void>) => {
    try {
      await connect();
      setConnectionStatus(prev => ({ ...prev, [platform]: true }));
    } catch (error) {
      toast({
        title: 'Greška',
        description: `Greška pri povezivanju sa ${platform}-om`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePageSelect = (pageId: string) => {
    setSelectedPageId(pageId);
  };

  return (
    <Box p={6}>
      <Heading mb={6} size="lg">Dobrodošli na Dashboard</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        {platforms.map((platform) => (
          <Card key={platform.name} variant="outline">
            <CardHeader>
              <HStack>
                <Icon as={platform.icon} color={platform.color} boxSize={6} />
                <Heading size="md">{platform.name}</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Text>Status: {connectionStatus[platform.name] ? 'Povezano' : 'Nije povezano'}</Text>
                <Button 
                  colorScheme={connectionStatus[platform.name] ? 'green' : 'blue'} 
                  size="sm"
                  onClick={() => handleConnect(platform.name, platform.connect)}
                >
                  {connectionStatus[platform.name] ? 'Povezano' : 'Poveži nalog'}
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {connectionStatus['Facebook'] && (
        <Box mt={8}>
          <Heading size="md" mb={4}>Facebook Stranice</Heading>
          <FacebookPagesList onPageSelect={handlePageSelect} />
          
          {selectedPageId && (
            <>
              <Divider my={6} />
              <Heading size="md" mb={4}>Facebook Manager</Heading>
              <FacebookManager pageId={selectedPageId} />
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Dashboard; 