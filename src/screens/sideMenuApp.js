//App.js
import FirstScreen from "./FirstScreen";
import SecondScreen from "./SecondScreen";
import LoginScreen from "./LoginScreen";

import React, { Component } from 'react';
import {createAppContainer } from "react-navigation";
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer'; 
import {createStackNavigator} from 'react-navigation-stack';
import { Text, StyleSheet, Image, View } from 'react-native';
import { Container, Content, Icon, Header, Body, Form } from 'native-base'


//header in drawer
const CustomDrawerContentComponent = (props) => (

  <Container>
    <Header style={styles.drawerHeader}>
      <Body>
      <View style={{ flexDirection: 'row'} }> 
      <Image
          style={styles.drawerImage}
          source={{ uri:('https://reactnative.dev/img/tiny_logo.png')}} />
         <Text style={{marginLeft:20,alignContent:'center',alignSelf:'center'}}>User name</Text>
       </View>   
      </Body>
    </Header>
    <Content>
      <DrawerItems {...props} />
    </Content>

  </Container>

);

const MyDrawerNavigator = createDrawerNavigator({
  FirstScreen: {
    screen: FirstScreen,
    
  },
  SecondScreen: {
    screen: SecondScreen,
  }  
},
{
  drawerPosition: 'left',
  initialRouteName: 'FirstScreen',
  drawerBackgroundColor: 'white',
  drawerWidth: 200,
  contentComponent: CustomDrawerContentComponent,
  contentOptions: {
    activeTintColor: '#2EB6AE',
    inactiveTintColor: '#939393',
  }
  
});

const RootNavigator = createStackNavigator({
  Login: { screen: LoginScreen ,
           navigationBarStyle : {navBarHidden: true },
           navigationOptions: {
           headerShown: false,
           }
  },
  AfterLogin: { screen: MyDrawerNavigator,
    navigationBarStyle : {navBarHidden: true },
    navigationOptions: {
      headerShown: false,
    } },
});
export default createAppContainer(RootNavigator);

const styles = StyleSheet.create({

  container: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  drawerHeader: {
    height: 100,
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  drawerImage: {
    height: 50,
    width: 50,
    borderRadius: 75
  }

})