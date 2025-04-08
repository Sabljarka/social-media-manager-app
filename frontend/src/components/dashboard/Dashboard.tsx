import { useState } from 'react'
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Icon,
  Button,
  Divider
} from '@chakra-ui/react'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import { PageList } from './PageList'
import { PostList } from './PostList'
import { CommentList } from './CommentList'
import { MessageList } from './MessageList'

export const Dashboard = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('facebook')
  const [selectedPage, setSelectedPage] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<'posts' | 'comments' | 'messages'>('posts')

  const platforms = [
    { name: 'Facebook', icon: FaFacebook, value: 'facebook' },
    { name: 'Instagram', icon: FaInstagram, value: 'instagram' }
  ]

  return (
    <Flex h="100vh">
      {/* Levi meni */}
      <Box w="250px" bg="gray.800" color="white" p={4}>
        <VStack align="stretch" spacing={4}>
          <Text fontSize="xl" fontWeight="bold">Platforme</Text>
          {platforms.map((platform) => (
            <Button
              key={platform.value}
              leftIcon={<Icon as={platform.icon} />}
              variant={selectedPlatform === platform.value ? 'solid' : 'ghost'}
              colorScheme="blue"
              justifyContent="flex-start"
              onClick={() => setSelectedPlatform(platform.value)}
            >
              {platform.name}
            </Button>
          ))}
          
          <Divider />
          
          <Text fontSize="xl" fontWeight="bold">Stranice</Text>
          
          <PageList
            platform={selectedPlatform}
            onSelectPage={setSelectedPage}
            selectedPage={selectedPage}
          />
        </VStack>
      </Box>

      {/* Glavni sadržaj */}
      <Box flex={1} p={6}>
        {selectedPage ? (
          <VStack align="stretch" spacing={6}>
            <HStack spacing={4}>
              <Button
                variant={selectedTab === 'posts' ? 'solid' : 'ghost'}
                onClick={() => setSelectedTab('posts')}
              >
                Objave
              </Button>
              <Button
                variant={selectedTab === 'comments' ? 'solid' : 'ghost'}
                onClick={() => setSelectedTab('comments')}
              >
                Komentari
              </Button>
              <Button
                variant={selectedTab === 'messages' ? 'solid' : 'ghost'}
                onClick={() => setSelectedTab('messages')}
              >
                Poruke
              </Button>
            </HStack>

            {selectedTab === 'posts' && (
              <PostList pageId={selectedPage} platform={selectedPlatform} />
            )}
            
            {selectedTab === 'comments' && (
              <CommentList pageId={selectedPage} platform={selectedPlatform} />
            )}
            
            {selectedTab === 'messages' && (
              <MessageList pageId={selectedPage} platform={selectedPlatform} />
            )}
          </VStack>
        ) : (
          <Text>Izaberite stranicu za prikaz sadržaja</Text>
        )}
      </Box>
    </Flex>
  )
}

export default Dashboard 