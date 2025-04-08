import React from 'react';
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';

const PrivacyPolicy: React.FC = () => {
  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading>Privacy Policy</Heading>
        
        <Box>
          <Heading size="md" mb={4}>Data Collection</Heading>
          <Text>
            We collect and store the following information:
          </Text>
          <Text as="ul" mt={2}>
            <Text as="li">Facebook Page access tokens</Text>
            <Text as="li">Page posts and comments</Text>
            <Text as="li">User preferences and settings</Text>
          </Text>
        </Box>

        <Box>
          <Heading size="md" mb={4}>Data Usage</Heading>
          <Text>
            We use this information to:
          </Text>
          <Text as="ul" mt={2}>
            <Text as="li">Manage your Facebook Page content</Text>
            <Text as="li">Moderate comments and messages</Text>
            <Text as="li">Improve our service</Text>
          </Text>
        </Box>

        <Box>
          <Heading size="md" mb={4}>Data Deletion</Heading>
          <Text>
            You can request deletion of your data by:
          </Text>
          <Text as="ul" mt={2}>
            <Text as="li">Contacting us through the app</Text>
            <Text as="li">Using the Facebook data deletion request form</Text>
          </Text>
        </Box>

        <Box>
          <Heading size="md" mb={4}>Contact Us</Heading>
          <Text>
            For any privacy-related questions or concerns, please contact us at:
            privacy@yourdomain.com
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default PrivacyPolicy; 