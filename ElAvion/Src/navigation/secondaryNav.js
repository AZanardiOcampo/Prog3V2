import React, {Component} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Home from '../screens/Home'
import UserProfile from '../screens/UserProfile'
import PostDetail from '../screens/PostDetail'

const Stack = createNativeStackNavigator()
export default class SecondaryNav extends Component {


    render( ) {
        return(
            <Stack.Navigator>
                <Stack.Screen name='home' component={Home} options = {{ headerShown: false}}/>
                <Stack.Screen name='user-profile' component={UserProfile} options = {{ headerShown: false}}/>
                <Stack.Screen name = 'post-detail' component = {PostDetail} options={{headerShown : false}} />
            </Stack.Navigator>
        )
    }
}