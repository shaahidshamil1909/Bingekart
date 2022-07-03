

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