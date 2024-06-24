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
            UserData: {}
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
        db
            .collection('posteos')
            .doc(this.props.post.id)
            .update({
                likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
            })
            .then(() => this.setState({ estaMiLike: true }))
            .catch((err) => console.log(err));
    }

    unlike() {
        db
            .collection('posteos')
            .doc(this.props.post.id)
            .update({
                likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)
            })
            .then(() => this.setState({ estaMiLike: false }))
            .catch((err) => console.log(err));
    }

    goToProfile(user) {
        {
            user != auth.currentUser.email ?
                this.props.navigation.navigate('user-profile', { email: user })
                :
                this.props.navigation.navigate('my-profile');
        }
    }

    render() {
        console.log(this.state.UserData);
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.goToProfile(this.state.UserData.email)}>
                    <Text style={styles.ownerText}>
                        {this.props.post.data.owner}
                    </Text>
                </TouchableOpacity>
                <Image
                    source={{ uri: this.props.post.data.imageUrl }}
                    style={styles.imgPost}
                />
                <Text style={styles.description}>
                    {this.props.post.data.descripcion}
                </Text>
                <Text style={styles.likeCount}>
                    {this.props.post.data.likes.length} likes
                </Text>
                {
                    this.state.estaMiLike ?
                        <TouchableOpacity
                            onPress={() => this.unlike()}
                            style={styles.likeButton}
                        >
                            <FontAwesome name='heart' color={'red'} size={24} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={() => this.like()}
                            style={styles.likeButton}
                        >
                            <FontAwesome name='heart-o' color={'red'} size={24} />
                        </TouchableOpacity>
                }
                <Text style={styles.commentCount}>{this.props.post.data.comments ? this.props.post.data.comments.length : 0} comments</Text>
                {this.props.post.data.comments && this.props.post.data.comments.length > 0 ? (
                    <FlatList
                        data={this.props.post.data.comments.slice(0, 3)}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => <Text style={styles.comment}>{item.owner}: {item.descripcion}</Text>}
                        style={styles.commentList}
                    />
                ) : (
                    <Text style={styles.comment}>No comments yet</Text>
                )}
                {auth.currentUser.email != null &&
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { this.props.navigation.navigate('post-detail', { id: this.props.post.id }) }}
                    >
                        <Text style={styles.buttonText}>View all comments</Text>
                    </TouchableOpacity>
                }
            </View>
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
    ownerText: {
        color: '#ffd700', 
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    imgPost: {
        height: 200,
        width: '100%',
        borderRadius: 10,
    },
    description: {
        color: '#ffffff', 
        fontSize: 14,
        marginVertical: 10,
    },
    likeCount: {
        color: '#ffffff', 
        fontSize: 14,
        marginBottom: 10,
    },
    likeButton: {
        marginBottom: 10,
    },
    commentCount: {
        color: '#ffffff', 
        fontSize: 14,
        marginBottom: 10,
    },
    commentList: {
        marginBottom: 10,
    },
    comment: {
        color: '#ffffff', 
        fontSize: 14,
        marginBottom: 5,
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