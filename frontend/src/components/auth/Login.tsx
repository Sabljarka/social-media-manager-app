import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  Container
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import axios from 'axios'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post('/api/auth/login', { email, password })
      localStorage.setItem('token', response.data.token)
      navigate('/dashboard')
    } catch (error) {
      toast({
        title: 'Greška',
        description: 'Pogrešan email ili lozinka',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading>Prijava</Heading>
          <Text mt={2} color="gray.600">
            Unesite vaše podatke za prijavu
          </Text>
        </Box>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Unesite vaš email"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Lozinka</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Unesite vašu lozinku"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isLoading}
            >
              Prijavi se
            </Button>
          </VStack>
        </Box>

        <Text textAlign="center">
          Nemate nalog?{' '}
          <Link as={RouterLink} to="/register" color="blue.500">
            Registrujte se
          </Link>
        </Text>
      </VStack>
    </Container>
  )
} 