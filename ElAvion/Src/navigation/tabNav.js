import React, { Component } from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import MyUser from '../screens/MyUser'
import NewPost from '../screens/NewPost';
import Buscador from '../screens/Buscador'
import { Octicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import SecondaryNav from './secondaryNav';

const Tab = createBottomTabNavigator()

export default class TabNav extends Component {
    render() {
        return (
            <Tab.Navigator>
                <Tab.Screen name='home'component={SecondaryNav} options={{headerShown: false, tabBarIcon: () => <Octicons name='home' size={24} color="black" />}}/>
                <Tab.Screen name='new-post' component = {NewPost} options={{headerShown : false, tabBarIcon : () => <AntDesign name="pluscircleo" size={24} color="black" />}}/>
                <Tab.Screen name='my-profile' component = {MyUser} options={{headerShown : false,tabBarIcon : () => <FontAwesome6 name="person" size={24} color="black" />}}/>
                <Tab.Screen name='buscador' component = {Buscador} options={{headerShown : false,tabBarIcon : () => <Feather name="search" size={24} color="black" />}}/>
            </Tab.Navigator>
        )
    }
}