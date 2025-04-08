import { useState, useEffect } from 'react'
import {
  VStack,
  Box,
  Text,
  Button,
  HStack,
  Icon,
  useToast,
  Spinner,
  Textarea
} from '@chakra-ui/react'
import { FaTrash, FaReply, FaEye, FaEyeSlash } from 'react-icons/fa'
import axios from 'axios'

interface CommentListProps {
  pageId: string
  platform: string
}

interface Comment {
  id: string
  message: string
  author: string
  createdTime: string
  isHidden: boolean
  replies: Comment[]
}

export const CommentList = ({ pageId, platform }: CommentListProps) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const toast = useToast()

  const loadComments = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/api/${platform}/pages/${pageId}/comments`)
      setComments(response.data)
    } catch (error) {
      toast({
        title: 'Greška',
        description: 'Došlo je do greške prilikom učitavanja komentara',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteComment = async (commentId: string) => {
    try {
      await axios.delete(`/api/${platform}/pages/${pageId}/comments/${commentId}`)
      setComments(comments.filter(comment => comment.id !== commentId))
      toast({
        title: 'Uspešno',
        description: 'Komentar je uspešno obrisan',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Greška',
        description: 'Došlo je do greške prilikom brisanja komentara',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  const toggleHideComment = async (commentId: string) => {
    try {
      await axios.patch(`/api/${platform}/pages/${pageId}/comments/${commentId}/toggle-hide`)
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, isHidden: !comment.isHidden }
          : comment
      ))
      toast({
        title: 'Uspešno',
        description: 'Status komentara je uspešno promenjen',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Greška',
        description: 'Došlo je do greške prilikom promene statusa komentara',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  const submitReply = async (commentId: string) => {
    try {
      await axios.post(`/api/${platform}/pages/${pageId}/comments/${commentId}/replies`, {
        message: replyText
      })
      setReplyTo(null)
      setReplyText('')
      await loadComments() // Ponovo učitaj komentare da bi se videli novi odgovori
      toast({
        title: 'Uspešno',
        description: 'Odgovor je uspešno poslat',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Greška',
        description: 'Došlo je do greške prilikom slanja odgovora',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  useEffect(() => {
    if (pageId) {
      loadComments()
    }
  }, [pageId, platform])

  const renderComment = (comment: Comment) => (
    <Box
      key={comment.id}
      p={4}
      borderWidth={1}
      borderRadius="md"
      bg={comment.isHidden ? 'gray.100' : 'white'}
    >
      <Text fontWeight="bold">{comment.author}</Text>
      <Text mb={2}>{comment.message}</Text>
      <Text fontSize="sm" color="gray.500" mb={2}>
        {new Date(comment.createdTime).toLocaleString()}
      </Text>
      <HStack spacing={2}>
        <Button
          size="sm"
          leftIcon={<Icon as={FaReply} />}
          variant="ghost"
          onClick={() => setReplyTo(comment.id)}
        >
          Odgovori
        </Button>
        <Button
          size="sm"
          leftIcon={<Icon as={comment.isHidden ? FaEye : FaEyeSlash} />}
          variant="ghost"
          onClick={() => toggleHideComment(comment.id)}
        >
          {comment.isHidden ? 'Prikaži' : 'Sakrij'}
        </Button>
        <Button
          size="sm"
          leftIcon={<Icon as={FaTrash} />}
          variant="ghost"
          colorScheme="red"
          onClick={() => deleteComment(comment.id)}
        >
          Obriši
        </Button>
      </HStack>

      {replyTo === comment.id && (
        <Box mt={4}>
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Unesite vaš odgovor..."
            mb={2}
          />
          <HStack>
            <Button
              size="sm"
              colorScheme="blue"
              onClick={() => submitReply(comment.id)}
            >
              Pošalji
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setReplyTo(null)
                setReplyText('')
              }}
            >
              Otkaži
            </Button>
          </HStack>
        </Box>
      )}

      {comment.replies.length > 0 && (
        <Box pl={8} mt={4}>
          {comment.replies.map(reply => renderComment(reply))}
        </Box>
      )}
    </Box>
  )

  return (
    <VStack align="stretch" spacing={4}>
      <Button
        colorScheme="blue"
        onClick={loadComments}
        isLoading={isLoading}
        loadingText="Učitavanje..."
      >
        Učitaj komentare
      </Button>

      {isLoading ? (
        <Spinner />
      ) : (
        comments.map(renderComment)
      )}

      {!isLoading && comments.length === 0 && (
        <Text textAlign="center" color="gray.500">
          Nema komentara za prikaz
        </Text>
      )}
    </VStack>
  )
} 