import { Box, Container, Link, Text, VStack, HStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export const Footer = () => {
  return (
    <Box as="footer" py={6} bg="gray.50" mt="auto">
      <Container maxW="container.xl">
        <VStack spacing={4}>
          <HStack spacing={8}>
            <Link as={RouterLink} to="/privacy-policy" color="blue.600" _hover={{ textDecoration: 'underline' }}>
              Privacy Policy
            </Link>
            <Link as={RouterLink} to="/disclaimer" color="blue.600" _hover={{ textDecoration: 'underline' }}>
              Disclaimer
            </Link>
            <Link as={RouterLink} to="/user-data-deletion" color="blue.600" _hover={{ textDecoration: 'underline' }}>
              User Data Deletion
            </Link>
          </HStack>
          <Text fontSize="sm" color="gray.600">
            © {new Date().getFullYear()} Social Media Manager. All rights reserved.
          </Text>
        </VStack>
      </Container>
    </Box>
  )
} 