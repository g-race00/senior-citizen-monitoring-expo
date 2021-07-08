// import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

// Initialise Firebase
import * as firebase from 'firebase';
const config = require('./config.js');

!firebase.apps.length ? firebase.initializeApp(config) : firebase.app()

// Setup Login 
import {
  StatusBar,
  Center,
  NativeBaseProvider,
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  Icon,
  IconButton,
  HStack,
  Divider
} from 'native-base';
import { render } from 'react-dom';

export default class App extends React.Component {

  constructor(props){
    super(props)

    this.state = ({
      email: '',
      password: ''
    })
  }

  loginUser = (email, password) => {

  }
  
  render() {
    return (
      <NativeBaseProvider>
        <Center>
          <StatusBar backgroundColor='white' barStyle='dark-content'/>
        </Center>
        <Box
          flex={1}
          p={2}
          w="90%"
          mx='auto'
        >
          <Heading size="lg" color='primary.500'>
            Welcome
          </Heading>
          <Heading color="muted.400" size="xs">
            Sign up to continue!
          </Heading>

          <VStack space={2} mt={5}>
            <FormControl>
              <FormControl.Label _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Email
              </FormControl.Label>
              <Input />
            </FormControl>
            <FormControl>
              <FormControl.Label  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Password
              </FormControl.Label>
              <Input type="password" />
            </FormControl>
            <FormControl>
              <FormControl.Label  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                Confirm Password
              </FormControl.Label>
              <Input type="password" />
            </FormControl>
            <VStack  space={2}  mt={5}>
            <Button colorScheme="cyan" _text={{color: 'white' }}>
                SignUp
            </Button>

  <HStack justifyContent="center" alignItem='center' >
            <IconButton
              variant='unstyled'
              startIcon={
                <Icon
                  as={< MaterialCommunityIcons name="facebook" />}
                  color='muted.700'
                  size='sm'
                />
              }
            />
            <IconButton
              variant='unstyled'
              startIcon={
                <Icon
                  as={< MaterialCommunityIcons name="google" />}
                  color='muted.700'
                  size="sm"
                />
              }
            />
            <IconButton
              variant='unstyled'
              startIcon={
                <Icon
                  as={< MaterialCommunityIcons name="github" />}
                  color='muted.700'
                  size="sm"
                />
              }
            />
            </HStack>
            </VStack>
          </VStack>
        </Box>
      </NativeBaseProvider>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10
  },
});
