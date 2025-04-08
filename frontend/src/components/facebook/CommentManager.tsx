import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  VStack,
  HStack,
  IconButton,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Badge,
} from '@chakra-ui/react';
import { FaTrash, FaEye, FaEyeSlash, FaReply } from 'react-icons/fa';
import axios from 'axios';

interface Comment {
  id: string;
  message: string;
  created_time: string;
  from: {
    name: string;
    id: string;
  };
  is_hidden: boolean;
}

interface CommentManagerProps {
  postId: string;
  pageId: string;
  onCommentAdded: () => void;
}

const CommentManager: React.FC<CommentManagerProps> = ({
  postId,
  pageId,
  onCommentAdded,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchComments();
  }, [postId, pageId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get<{ data: Comment[] }>(`/api/facebook/posts/${postId}/comments`, {
        params: { pageId },
      });
      setComments(response.data.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch comments',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddComment = async () => {
    try {
      setLoading(true);
      await axios.post(`/api/facebook/posts/${postId}/comments`, {
        pageId,
        message: newComment,
      });
      setNewComment('');
      onClose();
      fetchComments();
      onCommentAdded();
      toast({
        title: 'Success',
        description: 'Comment added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHideComment = async (commentId: string) => {
    try {
      await axios.post(`/api/facebook/comments/${commentId}/hide`, {
        pageId,
      });
      fetchComments();
      onCommentAdded();
      toast({
        title: 'Success',
        description: 'Comment hidden successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to hide comment',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.delete(`/api/facebook/comments/${commentId}`, {
        params: { pageId },
      });
      fetchComments();
      onCommentAdded();
      toast({
        title: 'Success',
        description: 'Comment deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete comment',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box>
      <Button onClick={onOpen} colorScheme="blue" mb={4}>
        Add Comment
      </Button>

      <VStack spacing={4} align="stretch">
        {comments.map((comment) => (
          <Card key={comment.id}>
            <CardHeader>
              <HStack justify="space-between">
                <Box>
                  <Heading size="sm">{comment.from.name}</Heading>
                  <Text fontSize="sm" color="gray.500">
                    {formatDate(comment.created_time)}
                  </Text>
                </Box>
                <Badge colorScheme={comment.is_hidden ? 'red' : 'green'}>
                  {comment.is_hidden ? 'Hidden' : 'Visible'}
                </Badge>
              </HStack>
            </CardHeader>
            <CardBody>
              <Text mb={4}>{comment.message}</Text>
              <HStack spacing={2}>
                <IconButton
                  aria-label="Reply"
                  icon={<FaReply />}
                  size="sm"
                  onClick={() => {
                    setSelectedComment(comment);
                    onOpen();
                  }}
                />
                <IconButton
                  aria-label={comment.is_hidden ? 'Show' : 'Hide'}
                  icon={comment.is_hidden ? <FaEye /> : <FaEyeSlash />}
                  size="sm"
                  onClick={() => handleHideComment(comment.id)}
                />
                <IconButton
                  aria-label="Delete"
                  icon={<FaTrash />}
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDeleteComment(comment.id)}
                />
              </HStack>
            </CardBody>
          </Card>
        ))}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedComment ? 'Reply to Comment' : 'Add Comment'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Comment</FormLabel>
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Enter your comment"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleAddComment}
              isLoading={loading}
            >
              {selectedComment ? 'Reply' : 'Add'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CommentManager; 