import { Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import { Component } from 'react';
import { StyleSheet } from 'react-native';
import firebase from 'firebase';
import { db, auth } from '../firebase/Config';
import { AntDesign } from '@expo/vector-icons';

class ProfilePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conteo: 0,
            miLike: this.props.post.data.likes.includes(auth.currentUser.email),
            likes: this.props.post.data.likes.length
        };
    }

    Like() {
        db.collection('posteos').doc(this.props.post.id).update({ likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email) })
            .then(() => { this.setState({ likes: this.props.post.data.likes.length, miLike: true }); });
    }

    Unlike() {
        db.collection('posteos').doc(this.props.post.id).update({ likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email) })
            .then(() => { this.setState({ likes: this.props.post.data.likes.length, miLike: false }); });
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.img} source={{ uri: this.props.post.data.imageUrl }} />
                <Text style={styles.description}>{this.props.post.data.descripcion}</Text>
                <View style={styles.likeButton}>
                    {this.state.miLike ? <TouchableOpacity onPress={() => this.Unlike()}>
                        <AntDesign name="heart" size={24} color="red" />
                    </TouchableOpacity> :
                        <TouchableOpacity onPress={() => this.Like()}>
                            <AntDesign name="hearto" size={24} color="red" />
                        </TouchableOpacity>
                    }
                    <Text style={styles.likeText}>{this.state.likes}</Text>
                </View>
                {auth.currentUser.email == this.props.post.data.owner ?
                    <TouchableOpacity onPress={(idPosteo) => this.props.borrarPosteo(this.props.post.id)}>
                        <Text style={styles.deleteText}>Borrar Posteo</Text>
                    </TouchableOpacity> :
                    <Text> </Text>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e', 
        marginBottom: 20,
        padding: 10,
        borderRadius: 10,
        borderColor: '#e6e6e6',
        borderWidth: 1,
    },
    img: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginBottom: 10,
    },
    description: {
        color: '#ffffff', 
        marginBottom: 10,
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    likeText: {
        marginLeft: 5,
        fontWeight: 'bold',
        color: '#ffd700', 
    },
    deleteText: {
        color: '#ff0000', 
        marginTop: 10,
    },
});

export default ProfilePost;