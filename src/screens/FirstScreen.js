//FirsScreen.js
import React, { Component } from 'react';
import { Text, View, Button, Image, StyleSheet } from 'react-native';
import HeaderComponent from './HeaderComponent'

export default class FirstScreen extends Component {
     
    static   navigationOptions = {
         //name in Side-menu bar
        drawerLabel: 'FirstScreen Name',  
    //    drawerIcon: ({tintColor}) => (
    //      tintColor === '#2EB6AE' ?
    //     <Image
    //        source={{ uri:('https://reactnative.dev/img/tiny_logo.png')}}
    //        style = {styles.icon}
    //     /> : null
    //   ),
    };
   
    handleButton = () => {
        this.props.navigation.navigate('SecondScreen');
    
      }
  render() {
    return (
      <View style={{flex:1,flexDirection:'column',}}>
       <HeaderComponent {...this.props} showName="First Screen"/>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>First Screen......!</Text>
        <Button onPress={this.handleButton} title='Open secondpage' />
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width : 24,
    height: 24,
  },
});