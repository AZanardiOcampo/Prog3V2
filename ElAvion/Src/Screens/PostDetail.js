import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, FlatList, StyleSheet, Image } from 'react-native';
import { db, auth } from '../firebase/Config';
import firebase from 'firebase';

export default class PostDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: {},
            comentarios: [],
            nuevoComentario: '',
            UserData: {},
        };
    }

    componentDidMount() {
        const postId = this.props.route.params.id;
        this.getPostData(postId);
    }

    getPostData(postId) {
        db.collection('posteos').doc(postId).onSnapshot((doc) => {
            if (doc.exists) {
                this.setState({
                    post: doc.data(),
                    comentarios: doc.data().comments || [],
                });
                this.getUserData(doc.data().owner);
            }
        });
    }

    getUserData(email) {
        db.collection('users').where('email', '==', email).onSnapshot(data => {
            data.forEach(doc => {
                this.setState({ UserData: doc.data() });
            });
        });
    }

    agregarComentario() {
        const { nuevoComentario, comentarios, post } = this.state;
        if (nuevoComentario.trim() !== '') {
            const nuevo = {
                owner: auth.currentUser.email,
                descripcion: nuevoComentario,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            };

            db.collection('posteos').doc(this.props.route.params.id).update({
                comments: firebase.firestore.FieldValue.arrayUnion(nuevo),
            }).then(() => {
                this.setState({
                    comentarios: [nuevo, ...comentarios],
                    nuevoComentario: '',
                });
            }).catch((err) => console.log(err));
        }
    }

    render() {
        const { comentarios, nuevoComentario, post, UserData } = this.state;
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.goBack()}>
                    <Text style={styles.backButtonText}>Regresar</Text>
                </TouchableOpacity>
                <Text style={styles.ownerText}>{UserData.username}</Text>
                <Image source={{ uri: post.imageUrl }} style={styles.imgPost} />
                <Text style={styles.title}>{post.descripcion}</Text>
                {comentarios.length > 0 ? (
                    <FlatList
                        data={comentarios.sort((a, b) => b.createdAt - a.createdAt)}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.commentContainer}>
                                <Text style={styles.commentOwner}>{item.owner}</Text>
                                <Text style={styles.commentText}>{item.descripcion}</Text>
                            </View>
                        )}
                        style={styles.commentList}
                    />
                ) : (
                    <Text style={styles.noComments}>Aún no hay comentarios</Text>
                )}
                <TextInput
                    style={styles.input}
                    placeholder="Agregar un comentario..."
                    placeholderTextColor="#888"
                    onChangeText={(text) => this.setState({ nuevoComentario: text })}
                    value={nuevoComentario}
                />
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: nuevoComentario.trim() === '' ? '#aaa' : '#ff0000' }]}
                    disabled={nuevoComentario.trim() === ''}
                    onPress={() => this.agregarComentario()}
                >
                    <Text style={styles.buttonText}>Comentar</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e',
        padding: 10,
    },
    backButton: {
        marginBottom: 20,
    },
    backButtonText: {
        color: '#ffd700',
        fontSize: 18,
        fontWeight: 'bold',
    },
    ownerText: {
        color: '#ffd700',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    imgPost: {
        height: 200,
        width: '100%',
        borderRadius: 10,
        marginBottom: 10,
    },
    title: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    commentContainer: {
        backgroundColor: '#2c2c2c',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    commentOwner: {
        color: '#ffd700',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    commentText: {
        color: '#ffffff',
    },
    noComments: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 20,
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
    },
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
