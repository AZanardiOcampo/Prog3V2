import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, FlatList, StyleSheet, Image } from 'react-native';
import { db, auth } from '../firebase/Config';
import firebase from 'firebase';
import { AntDesign } from '@expo/vector-icons';

export default class PostDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: null,
            comentarios: [],
            nuevoComentario: '',
            UserData: {},
            miLike: false,
            likes: 0,
            id: this.props.route.params.id,
        };
    }

    componentDidMount() {
        this.getPostData(this.state.id);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.post !== this.state.post && this.state.post) {
            this.getUserData(this.state.post.owner);
        }
    }

    getPostData(postId) {
        db.collection('posteos').doc(postId).onSnapshot((doc) => {
            if (doc.exists) {
                this.setState({
                    post: doc.data(),
                    comentarios: doc.data().comments || [],
                    miLike: doc.data().likes.includes(auth.currentUser.email),
                    likes: doc.data().likes.length,
                });
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

    Like() {
        db.collection('posteos').doc(this.state.id).update({ likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email) })
            .then(() => { this.setState({ likes: this.state.likes + 1, miLike: true }) });
    }

    Unlike() {
        db.collection('posteos').doc(this.state.id).update({ likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email) })
            .then(() => { this.setState({ likes: this.state.likes - 1, miLike: false }) });
    }

    agregarComentario() {
        const { nuevoComentario, comentarios } = this.state;
        if (nuevoComentario.trim() !== '') {
            const nuevo = {
                owner: auth.currentUser.email,
                descripcion: nuevoComentario,
                createdAt: Date.now(),
            };

            db.collection('posteos').doc(this.state.id).update({
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
        const { comentarios, nuevoComentario, post, UserData, miLike, likes } = this.state;
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.goBack()}>
                    <Text style={styles.backButtonText}>Regresar</Text>
                </TouchableOpacity>
                {UserData.username && <Text style={styles.userName}>{UserData.username}</Text>}
                {post && <Image source={{ uri: post.imageUrl }} style={styles.imgPost} />}
                {post && <Text style={styles.title}>{post.descripcion}</Text>}

                <View style={styles.likeButton}>
                    {miLike ? (
                        <TouchableOpacity onPress={() => this.Unlike()}>
                            <AntDesign name="heart" size={24} color="red" style={styles.likeIcon} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => this.Like()}>
                            <AntDesign name="hearto" size={24} color="black" style={styles.likeIcon} />
                        </TouchableOpacity>
                    )}
                    <Text style={styles.likeCount}>{likes} likes</Text>
                </View>

                <TextInput
                    placeholder='Agregar un comentario...'
                    placeholderTextColor="#888"
                    onChangeText={(text) => this.setState({ nuevoComentario: text })}
                    value={nuevoComentario}
                    style={styles.commentInput}
                />

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: nuevoComentario.trim() === '' ? '#aaa' : '#ff0000' }]}
                    disabled={nuevoComentario.trim() === ''}
                    onPress={() => this.agregarComentario()}
                >
                    <Text style={styles.buttonText}>Comentar</Text>
                </TouchableOpacity>

                {comentarios.length !== 0 ? (
                    <FlatList
                        style={styles.flatlist}
                        data={comentarios.sort((a, b) => b.createdAt - a.createdAt)}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.commentContainer}>
                                <Text style={styles.commentOwner}>{item.owner}</Text>
                                <Text style={styles.commentText}>{item.descripcion}</Text>
                            </View>
                        )}
                    />
                ) : (
                    <Text style={styles.noCommentsText}>Aún no hay comentarios</Text>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e',
        padding: 15,
    },
    backButton: {
        marginBottom: 20,
    },
    backButtonText: {
        color: '#ffd700',
        fontSize: 18,
        fontWeight: 'bold',
    },
    userName: {
        color: '#ffd700',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    imgPost: {
        height: 300,
        width: '100%',
        borderRadius: 10,
        marginBottom: 10,
        resizeMode: 'cover',
    },
    title: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    likeIcon: {
        marginRight: 5,
    },
    likeCount: {
        color: '#ffd700',
        marginLeft: 10,
        fontSize: 16,
    },
    commentInput: {
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
        marginBottom: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
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
    noCommentsText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 20,
    },
    flatlist: {
        width: '100%',
    },
});

