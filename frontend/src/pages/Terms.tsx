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

const Terms = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Terms of Service
          </Heading>
          <Text fontSize="xl" color={textColor}>
            Please read these terms of service carefully before using our platform
          </Text>
        </Box>

        <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="md">
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading as="h2" size="lg" mb={4}>
                1. Acceptance of Terms
              </Heading>
              <Text color={textColor}>
                By using our platform, you fully accept these terms of service. If you disagree with any part of these terms, 
                please do not use our platform.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                2. Services
              </Heading>
              <Text color={textColor} mb={4}>
                Our platform provides the following services:
              </Text>
              <UnorderedList spacing={2} pl={4} color={textColor}>
                <ListItem>Social media account management</ListItem>
                <ListItem>Analytics and performance tracking</ListItem>
                <ListItem>Automated posting</ListItem>
                <ListItem>Comment and message management</ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                3. User Account
              </Heading>
              <Text color={textColor}>
                To use our platform, you need to create a user account. You are responsible for maintaining the 
                confidentiality of your login information and for all activities that occur under your account.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                4. Usage Restrictions
              </Heading>
              <Text color={textColor} mb={4}>
                The following is not permitted:
              </Text>
              <UnorderedList spacing={2} pl={4} color={textColor}>
                <ListItem>Intellectual property rights infringement</ListItem>
                <ListItem>Distribution of malicious software</ListItem>
                <ListItem>Platform abuse</ListItem>
                <ListItem>Sharing false or misleading content</ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                5. Privacy
              </Heading>
              <Text color={textColor}>
                Your privacy is important to us. Please read our Privacy Policy to understand how we 
                collect, use, and protect your data.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                6. Modifications to Terms
              </Heading>
              <Text color={textColor}>
                We reserve the right to modify these terms at any time. Continued use of the platform after 
                modifications represents your acceptance of the new terms.
              </Text>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default Terms; 