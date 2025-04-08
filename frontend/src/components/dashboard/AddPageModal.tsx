import { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Select,
  Input,
  useToast,
  Icon,
  useDisclosure
} from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'
import axios from 'axios'

interface AddPageModalProps {
  onSuccess: () => void
}

export const AddPageModal = ({ onSuccess }: AddPageModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [platform, setPlatform] = useState('facebook')
  const [name, setName] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      await axios.post('/api/pages', {
        platform,
        name,
        accessToken
      })
      toast({
        title: 'Uspešno',
        description: 'Stranica je uspešno dodata',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
      onSuccess()
      onClose()
      // Resetuj formu
      setPlatform('facebook')
      setName('')
      setAccessToken('')
    } catch (error) {
      toast({
        title: 'Greška',
        description: 'Došlo je do greške prilikom dodavanja stranice',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        leftIcon={<Icon as={FaPlus} />}
        colorScheme="blue"
        onClick={onOpen}
        mb={4}
      >
        Dodaj stranicu
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Dodaj novu stranicu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Platforma</FormLabel>
                <Select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Naziv stranice</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Unesite naziv stranice"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Access Token</FormLabel>
                <Input
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="Unesite access token"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Otkaži
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isLoading}
            >
              Dodaj
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
} 