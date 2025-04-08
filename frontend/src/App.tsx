import { ChakraProvider, Box } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom'
import { Dashboard } from './components/dashboard/Dashboard'
import { Footer } from './components/layout/Footer'
import { PrivacyPolicy } from './components/pages/PrivacyPolicy'
import { Disclaimer } from './components/pages/Disclaimer'
import { UserDataDeletion } from './components/pages/UserDataDeletion'

// Test automatskog deploymenta
function App() {
  return (
    <ChakraProvider>
      <Box minH="100vh" display="flex" flexDirection="column">
        <Box flex="1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/user-data-deletion" element={<UserDataDeletion />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </ChakraProvider>
  )
}

export default App
