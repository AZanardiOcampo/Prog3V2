import {Text, View, TouchableOpacity, Image, FlatList} from 'react-native'
import {Component} from 'react'
import { StyleSheet } from 'react-native'
import firebase from 'firebase'
import {db, auth} from '../firebase/Config'
import { AntDesign } from '@expo/vector-icons';

class ProfilePost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            conteo: 0,
            miLike: this.props.posteo.data.likes.includes(auth.currentUser.email),
            likes: this.props.posteo.data.likes.length
        }
    }

    Like() {
        db.collection('posteos').doc(this.props.posteo.id).update({ likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email) })
            .then(() => { this.setState({ likes: this.props.posteo.data.likes.length, miLike: true }) })
    }
    Unlike() {
        db.collection('posteos').doc(this.props.posteo.id).update({ likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email) })
            .then(() => { this.setState({ likes: this.props.posteo.data.likes.length, miLike: false }) })
    }
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.img} source={{ uri: this.props.posteo.data.imageUrl }} />
                <Text>{this.props.posteo.data.descripcion}</Text>
                <View style={styles.likeButton}>
                    {this.state.miLike ? <TouchableOpacity onPress={() => this.Unlike()}>
                        <AntDesign name="heart" size={24} color="black" />
                    </TouchableOpacity> :
                        <TouchableOpacity onPress={() => this.Like()}>
                            <AntDesign name="hearto" size={24} color="black" />
                        </TouchableOpacity>
                    }
                    <Text style={styles.likeText}>{this.state.likes}</Text>
                </View>
                {auth.currentUser.email == this.props.posteo.data.owner ?
                    <TouchableOpacity onPress={(idPosteo) => this.props.borrarPosteo(this.props.posteo.id)}>
                        <Text>Borrar Posteo</Text>
                    </TouchableOpacity> :
                    <Text> </Text>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
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
        marginBottom: 10
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    likeText: {
        marginLeft: 5,
        fontWeight: 'bold'
    }
});

export default ProfilePost