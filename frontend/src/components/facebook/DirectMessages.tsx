import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  Avatar,
  useToast,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';

interface Message {
  id: string;
  message: string;
  created_time: string;
  from: {
    name: string;
    id: string;
  };
  to: {
    name: string;
    id: string;
  };
}

interface DirectMessagesProps {
  pageId: string;
}

const DirectMessages: React.FC<DirectMessagesProps> = ({ pageId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    fetchMessages();
  }, [pageId]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get<{ data: Message[] }>(`/api/facebook/messages`, {
        params: { pageId },
      });
      setMessages(response.data.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch messages',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) return;

    try {
      setLoading(true);
      await axios.post(`/api/facebook/messages`, {
        pageId,
        recipientId: selectedConversation,
        message: newMessage,
      });
      setNewMessage('');
      fetchMessages();
      toast({
        title: 'Success',
        description: 'Message sent successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Direct Messages</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          {messages.map((message) => (
            <Box key={message.id}>
              <HStack spacing={4} align="start">
                <Avatar name={message.from.name} />
                <Box flex={1}>
                  <HStack justify="space-between">
                    <Text fontWeight="bold">{message.from.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {formatDate(message.created_time)}
                    </Text>
                  </HStack>
                  <Text>{message.message}</Text>
                </Box>
              </HStack>
              <Divider my={2} />
            </Box>
          ))}
          {selectedConversation && (
            <HStack>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                colorScheme="blue"
                onClick={handleSendMessage}
                isLoading={loading}
                leftIcon={<FaPaperPlane />}
              >
                Send
              </Button>
            </HStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default DirectMessages; 