import { Box, Container, Heading, Text, VStack, List, ListItem } from '@chakra-ui/react'

export const PrivacyPolicy = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl">Privacy Policy</Heading>
        
        <Box>
          <Heading as="h2" size="md" mb={4}>1. Information We Collect</Heading>
          <Text mb={4}>
            Our application collects the following information from Facebook:
          </Text>
          <List spacing={2} mb={4}>
            <ListItem>• Public profile information (name, profile picture)</ListItem>
            <ListItem>• Page access tokens for managing your Facebook Pages</ListItem>
            <ListItem>• Basic account information necessary for authentication</ListItem>
          </List>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb={4}>2. How We Use Your Information</Heading>
          <Text mb={4}>
            We use the collected information to:
          </Text>
          <List spacing={2} mb={4}>
            <ListItem>• Authenticate your account</ListItem>
            <ListItem>• Manage your Facebook Pages</ListItem>
            <ListItem>• Provide social media management services</ListItem>
            <ListItem>• Improve our application's functionality</ListItem>
          </List>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb={4}>3. Data Storage and Security</Heading>
          <Text mb={4}>
            We implement appropriate security measures to protect your information:
          </Text>
          <List spacing={2} mb={4}>
            <ListItem>• All data is encrypted in transit and at rest</ListItem>
            <ListItem>• Access tokens are securely stored</ListItem>
            <ListItem>• Regular security audits are performed</ListItem>
          </List>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb={4}>4. Data Sharing</Heading>
          <Text mb={4}>
            We do not share your personal information with third parties except:
          </Text>
          <List spacing={2} mb={4}>
            <ListItem>• When required by law</ListItem>
            <ListItem>• With your explicit consent</ListItem>
            <ListItem>• To provide the services you requested</ListItem>
          </List>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb={4}>5. Your Rights</Heading>
          <Text mb={4}>
            You have the right to:
          </Text>
          <List spacing={2} mb={4}>
            <ListItem>• Access your personal data</ListItem>
            <ListItem>• Request deletion of your data</ListItem>
            <ListItem>• Opt-out of data collection</ListItem>
            <ListItem>• Request a copy of your data</ListItem>
          </List>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb={4}>6. Contact Us</Heading>
          <Text mb={4}>
            If you have any questions about this Privacy Policy, please contact us at:
          </Text>
          <Text>Email: support@socialmediamanager.com</Text>
        </Box>
      </VStack>
    </Container>
  )
} 