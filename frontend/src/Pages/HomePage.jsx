import { Box, Container, Text } from '@chakra-ui/react';
import TabSwitch from '../components/TabSwitch.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));

    if (user) {
      navigate('/chats');
    }
  }, [navigate]);
  return (
    <Container maxW="lg" centerContent>
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        p={3}
        bg={'white'}
        w={'100%'}
        m={'20px 0 5px 0'}
        borderRadius={'lg'}
      >
        <Text
          fontSize={'2xl'}
          fontFamily={'Work sans'}
          color={'black'}
          marginRight={'5px'}
          fontWeight={'bold'}
        >
          Senpai-Connect
        </Text>
        <img src="./src/assets/logo3.png" alt="logo" width={40} height={40} />
      </Box>

      <Box
        bg="rgba(254,235,200,0.5)"
        w={'100%'}
        p={'2 0 0 0'}
        borderRadius={'lg'}
        borderWidth={'1px'}
      >
        <TabSwitch />
      </Box>
    </Container>
  );
};
export default HomePage;
