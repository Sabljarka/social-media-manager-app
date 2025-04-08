import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Card,
  CardBody,
  CardHeader,
  Avatar,
  IconButton,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  VStack,
  HStack,
  Badge,
  Spinner,
  Grid,
  useToast,
  Alert,
  AlertIcon,
  Divider,
  FormControl,
  FormLabel,
  Heading,
} from '@chakra-ui/react';
import { FaThumbsUp, FaTrash, FaPlus, FaReply } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  setPosts, 
  addPost,
  deleteComment,
  setFacebookPages,
  setSelectedPage,
  addFacebookPage,
  removeFacebookPage,
  updateFacebookPage,
} from '../store/slices/socialSlice';
import { FacebookPage as FacebookPageType, Post, Comment as CommentType, SocialState } from '../store/slices/socialSlice';
import facebookService, { FacebookPost } from '../services/facebookService';
import { socialService } from '../services/socialService';
import socketService from '../services/socketService';
import type { FacebookPage } from '../services/facebookService';
import DirectMessages from '../components/facebook/DirectMessages';

const FacebookPage: React.FC = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen: isNewPostOpen, onOpen: onNewPostOpen, onClose: onNewPostClose } = useDisclosure();
  const { isOpen: isNewPageOpen, onOpen: onNewPageOpen, onClose: onNewPageClose } = useDisclosure();
  const facebookPages = useSelector((state: RootState) => state.social.facebookPages);
  const selectedPage = useSelector((state: RootState) => state.social.selectedPage);
  const selectedPageData = selectedPage ? facebookPages.find(p => p.id === selectedPage) : null;
  const [newPostContent, setNewPostContent] = useState('');
  const [newPageName, setNewPageName] = useState('');
  const [newPageToken, setNewPageToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState<{ [key: string]: boolean }>({});
  const [posts, setLocalPosts] = useState<{ [key: string]: Post[] }>({});
  const [comments, setComments] = useState<{ [key: string]: CommentType[] }>({});
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [commentFilter, setCommentFilter] = useState<{ [key: string]: 'all' | 'new' | 'relevant' }>({});

  useEffect(() => {
    facebookPages.forEach(page => {
      socketService.joinRoom(`facebook_${page.id}`);
    });

    return () => {
      facebookPages.forEach(page => {
        socketService.leaveRoom(`facebook_${page.id}`);
      });
    };
  }, [facebookPages]);

  useEffect(() => {
    if (selectedPage) {
      const pagePosts = facebookPages.find(p => p.id === selectedPage)?.posts || [];
      setLocalPosts(prev => ({ ...prev, [selectedPage]: pagePosts }));
    }
  }, [selectedPage, facebookPages]);

  const handleLoadPosts = async (pageId: string) => {
    const page = facebookPages.find(p => p.id === pageId);
    
    if (!page) {
      return;
    }

    setLoadingPosts(prev => ({ ...prev, [pageId]: true }));
    setError(null);

    try {
      const isValid = await facebookService.validateToken(page.accessToken);
      
      if (!isValid) {
        setError(`Invalid access token for page ${page.name}`);
        return;
      }

      const posts = await facebookService.getPagePosts(page.id, page.accessToken);
      
      if (posts && posts.length > 0) {
        const formattedPosts: Post[] = await Promise.all(posts.map(async (post: FacebookPost) => {
          const comments = await facebookService.getPostComments(post.id, page.accessToken);

          const formattedComments: CommentType[] = comments.map((comment: any) => ({
            id: comment.id,
            postId: post.id,
            author: comment.from?.name || 'Unknown User',
            authorPicture: comment.from?.picture?.data?.url || '/default-avatar.png',
            content: comment.message,
            timestamp: comment.created_time,
            isHidden: false,
            replies: [],
            likes: comment.like_count || 0,
          }));

          return {
            id: post.id,
            pageId: page.id,
            content: post.message,
            timestamp: post.created_time,
            likes: post.likes?.summary?.total_count || 0,
            shares: post.shares?.count || 0,
            comments: formattedComments,
            isPublished: true,
          };
        }));

        dispatch(setPosts({ pageId: page.id, posts: formattedPosts }));
        setLocalPosts(prev => ({ ...prev, [pageId]: formattedPosts }));
      } else {
        setError(`No posts found for ${page.name}`);
      }
    } catch (error) {
      console.error(`Error loading posts for page ${page.id}:`, error);
      setError(`Failed to load posts for ${page.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoadingPosts(prev => ({ ...prev, [pageId]: false }));
    }
  };

  const handlePageSelect = (pageId: string) => {
    dispatch(setSelectedPage(pageId));
  };

  const handleAddPost = async () => {
    if (selectedPage && newPostContent.trim()) {
      try {
        const page = facebookPages.find(p => p.id === selectedPage);
        if (!page) return;

        const response = await socialService.createFacebookPost(
          page.id,
          page.accessToken,
          newPostContent
        );

        const newPost: Post = {
          id: response.id,
          pageId: selectedPage,
          content: newPostContent,
          timestamp: new Date().toISOString(),
          likes: 0,
          shares: 0,
          comments: [],
          isPublished: true,
        };

        dispatch(addPost({ pageId: selectedPage, post: newPost }));
        setNewPostContent('');
        onNewPostClose();
        toast({
          title: 'Post created successfully',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error creating Facebook post:', error);
        toast({
          title: 'Error creating post',
          description: error instanceof Error ? error.message : 'Unknown error',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleAddNewPage = async () => {
    if (newPageName.trim() && newPageToken.trim()) {
      try {
        const isValid = await facebookService.validateToken(newPageToken);
        if (!isValid) {
          toast({
            title: 'Invalid token',
            description: 'The provided access token is invalid',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        const pageInfo = await facebookService.getPageInfo(newPageToken);
        const newPage: FacebookPageType = {
          id: pageInfo.id,
          name: newPageName,
          accessToken: newPageToken,
          posts: [],
        };

        dispatch(addFacebookPage(newPage));
        setNewPageName('');
        setNewPageToken('');
        onNewPageClose();
        toast({
          title: 'Page added successfully',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error adding Facebook page:', error);
        toast({
          title: 'Error adding page',
          description: error instanceof Error ? error.message : 'Unknown error',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box p={4}>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <Box>
          <Card mb={4}>
            <CardHeader>
              <Heading size="md">Facebook Pages</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="2xl" fontWeight="bold">Facebook Pages</Text>
                  <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={onNewPageOpen}>
                    Add Page
                  </Button>
                </HStack>

                {error && (
                  <Alert status="error">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}

                <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
                  {facebookPages.map((page) => (
                    <Card key={page.id} variant="outline">
                      <CardHeader>
                        <HStack justify="space-between">
                          <Text fontWeight="bold">{page.name}</Text>
                          <Badge colorScheme={selectedPage === page.id ? 'blue' : 'gray'}>
                            {selectedPage === page.id ? 'Selected' : 'Select'}
                          </Badge>
                        </HStack>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <Button
                            colorScheme="blue"
                            onClick={() => handlePageSelect(page.id)}
                            isLoading={loadingPosts[page.id]}
                          >
                            {selectedPage === page.id ? 'Selected' : 'Select Page'}
                          </Button>
                          {selectedPage === page.id && (
                            <Button leftIcon={<FaPlus />} onClick={onNewPostOpen}>
                              Create Post
                            </Button>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </Grid>

                {/* New Page Modal */}
                <Modal isOpen={isNewPageOpen} onClose={onNewPageClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Add New Facebook Page</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <VStack spacing={4}>
                        <FormControl>
                          <FormLabel>Page Name</FormLabel>
                          <Input
                            value={newPageName}
                            onChange={(e) => setNewPageName(e.target.value)}
                            placeholder="Enter page name"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Access Token</FormLabel>
                          <Input
                            value={newPageToken}
                            onChange={(e) => setNewPageToken(e.target.value)}
                            placeholder="Enter access token"
                          />
                        </FormControl>
                      </VStack>
                    </ModalBody>
                    <ModalFooter>
                      <Button variant="ghost" mr={3} onClick={onNewPageClose}>
                        Cancel
                      </Button>
                      <Button colorScheme="blue" onClick={handleAddNewPage}>
                        Add Page
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>

                {/* New Post Modal */}
                <Modal isOpen={isNewPostOpen} onClose={onNewPostClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Create New Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <FormControl>
                        <FormLabel>Post Content</FormLabel>
                        <Input
                          as="textarea"
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          placeholder="What's on your mind?"
                          rows={4}
                        />
                      </FormControl>
                    </ModalBody>
                    <ModalFooter>
                      <Button variant="ghost" mr={3} onClick={onNewPostClose}>
                        Cancel
                      </Button>
                      <Button colorScheme="blue" onClick={handleAddPost}>
                        Post
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Posts</Heading>
            </CardHeader>
            <CardBody>
              {/* ... existing posts code ... */}
            </CardBody>
          </Card>
        </Box>

        <Box>
          <DirectMessages pageId={selectedPage || ''} />
        </Box>
      </Grid>
    </Box>
  );
};

export default FacebookPage; 