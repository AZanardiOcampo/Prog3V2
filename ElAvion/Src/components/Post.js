import { Text, View, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import React, { Component } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { db, auth } from '../firebase/Config';
import firebase from 'firebase';

export default class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            estaMiLike: false,
            UserData: {},
            comentariosMostrados: 4,
        };
    }

    componentDidMount() {
        console.log('this props', this.props);
        let estaMiLike = this.props.post.data.likes.includes(auth.currentUser.email);
        if (estaMiLike) {
            this.setState({ estaMiLike: true });
        }
        db.collection('users').where('email', '==', this.props.post.data.owner)
            .onSnapshot(data => {
                data.forEach(doc => {
                    console.log(doc.data());
                    this.setState({ UserData: doc.data() });
                });
            });
    }

    like() {
        db.collection('posteos')
            .doc(this.props.post.id)
            .update({
                likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
            })
            .then(() => this.setState({ estaMiLike: true }))
            .catch((err) => console.log(err));
    }

    unlike() {
        db.collection('posteos')
            .doc(this.props.post.id)
            .update({
                likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)
            })
            .then(() => this.setState({ estaMiLike: false }))
            .catch((err) => console.log(err));
    }

    goToProfile(user) {
        user !== auth.currentUser.email
            ? this.props.navigation.navigate('user-profile', { email: user })
            : this.props.navigation.navigate('my-profile');
    }

    mostrarMasComentarios = () => {
        this.setState((prevState) => ({
            comentariosMostrados: prevState.comentariosMostrados + 3,
        }));
    }

    render() {
        console.log(this.props.post.data);
        const { comentariosMostrados } = this.state;
        const comentarios = this.props.post.data.comments || [];
        return (
            <TouchableOpacity style={styles.container} onPress={() => this.props.navigation.navigate('post-detail', { id: this.props.post.id })}>
                <TouchableOpacity onPress={() => this.goToProfile(this.state.UserData.email)} style={styles.profileContainer}>
                    <Text style={styles.ownerText}>
                        {this.state.UserData.username}
                    </Text>
                </TouchableOpacity>
                <Image
                    source={{ uri: this.props.post.data.imageUrl }}
                    style={styles.imgPost}
                />
                <Text style={styles.description}>
                    {this.state.UserData.username}: {this.props.post.data.descripcion}
                </Text>
                <Text style={styles.likeCount}>
                    {this.props.post.data.likes.length} likes
                </Text>
                {
                    this.state.estaMiLike
                        ? <TouchableOpacity
                            onPress={() => this.unlike()}
                            style={styles.likeButton}
                        >
                            <FontAwesome name='heart' color={'red'} size={24} />
                        </TouchableOpacity>
                        : <TouchableOpacity
                            onPress={() => this.like()}
                            style={styles.likeButton}
                        >
                            <FontAwesome name='heart-o' color={'red'} size={24} />
                        </TouchableOpacity>
                }
                {
                    comentarios.length > 0 ? (
                        <>
                            <FlatList
                                data={comentarios.slice(0, comentariosMostrados)}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.commentContainer}>
                                        <Text style={styles.commentOwner}>{item.owner}</Text>
                                        <Text style={styles.commentText}>{item.descripcion}</Text>
                                    </View>
                                )}
                                style={styles.commentList}
                            />
                            {comentariosMostrados < comentarios.length && (
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={this.mostrarMasComentarios}
                                >
                                    <Text style={styles.buttonText}>Mostrar más comentarios</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    ) : (
                        <Text style={styles.noComments}>Sin comentarios aun</Text>
                    )
                }
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1e1e1e',
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
    },
    profileContainer: {
        marginBottom: 10,
    },
    ownerText: {
        color: '#ffd700',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imgPost: {
        height: 200,
        width: '100%',
        borderRadius: 10,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    description: {
        color: '#ffffff',
        fontSize: 14,
        marginBottom: 10,
    },
    likeCount: {
        color: '#ffffff',
        fontSize: 14,
        marginBottom: 10,
    },
    likeButton: {
        marginBottom: 10,
    },
    commentList: {
        marginBottom: 10,
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
        fontSize: 14,
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#ff0000',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});
