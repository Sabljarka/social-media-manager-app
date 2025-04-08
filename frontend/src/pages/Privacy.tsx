import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  UnorderedList,
  ListItem,
  useColorModeValue,
} from '@chakra-ui/react';

const Privacy = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Privacy Policy
          </Heading>
          <Text fontSize="xl" color={textColor}>
            Your privacy is important to us. Learn how we collect and use your data.
          </Text>
        </Box>

        <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="md">
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading as="h2" size="lg" mb={4}>
                1. Data Collection
              </Heading>
              <Text color={textColor} mb={4}>
                We collect the following types of data:
              </Text>
              <UnorderedList spacing={2} pl={4} color={textColor}>
                <ListItem>Basic account information (name, email, etc.)</ListItem>
                <ListItem>Platform usage data</ListItem>
                <ListItem>Connected social media accounts information</ListItem>
                <ListItem>Technical information about your device and browser</ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                2. Data Usage
              </Heading>
              <Text color={textColor} mb={4}>
                We use your data for:
              </Text>
              <UnorderedList spacing={2} pl={4} color={textColor}>
                <ListItem>Providing and improving our services</ListItem>
                <ListItem>Personalizing your user experience</ListItem>
                <ListItem>Communicating with you</ListItem>
                <ListItem>Analyzing and enhancing our platform</ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                3. Data Protection
              </Heading>
              <Text color={textColor}>
                We implement state-of-the-art protection measures to ensure the security of your data. 
                This includes data encryption, secure servers, and regular security audits.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                4. Data Sharing
              </Heading>
              <Text color={textColor}>
                We do not share your personal data with third parties without your explicit consent, 
                except when legally required or necessary for providing our services.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                5. Your Rights
              </Heading>
              <Text color={textColor} mb={4}>
                You have the right to:
              </Text>
              <UnorderedList spacing={2} pl={4} color={textColor}>
                <ListItem>Access your data</ListItem>
                <ListItem>Correct inaccurate data</ListItem>
                <ListItem>Request data deletion</ListItem>
                <ListItem>Withdraw consent for data processing</ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                6. Contact
              </Heading>
              <Text color={textColor}>
                For any privacy-related questions, you can contact us at 
                privacy@socialmediamanager.com or through our contact form on our website.
              </Text>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default Privacy; 