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