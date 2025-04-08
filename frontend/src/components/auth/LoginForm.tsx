import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { login } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import {
  Box,
  Button,
  Input,
  Text,
  Card,
  CardBody,
  Link,
  SimpleGrid,
  Alert,
  VStack,
  Container,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login(username, password);
      dispatch(login({ 
        email: response.user.email, 
        token: response.token 
      }));
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Greška pri prijavi. Pokušajte ponovo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="gray.50"
      _dark={{ bg: 'gray.800' }}
    >
      <Container maxW="container.sm">
        <VStack spacing={8}>
          <Text
            fontSize="4xl"
            fontWeight="bold"
            textAlign="center"
            fontFamily="Poppins, sans-serif"
          >
            Social Media Manager
          </Text>
          <Card p={8} w="full" maxW="400px">
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  {error && (
                    <Alert status="error">
                      <WarningIcon />
                      {error}
                    </Alert>
                  )}
                  <FormControl>
                    <FormLabel>Korisničko ime</FormLabel>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      isDisabled={isLoading}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Lozinka</FormLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      isDisabled={isLoading}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    w="full"
                    size="lg"
                    mt={2}
                    isLoading={isLoading}
                    loadingText="Prijava u toku..."
                  >
                    Prijava
                  </Button>
                  <SimpleGrid columns={2} spacing={4} w="full" justifyItems="center">
                    <Link as={RouterLink} to="/privacy-policy" color="blue.500">
                      Politika privatnosti
                    </Link>
                    <Link as={RouterLink} to="/terms-of-service" color="blue.500">
                      Uslovi korišćenja
                    </Link>
                  </SimpleGrid>
                </VStack>
              </form>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default LoginForm; 