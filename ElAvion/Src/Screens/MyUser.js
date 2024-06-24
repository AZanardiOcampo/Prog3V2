import { Text, View, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { Component } from 'react';
import { db, auth } from '../firebase/Config';
import ProfilePost from '../components/ProfilePost';

export default class MyUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posteos: [],
            datosUsuario: null,
            idUsuario: null
        };
    }

    componentDidMount() {
        db.collection('posteos').where('owner', '==', auth.currentUser.email).onSnapshot(
            docs => {
                let posts = [];
                docs.forEach(doc => {
                    posts.push({
                        id: doc.id,
                        data: doc.data()
                    });
                });
                this.setState({ posteos: posts });
            }
        );
        db.collection('users').where('email', '==', auth.currentUser.email)
            .onSnapshot(data => {
                data.forEach(doc => {
                    this.setState({ datosUsuario: doc.data(), idUsuario: doc.id });
                });
            });
    }

    logout() {
        auth.signOut()
            .then(() => this.props.navigation.navigate('login'));
    }

    deletePost(idPosteo) {
        db.collection('posteos').doc(idPosteo).delete()
            .then((res) => console.log(res))
            .catch(e => console.log(e));
    }

    render() {
        return (
            <View style={styles.containerPrincipal}>
                <Text style={styles.title}>Mi Perfil</Text>
                {this.state.datosUsuario ? 
                    <View style={styles.perfil}>
                        <Text style={styles.text}>{this.state.datosUsuario.username}</Text>
                        <Text style={styles.text}>{this.state.datosUsuario.email}</Text>
                        <Text style={styles.text}>{this.state.datosUsuario.minibio}</Text>
                        <Text style={styles.text}>Cantidad de posteos: {this.state.posteos.length}</Text>
                        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate("user-edit")}>
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.logoutButton} onPress={() => this.logout()}>
                            <Text style={styles.logoutButtonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                    : 
                    <Text style={styles.loadingText}>Cargando información del usuario...</Text>
                }
                <FlatList
                    data={this.state.posteos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <View><ProfilePost borrarPosteo={(idPosteo) => this.deletePost(idPosteo)} post={item} /></View>}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerPrincipal: {
        flex: 1,
        backgroundColor: '#1e1e1e', 
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffd700', 
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'serif', 
        textShadowColor: '#ff0000', 
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
    },
    perfil: {
        alignItems: 'center',
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        color: '#ffffff', 
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#ff0000', 
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
    },
    buttonText: {
        color: '#ffffff', 
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#000', 
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
    },
    logoutButtonText: {
        color: '#ffffff', 
        fontWeight: 'bold',
    },
    loadingText: {
        color: '#8e8e8e', 
        textAlign: 'center',
        marginTop: 20,
    },
});

