import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Image,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaUsers, FaLightbulb, FaHeart } from 'react-icons/fa';

const About = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const features = [
    {
      icon: FaUsers,
      title: 'Teamwork',
      description: 'We collaborate with our clients to achieve the best results.',
    },
    {
      icon: FaLightbulb,
      title: 'Innovation',
      description: 'We constantly improve our platform with the latest technologies.',
    },
    {
      icon: FaHeart,
      title: 'Dedication',
      description: 'We are dedicated to the success of your social media presence.',
    },
  ];

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={10} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            About Us
          </Heading>
          <Text fontSize="xl" color={textColor}>
            We are a team of experts dedicated to enhancing your presence on social media
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {features.map((feature, index) => (
            <Box
              key={index}
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              textAlign="center"
            >
              <Icon as={feature.icon} w={10} h={10} color="blue.500" mb={4} />
              <Heading as="h3" size="md" mb={2}>
                {feature.title}
              </Heading>
              <Text color={textColor}>{feature.description}</Text>
            </Box>
          ))}
        </SimpleGrid>

        <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="md">
          <Heading as="h2" size="xl" mb={6} textAlign="center">
            Our Mission
          </Heading>
          <Text fontSize="lg" color={textColor} lineHeight="tall">
            Our mission is to help businesses and individuals maximize the potential of social media. 
            Through our platform, we provide simple yet powerful solutions for social media management, 
            analytics, and follower engagement. We believe that everyone deserves 
            access to tools that will help them grow and thrive in the digital world.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default About; 