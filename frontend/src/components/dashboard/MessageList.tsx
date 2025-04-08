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
import { FaTrash, FaReply, FaCheck } from 'react-icons/fa'
import axios from 'axios'

interface MessageListProps {
  pageId: string
  platform: string
}

interface Message {
  id: string
  sender: string
  message: string
  createdTime: string
  isRead: boolean
}

export const MessageList = ({ pageId, platform }: MessageListProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const toast = useToast()

  const loadMessages = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/api/${platform}/pages/${pageId}/messages`)
      setMessages(response.data)
    } catch (error) {
      toast({
        title: 'Greška',
        description: 'Došlo je do greške prilikom učitavanja poruka',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteMessage = async (messageId: string) => {
    try {
      await axios.delete(`/api/${platform}/pages/${pageId}/messages/${messageId}`)
      setMessages(messages.filter(message => message.id !== messageId))
      toast({
        title: 'Uspešno',
        description: 'Poruka je uspešno obrisana',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Greška',
        description: 'Došlo je do greške prilikom brisanja poruke',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      await axios.patch(`/api/${platform}/pages/${pageId}/messages/${messageId}/read`)
      setMessages(messages.map(message => 
        message.id === messageId 
          ? { ...message, isRead: true }
          : message
      ))
      toast({
        title: 'Uspešno',
        description: 'Poruka je označena kao pročitana',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Greška',
        description: 'Došlo je do greške prilikom označavanja poruke',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  const submitReply = async (messageId: string) => {
    try {
      await axios.post(`/api/${platform}/pages/${pageId}/messages/${messageId}/reply`, {
        message: replyText
      })
      setReplyTo(null)
      setReplyText('')
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
      loadMessages()
    }
  }, [pageId, platform])

  return (
    <VStack align="stretch" spacing={4}>
      <Button
        colorScheme="blue"
        onClick={loadMessages}
        isLoading={isLoading}
        loadingText="Učitavanje..."
      >
        Učitaj poruke
      </Button>

      {isLoading ? (
        <Spinner />
      ) : (
        messages.map((message) => (
          <Box
            key={message.id}
            p={4}
            borderWidth={1}
            borderRadius="md"
            bg={message.isRead ? 'white' : 'blue.50'}
          >
            <Text fontWeight="bold">{message.sender}</Text>
            <Text mb={2}>{message.message}</Text>
            <Text fontSize="sm" color="gray.500" mb={2}>
              {new Date(message.createdTime).toLocaleString()}
            </Text>
            <HStack spacing={2}>
              <Button
                size="sm"
                leftIcon={<Icon as={FaReply} />}
                variant="ghost"
                onClick={() => setReplyTo(message.id)}
              >
                Odgovori
              </Button>
              {!message.isRead && (
                <Button
                  size="sm"
                  leftIcon={<Icon as={FaCheck} />}
                  variant="ghost"
                  onClick={() => markAsRead(message.id)}
                >
                  Označi kao pročitano
                </Button>
              )}
              <Button
                size="sm"
                leftIcon={<Icon as={FaTrash} />}
                variant="ghost"
                colorScheme="red"
                onClick={() => deleteMessage(message.id)}
              >
                Obriši
              </Button>
            </HStack>

            {replyTo === message.id && (
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
                    onClick={() => submitReply(message.id)}
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
          </Box>
        ))
      )}

      {!isLoading && messages.length === 0 && (
        <Text textAlign="center" color="gray.500">
          Nema poruka za prikaz
        </Text>
      )}
    </VStack>
  )
} 