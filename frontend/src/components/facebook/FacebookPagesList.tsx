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
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await axios.get<FacebookPage[]>('/api/facebook/pages');
      setPages(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch Facebook pages',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleLoadPosts = async (pageId: string) => {
    try {
      const response = await axios.get(`/api/facebook/pages/${pageId}/posts`);
      onPageSelect(pageId);
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

  return (
    <Box p={4}>
      <Heading size="lg" mb={4}>Facebook Pages</Heading>
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
    </Box>
  );
};

export default FacebookPagesList; 