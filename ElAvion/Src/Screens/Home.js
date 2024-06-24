import { Text, View, FlatList } from 'react-native';
import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { db, auth } from '../firebase/Config';
import { StyleSheet } from 'react-native';
import Post from '../components/Post';

export default class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posteos: []
        };
    }
    
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user == null) {
                console.log("no hay nadie logueado");
                this.props.navigation.navigate('login');
            }
        });
        
        db.collection('posteos').orderBy('createdAt', 'desc').onSnapshot((docs) => {
            let postObtenidos = [];
            docs.forEach(doc => {
                postObtenidos.push({
                    id: doc.id,
                    data: doc.data()
                });
            });
            this.setState({ posteos: postObtenidos });
        });
    }
    
    render() {
        return (
            <View style={styles.containerPrincipal}>
                <Text style={styles.header}>Feed</Text>
                <FlatList
                    data={this.state.posteos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <View><Post navigation={this.props.navigation} post={item} /></View>}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerPrincipal: {
        flex: 1,
        backgroundColor: '#1e1e1e', 
        padding: 10,
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#ffd700', 
        fontFamily: 'serif', 
        textShadowColor: '#ff0000', 
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    }
});