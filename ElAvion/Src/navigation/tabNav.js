import { Text, View } from 'react-native'
import React, { Component } from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

/* import Feed from '../screens/Feed'
import NewPost from '../screens/NewPost'
import Profile from '../screens/Profile' */

const Tab = createBottomTabNavigator()

export default class TabNav extends Component {
    render() {
        return (
            <Tab.Navigator>
        <Tab.Screen 
        name='feed' 
        component={Feed}
        options={{
        headerShown:false,
        tabBarIcon: () => <FontAwesome name="newspaper-o" size={24} color="black" />
        }}
        />
        <Tab.Screen 
        name='new-post' 
        component={NewPost}
        options={{
        headerShown:false
        }}
        />
        <Tab.Screen 
        name='profile' 
        component={Profile}
        options={{
        headerShown:false
        }}
        />
        </Tab.Navigator>
        )
    }
}