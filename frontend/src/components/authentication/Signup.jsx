/* eslint-disable no-unused-vars */
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

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Please fill all the required fields!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const data = await axios.post(
        '/api/user',
        {
          name,
          email,
          password,
          pic,
        },
        config
      );

      toast({
        title: 'Registration successful!',
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

  const postPic = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: 'Please upload an image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    if (pics.type !== 'image/jpeg' && pics.type !== 'image/png') {
      toast({
        title: 'Please Select a JPEG or PNG Image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'senpai-connect');
      data.append('cloud_name', 'notank');
      axios
        .post('https://api.cloudinary.com/v1_1/notank/image/upload', data)
        .then((response) => {
          console.log('Cloudinary response:', response);
          setPic(response.data.url.toString());
          setLoading(false);
          toast({
            title: 'Image uploaded successfully!',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'bottom',
          });
        })
        .catch((error) => {
          console.log('Cloudinary error:', error);
          setLoading(false);
        });
    }
  };

  return (
    <VStack spacing={'5px'}>
      <FormControl isRequired id="name">
        <FormLabel fontSize={'sm'}>Name</FormLabel>
        <Input
          placeholder="Enter your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          _placeholder={{ color: 'orange.200' }}
          fontSize={'sm'}
          h={'30px'}
        />
      </FormControl>

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
        <InputGroup>
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
              h={'1.75rem'}
              size={'sm'}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <BiSolidShow /> : <BiSolidHide />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl isRequired id="confirm-password">
        <FormLabel fontSize={'sm'}>Confirm password</FormLabel>
        <Input
          type={'text'}
          placeholder="Confirm your password..."
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          _placeholder={{ color: 'orange.200' }}
          fontSize={'sm'}
          h={'30px'}
        />
      </FormControl>

      <FormControl>
        <FormLabel fontSize={'sm'}>Upload your picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postPic(e.target.files[0])}
          fontSize={'sm'}
          h={'40px'}
        ></Input>
      </FormControl>

      <Button
        colorScheme="orange"
        w={'100%'}
        marginTop={'15px'}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};
export default Signup;
