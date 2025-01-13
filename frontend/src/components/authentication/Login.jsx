import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { BiSolidHide } from 'react-icons/bi';
import { BiSolidShow } from 'react-icons/bi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);

    if (!email || !password) {
      toast({
        title: 'Please fill all the required fields!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/user/login',
        { email, password },
        config
      );

      toast({
        title: 'Login successful!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate('/chats');
    } catch (error) {
      toast({
        title: 'Error occurred!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing={'5px'}>
      <FormControl isRequired id="email">
        <FormLabel fontSize={'sm'}>Email id</FormLabel>
        <Input
          placeholder="Enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          _placeholder={{ color: 'orange.200' }}
          fontSize={'sm'}
          h={'30px'}
        />
      </FormControl>

      <FormControl isRequired id="password">
        <FormLabel fontSize={'sm'}>Password</FormLabel>
        <InputGroup display={'flex'} justifyContent={'center'}>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            _placeholder={{ color: 'orange.200' }}
            fontSize={'sm'}
            h={'30px'}
          />
          <InputRightElement m={'-5px'}>
            <Button
              bg="rgba(255, 255, 255, 0)"
              h={'1.5rem'}
              size={'sm'}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <BiSolidShow /> : <BiSolidHide />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="orange"
        w={'100%'}
        style={{ marginTop: 20 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
    </VStack>
  );
};
export default Login;
