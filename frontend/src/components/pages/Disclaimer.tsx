import { Box, Container, Heading, Text, VStack, List, ListItem } from '@chakra-ui/react'

export const Disclaimer = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl">Disclaimer</Heading>
        
        <Box>
          <Heading as="h2" size="md" mb={4}>1. General Information</Heading>
          <Text mb={4}>
            This application is not affiliated with, maintained, authorized, endorsed, or sponsored by Facebook, Inc. or any of its affiliates. All product and company names are trademarks™ or registered® trademarks of their respective holders.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb={4}>2. Service Limitations</Heading>
          <Text mb={4}>
            While we strive to provide accurate and reliable service, we cannot guarantee:
          </Text>
          <List spacing={2} mb={4}>
            <ListItem>• Uninterrupted or error-free service</ListItem>
            <ListItem>• Complete accuracy of all data</ListItem>
            <ListItem>• Availability of all Facebook features</ListItem>
          </List>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb={4}>3. Third-Party Services</Heading>
          <Text mb={4}>
            Our application integrates with Facebook's services. We are not responsible for:
          </Text>
          <List spacing={2} mb={4}>
            <ListItem>• Facebook's service availability or changes</ListItem>
            <ListItem>• Facebook's terms of service compliance</ListItem>
            <ListItem>• Any issues arising from Facebook's API changes</ListItem>
          </List>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb={4}>4. User Responsibility</Heading>
          <Text mb={4}>
            Users are responsible for:
          </Text>
          <List spacing={2} mb={4}>
            <ListItem>• Maintaining the security of their account credentials</ListItem>
            <ListItem>• Complying with Facebook's terms of service</ListItem>
            <ListItem>• Any content they post through our application</ListItem>
          </List>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb={4}>5. Limitation of Liability</Heading>
          <Text mb={4}>
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb={4}>6. Changes to Disclaimer</Heading>
          <Text mb={4}>
            We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon posting to the application.
          </Text>
        </Box>
      </VStack>
    </Container>
  )
} 