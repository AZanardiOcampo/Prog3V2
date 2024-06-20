import React, { Component } from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
/* import Login from '../screens/Login' */
import miPerfil from '../screens/miPerfil'
import Feed from '../screens/Feed';
import NewPost from '../screens/NewPost';
import Buscador from '../screens/Buscador'
import { Octicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const Tab = createBottomTabNavigator()

export default class TabNav extends Component {
    render() {
        return (
            <Tab.Navigator>
                <Tab.Screen name='feed'component={Feed} options={{headerShown:false, tabBarIcon: () => <Octicons name="feed-rocket" size={24} color="black" />}}/>
                <Tab.Screen name='new-post' component={NewPost} options={{headerShown:false}}/>
                <Tab.Screen name='profile' component={Profile} options={{headerShown:false}}/>
                <Tab.Screen name='buscador' component = {Buscador} options={{headerShown : false}}/>
                <Tab.Screen name='new-post' component = {NewPost} options={{headerShown : false, tabBarIcon : () => <AntDesign name="pluscircleo" size={24} color="black" />}}/>
                <Tab.Screen name='profile' component = {miPerfil} options={{headerShown : false,tabBarIcon : () => <FontAwesome6 name="person" size={24} color="black" />}}/>
                <Tab.Screen name='buscador' component = {Buscador} options={{headerShown : false,tabBarIcon : () => <Feather name="search" size={24} color="black" />}}/>
            </Tab.Navigator>
        )
    }
}