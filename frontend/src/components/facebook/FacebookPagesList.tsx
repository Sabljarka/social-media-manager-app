import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  Text,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react';
import axios from 'axios';

interface FacebookPage {
  id: string;
  name: string;
  followers: number;
  isActive: boolean;
}

interface FacebookPagesListProps {
  onPageSelect: (pageId: string) => void;
}

const FacebookPagesList: React.FC<FacebookPagesListProps> = ({ onPageSelect }) => {
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ data: FacebookPage[] }>('/api/facebook/pages');
      if (response.data && Array.isArray(response.data.data)) {
        setPages(response.data.data);
      } else {
        setPages([]);
        toast({
          title: 'Warning',
          description: 'No Facebook pages available',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch Facebook pages',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleLoadPosts = async (pageId: string) => {
    try {
      onPageSelect(pageId);
      const response = await axios.get(`/api/facebook/pages/${pageId}/posts`);
      toast({
        title: 'Success',
        description: 'Posts loaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load posts',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Center p={8}>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box p={4}>
      <Heading size="lg" mb={4}>Facebook Pages</Heading>
      {pages.length === 0 ? (
        <Card>
          <CardBody>
            <Text>No Facebook pages found.</Text>
          </CardBody>
        </Card>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {pages.map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <Heading size="md">{page.name}</Heading>
              </CardHeader>
              <CardBody>
                <Text mb={2}>Followers: {page.followers}</Text>
                <Text mb={4}>Status: {page.isActive ? 'Active' : 'Inactive'}</Text>
                <Button
                  colorScheme="blue"
                  onClick={() => handleLoadPosts(page.id)}
                  isLoading={loading}
                >
                  Load Posts
                </Button>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default FacebookPagesList; 