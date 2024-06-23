import {Text, View , FlatList} from 'react-native'
import React, {Component} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {NavigationContainer} from '@react-navigation/native'
import Register from '../screens/Register'
import {db, auth} from '../firebase/Config'
import { StyleSheet } from 'react-native'
import Login from '../screens/Login'
import Post from '../components/Post'


export default class Feed extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posteos: []
        }
    }
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user == null) {
                console.log("no hay nadie logueado ")
                this.props.navigation.navigate('login')
    
            }
    
            })
        db.collection('posteos').orderBy('createdAt','desc').onSnapshot((docs) => {
            let postObtenidos = []
            docs.forEach(doc => {
                postObtenidos.push({
                    id : doc.id,
                    data: doc.data()
                })
            })
            this.setState({ posteos: postObtenidos})
        })

    }
    render( ) {
        return(
            <View style={styles.containerPrincipal}>
                <Text style={styles.header}>Feed</Text>
                <FlatList
                data={this.state.posteos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => <View><Post navigation = {this.props.navigation} posteo={item}/></View>} 
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    containerPrincipal: {
        flex: 1
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#000'
    }
})