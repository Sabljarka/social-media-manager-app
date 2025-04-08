import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Button,
  VStack,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react';
import axios from 'axios';

interface Post {
  id: string;
  message: string;
  created_time: string;
  comments?: {
    data: Comment[];
  };
}

interface Comment {
  id: string;
  message: string;
  created_time: string;
  from: {
    name: string;
  };
}

interface PostListProps {
  pageId: string;
  onPostSelect: (postId: string) => void;
}

interface FacebookResponse {
  data: Post[];
}

const PostList: React.FC<PostListProps> = ({ pageId, onPostSelect }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get<FacebookResponse>(`/api/facebook/pages/${pageId}/posts`);
      setPosts(response.data.data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch posts',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pageId) {
      fetchPosts();
    }
  }, [pageId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
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
      <Heading size="lg" mb={4}>Posts</Heading>
      <VStack spacing={4} align="stretch">
        {posts.length === 0 ? (
          <Card>
            <CardBody>
              <Text>No posts found.</Text>
            </CardBody>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <Heading size="md">Post</Heading>
                <Text fontSize="sm" color="gray.500">
                  {formatDate(post.created_time)}
                </Text>
              </CardHeader>
              <CardBody>
                <Text mb={4}>{post.message}</Text>
                {post.comments && post.comments.data && post.comments.data.length > 0 && (
                  <Box>
                    <Heading size="sm" mb={2}>Comments</Heading>
                    <VStack align="stretch" spacing={2}>
                      {post.comments.data.map((comment) => (
                        <Box key={comment.id} p={2} bg="gray.50" borderRadius="md">
                          <Text fontWeight="bold">{comment.from.name}</Text>
                          <Text>{comment.message}</Text>
                          <Text fontSize="sm" color="gray.500">
                            {formatDate(comment.created_time)}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                )}
                <Button
                  mt={4}
                  colorScheme="blue"
                  onClick={() => onPostSelect(post.id)}
                >
                  Manage Comments
                </Button>
              </CardBody>
            </Card>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default PostList; 