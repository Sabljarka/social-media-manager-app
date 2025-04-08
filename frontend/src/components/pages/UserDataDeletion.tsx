import { Box, Container, Heading, Text, VStack, List, ListItem, Button } from '@chakra-ui/react'
import { useState } from 'react'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'

export const UserDataDeletion = () => {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleDataDeletion = async () => {
    setIsLoading(true)
    try {
      await axios.post('/api/user/data-deletion')
      toast({
        title: 'Success',
        description: 'Your data deletion request has been submitted',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit data deletion request',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl">User Data Deletion</Heading>
        
        <Box>
          <Heading as="h2" size="md" mb={4}>1. What Data We Store</Heading>
          <Text mb={4}>
            We store the following user data:
          </Text>
          <List spacing={2} mb={4}>
            <ListItem>• Facebook account information (name, profile picture)</ListItem>
            <ListItem>• Page access tokens for managing your Facebook Pages</ListItem>
            <ListItem>• User preferences and settings</ListItem>
            <ListItem>• Activity logs and usage data</ListItem>
          </List>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb={4}>2. How to Request Data Deletion</Heading>
          <Text mb={4}>
            You can request the deletion of your data in two ways:
          </Text>
          <List spacing={2} mb={4}>
            <ListItem>• Click the "Delete My Data" button below</ListItem>
            <ListItem>• Send an email to support@socialmediamanager.com with your request</ListItem>
          </List>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb={4}>3. What Happens After Deletion</Heading>
          <Text mb={4}>
            When you request data deletion:
          </Text>
          <List spacing={2} mb={4}>
            <ListItem>• All your personal data will be permanently deleted</ListItem>
            <ListItem>• Your account will be deactivated</ListItem>
            <ListItem>• You will receive a confirmation email</ListItem>
            <ListItem>• The process may take up to 30 days to complete</ListItem>
          </List>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb={4}>4. Important Notes</Heading>
          <Text mb={4}>
            Please note:
          </Text>
          <List spacing={2} mb={4}>
            <ListItem>• Data deletion is irreversible</ListItem>
            <ListItem>• Some data may be retained for legal or regulatory purposes</ListItem>
            <ListItem>• You will need to reconnect your Facebook account if you wish to use our service again</ListItem>
          </List>
        </Box>

        <Box textAlign="center" py={4}>
          <Button
            colorScheme="red"
            size="lg"
            onClick={handleDataDeletion}
            isLoading={isLoading}
          >
            Delete My Data
          </Button>
        </Box>
      </VStack>
    </Container>
  )
} 