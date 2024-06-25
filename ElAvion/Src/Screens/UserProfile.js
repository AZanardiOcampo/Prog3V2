import { Text, View, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { Component } from 'react';
import { db, auth } from '../firebase/Config';
import Post from '../components/Post';

export default class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            datosUsuario: null,
            email: this.props.route.params.email,
        };
    }

    componentDidMount() {
        db.collection('posteos').where('owner', '==', this.state.email).onSnapshot(
            docs => {
                let posts = [];
                docs.forEach(doc => {
                    posts.push({
                        id: doc.id,
                        data: doc.data()
                    });
                });
                this.setState({ posts: posts });
            }
        );
        db.collection('users').where('email', '==', this.state.email)
            .onSnapshot(data => {
                data.forEach(doc => {
                    this.setState({ datosUsuario: doc.data() });
                });
            });
    }

    render() {
        return (
            <View style={styles.containerPrincipal}>
                {this.state.datosUsuario ?
                    <View style={styles.perfil}>
                        {this.state.datosUsuario.profilePicture ? (
                            <Image source={{ uri: this.state.datosUsuario.profilePicture }} style={styles.img} />
                        ) : null}
                        <Text style={styles.profileText}>{this.state.datosUsuario.username}</Text>
                        <Text style={styles.profileText}>{this.state.datosUsuario.email}</Text>
                        <Text style={styles.profileText}>{this.state.datosUsuario.minibio}</Text>
                        <Text style={styles.profileText}>Cantidad de posteos: {this.state.posts.length}</Text>
                    </View>
                    :
                    <Text style={styles.loadingText}>Cargando información del usuario...</Text>
                }
                {this.state.posts.length === 0 ?
                    <Text style={styles.noPostsText}>Este usuario no tiene ningún posteo</Text> :
                    <FlatList
                        data={this.state.posts}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.postContainer}>
                                <Post navigation={this.props.navigation} post={item} />
                            </View>
                        )}
                    />
                }
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
    perfil: {
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#2c2c2c',
        padding: 15,
        borderRadius: 10,
    },
    profileText: {
        fontSize: 16,
        color: '#ffffff', 
        marginBottom: 5,
    },
    img: {
        height: 100,
        width: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    loadingText: {
        fontSize: 18,
        color: '#999999', 
        textAlign: 'center',
        marginTop: 20,
    },
    noPostsText: {
        fontSize: 16,
        color: '#ffffff', 
        textAlign: 'center',
        marginTop: 20,
    },
    postContainer: {
        backgroundColor: '#2c2c2c',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
});
