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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge
} from '@chakra-ui/react'
import { FaTrash } from 'react-icons/fa'
import axios from 'axios'
import { AddPageModal } from './AddPageModal'

interface Page {
  id: string
  name: string
  platform: string
  accessToken: string
  createdAt: string
}

interface PageListProps {
  platform: string
  selectedPage: string | null
  onSelectPage: (pageId: string) => void
}

export const PageList = ({ platform, selectedPage, onSelectPage }: PageListProps) => {
  const [pages, setPages] = useState<Page[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const loadPages = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('/api/pages')
      setPages(response.data)
    } catch (error) {
      // Ne prikazujemo grešku ako je 404 (nema stranica)
      if (axios.isAxiosError(error) && error.response?.status !== 404) {
        toast({
          title: 'Greška',
          description: 'Došlo je do greške prilikom učitavanja stranica',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
      setPages([])
    } finally {
      setIsLoading(false)
    }
  }

  const deletePage = async (pageId: string) => {
    try {
      await axios.delete(`/api/pages/${pageId}`)
      setPages(pages.filter(page => page.id !== pageId))
      if (selectedPage === pageId) {
        onSelectPage('')
      }
      toast({
        title: 'Uspešno',
        description: 'Stranica je uspešno obrisana',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Greška',
        description: 'Došlo je do greške prilikom brisanja stranice',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  useEffect(() => {
    loadPages()
  }, [])

  const facebookPages = pages.filter(page => page.platform === 'facebook')
  const instagramPages = pages.filter(page => page.platform === 'instagram')

  const renderPageCard = (page: Page) => (
    <Box
      key={page.id}
      p={4}
      borderWidth={1}
      borderRadius="md"
      mb={2}
      cursor="pointer"
      onClick={() => onSelectPage(page.id)}
      bg={selectedPage === page.id ? 'blue.50' : 'white'}
      _hover={{ bg: 'gray.50' }}
    >
      <HStack justify="space-between">
        <VStack align="start" spacing={1}>
          <Text fontWeight="bold">{page.name}</Text>
          <HStack>
            <Badge colorScheme={page.platform === 'facebook' ? 'blue' : 'pink'}>
              {page.platform}
            </Badge>
            <Text fontSize="sm" color="gray.500">
              Dodato: {new Date(page.createdAt).toLocaleDateString()}
            </Text>
          </HStack>
        </VStack>
        <Button
          size="sm"
          leftIcon={<Icon as={FaTrash} />}
          variant="ghost"
          colorScheme="red"
          onClick={(e) => {
            e.stopPropagation()
            deletePage(page.id)
          }}
        >
          Obriši
        </Button>
      </HStack>
    </Box>
  )

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Stranice</Text>

      <AddPageModal onSuccess={loadPages} />

      <Tabs variant="enclosed">
        <TabList>
          <Tab>Facebook</Tab>
          <Tab>Instagram</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {isLoading ? (
              <Spinner />
            ) : (
              <VStack align="stretch">
                {facebookPages.map(renderPageCard)}
                {!isLoading && facebookPages.length === 0 && (
                  <Text textAlign="center" color="gray.500" py={4}>
                    Nema Facebook stranica. Kliknite na "Dodaj stranicu" da dodate novu.
                  </Text>
                )}
              </VStack>
            )}
          </TabPanel>
          <TabPanel>
            {isLoading ? (
              <Spinner />
            ) : (
              <VStack align="stretch">
                {instagramPages.map(renderPageCard)}
                {!isLoading && instagramPages.length === 0 && (
                  <Text textAlign="center" color="gray.500" py={4}>
                    Nema Instagram stranica. Kliknite na "Dodaj stranicu" da dodate novu.
                  </Text>
                )}
              </VStack>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
} 