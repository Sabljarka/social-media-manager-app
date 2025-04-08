import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email',
      content: 'contact@socialmediamanager.com',
    },
    {
      icon: FaPhone,
      title: 'Phone',
      content: '+1 (555) 123-4567',
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Address',
      content: '123 Social Media Street, New York, NY',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Message Sent',
        description: 'Thank you for your message. We will respond as soon as possible.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }, 1500);
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={10} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Contact Us
          </Heading>
          <Text fontSize="xl" color={textColor}>
            Have a question? We're here to help.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mb={10}>
          {contactInfo.map((info, index) => (
            <Box
              key={index}
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              textAlign="center"
            >
              <Icon as={info.icon} w={8} h={8} color="blue.500" mb={4} />
              <Heading as="h3" size="md" mb={2}>
                {info.title}
              </Heading>
              <Text color={textColor}>{info.content}</Text>
            </Box>
          ))}
        </SimpleGrid>

        <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="md">
          <Heading as="h2" size="lg" mb={6} textAlign="center">
            Send Us a Message
          </Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input type="text" placeholder="Enter your full name" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input type="email" placeholder="Enter your email address" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Subject</FormLabel>
                <Input type="text" placeholder="Enter message subject" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Message</FormLabel>
                <Textarea placeholder="Enter your message" rows={5} />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="full"
                isLoading={isSubmitting}
              >
                Send Message
              </Button>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Container>
  );
};

export default Contact; 