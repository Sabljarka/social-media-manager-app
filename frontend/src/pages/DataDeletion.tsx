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
  Button,
  Alert,
  AlertIcon,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';

const DataDeletion = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setEmail('');
      toast({
        title: 'Data deletion request submitted',
        description: 'We have received your request and will process it soon.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }, 1500);
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Request Data Deletion
          </Heading>
          <Text fontSize="xl" color={textColor}>
            Use this form to request deletion of your personal data from our systems
          </Text>
        </Box>

        <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="md">
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading as="h2" size="lg" mb={4}>
                Data Deletion Request
              </Heading>
              <Text color={textColor} mb={6}>
                In accordance with privacy regulations, you have the right to request the deletion of your personal data 
                from our systems. Please fill out the form below, and we will process your request within 30 days.
              </Text>
            </Box>

            {showSuccess ? (
              <Alert
                status="success"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="200px"
                borderRadius="md"
              >
                <AlertIcon boxSize="40px" mr={0} />
                <Heading as="h3" size="md" mt={6} mb={2}>
                  Request Submitted!
                </Heading>
                <Text color={textColor}>
                  We've received your data deletion request. We'll process your request and send
                  a confirmation email once completed. This process may take up to 30 days.
                </Text>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Your Email Address</FormLabel>
                    <Input 
                      type="email" 
                      placeholder="Enter the email associated with your account" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>

                  <Text fontSize="sm" color={textColor} mt={2}>
                    By submitting this request, you acknowledge that all your data will be permanently deleted 
                    and this action cannot be undone.
                  </Text>

                  <Button
                    type="submit"
                    colorScheme="red"
                    size="lg"
                    width="full"
                    isLoading={isSubmitting}
                    mt={4}
                  >
                    Request Data Deletion
                  </Button>
                </VStack>
              </form>
            )}
          </VStack>
        </Box>

        <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="md">
          <Heading as="h2" size="lg" mb={4}>
            What Data Will Be Deleted
          </Heading>
          <Text color={textColor} mb={4}>
            When you request data deletion, we will remove:
          </Text>
          <VStack align="stretch" spacing={3} pl={4}>
            <Text color={textColor}>• Your account information (name, email, profile data)</Text>
            <Text color={textColor}>• Your connected social media accounts information</Text>
            <Text color={textColor}>• Usage history and analytics data</Text>
            <Text color={textColor}>• Any content you've created or uploaded to our platform</Text>
          </VStack>
          <Text color={textColor} mt={4}>
            Please note that some information may be retained for legal, regulatory, or technical reasons, 
            even after you've requested deletion.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default DataDeletion; 