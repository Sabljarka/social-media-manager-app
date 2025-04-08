import { useState, useEffect } from 'react'
import {
  VStack,
  Box,
  Text,
  Button,
  HStack,
  Icon,
  useToast,
  Spinner
} from '@chakra-ui/react'
import { FaTrash, FaEdit, FaComment } from 'react-icons/fa'
import axios from 'axios'

interface PostListProps {
  pageId: string
  platform: string
}

interface Post {
  id: string
  message: string
  createdTime: string
  likes: number
  comments: number
}

export const PostList = ({ pageId, platform }: PostListProps) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const loadPosts = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/api/${platform}/pages/${pageId}/posts`)
      setPosts(response.data)
    } catch (error) {
      toast({
        title: 'Greška',
        description: 'Došlo je do greške prilikom učitavanja postova',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deletePost = async (postId: string) => {
    try {
      await axios.delete(`/api/${platform}/pages/${pageId}/posts/${postId}`)
      setPosts(posts.filter(post => post.id !== postId))
      toast({
        title: 'Uspešno',
        description: 'Post je uspešno obrisan',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Greška',
        description: 'Došlo je do greške prilikom brisanja posta',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  useEffect(() => {
    if (pageId) {
      loadPosts()
    }
  }, [pageId, platform])

  return (
    <VStack align="stretch" spacing={4}>
      <Button
        colorScheme="blue"
        onClick={loadPosts}
        isLoading={isLoading}
        loadingText="Učitavanje..."
      >
        Učitaj postove
      </Button>

      {isLoading ? (
        <Spinner />
      ) : (
        posts.map((post) => (
          <Box
            key={post.id}
            p={4}
            borderWidth={1}
            borderRadius="md"
          >
            <Text mb={2}>{post.message}</Text>
            <Text fontSize="sm" color="gray.500" mb={2}>
              {new Date(post.createdTime).toLocaleString()}
            </Text>
            <HStack spacing={4}>
              <Text fontSize="sm">Lajkova: {post.likes}</Text>
              <Text fontSize="sm">Komentara: {post.comments}</Text>
              <HStack ml="auto">
                <Button
                  size="sm"
                  leftIcon={<Icon as={FaComment} />}
                  variant="ghost"
                >
                  Komentari
                </Button>
                <Button
                  size="sm"
                  leftIcon={<Icon as={FaEdit} />}
                  variant="ghost"
                >
                  Izmeni
                </Button>
                <Button
                  size="sm"
                  leftIcon={<Icon as={FaTrash} />}
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => deletePost(post.id)}
                >
                  Obriši
                </Button>
              </HStack>
            </HStack>
          </Box>
        ))
      )}

      {!isLoading && posts.length === 0 && (
        <Text textAlign="center" color="gray.500">
          Nema postova za prikaz
        </Text>
      )}
    </VStack>
  )
} 