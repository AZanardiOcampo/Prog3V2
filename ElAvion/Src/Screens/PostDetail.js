import {Component} from 'react'
import firebase from 'firebase'
import { Text, View, TouchableOpacity, Image, FlatList, TextInput } from 'react-native';
import { StyleSheet } from 'react-native';
import { db, auth } from '../firebase/Config';
import { AntDesign } from '@expo/vector-icons';

class PostDetail extends Component {
    constructor(props){
        this.state = {
            conteo: 0,
            miLike: false,
            likes: 0,
            datosUsuario: {},
            id: this.props.route.params.id,
            post: null,
            comentario: ""
        };
    }

    componentDidMount(){
        db.collection('posteos').doc(this.state.id)
        .onSnapshot(data => {
            this.setState({post:data.data()})
        })
    }

    componentDidUpdate() {
        db.collection('users').where('email', '==', this.state.post.owner)
        .onSnapshot(data => {
            data.forEach(doc => {    
                this.setState({datosUsuario:doc.data()})
            });
            this.setState({miLike: this.state.post.likes.includes(auth.currentUser.email),
                likes: this.state.post.likes.length,})
        })
    }

    Like() {
        db.collection('posteos').doc(this.props.route.params.id).update({likes:firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)})
        .then(()=> {this.setState({likes:this.state.post.likes.length , miLike : true})})
    }

    Unlike() {
        db.collection('posteos').doc(this.props.route.params.id).update({likes:firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)})
        .then(()=> {this.setState({likes:this.state.post.likes.length, miLike: false})})
    }

    onSubmit(comentario){
        if (comentario != ''){
            db.collection('posteos').doc(this.state.id).update({
                comments: firebase.firestore.FieldValue.arrayUnion({
                    owner: auth.currentUser.email,
                    descripcion : comentario,
                    createdAt : Date.now(),
                })
            }).then(res => console.log(res))
            .catch((e)=>console.log(e))
        }
        else {
            alert('no es posible comentar algo vacio')
        }
    }

    render() {
        return (
            this.state.post == null ? <Text> Cargando </Text> :
                <View style={styles.container}>
                    <Text style={styles.userName}>{this.state.datosUsuario.nombre}</Text>
                    <Image style={styles.img} source={{ uri: this.state.post.imageUrl }} />
                    <Text style={styles.postDescription}>{this.state.post.descripcion}</Text>

                    <View style={styles.likeButton}>
                        {this.state.miLike ? (
                            <TouchableOpacity onPress={() => this.Unlike()}>
                                <AntDesign name="heart" size={24} color="red" style={styles.likeIcon} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => this.Like()}>
                                <AntDesign name="hearto" size={24} color="black" style={styles.likeIcon} />
                            </TouchableOpacity>
                        )}
                        <Text style={styles.likeCount}>{this.state.likes} likes</Text>
                    </View>

                    <TextInput
                        placeholder='Comentario'
                        onChangeText={(text) => this.setState({ comentario: text })}
                        value={this.state.comentario}
                        style={styles.commentInput}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.state.comentario === '' ? alert('No puedes comentar un texto vacío') : this.onSubmit(this.state.comentario)}
                    >
                        <Text style={styles.buttonText}>Enviar!</Text>
                    </TouchableOpacity>

                    {this.state.post !== null && this.state.post.comments.length !== 0 ? (
                        <FlatList
                            style={styles.flatlist}
                            data={ this.state.post.comments.sort((a,b) => b.createdAt - a.createdAt )}
                            keyExtractor={item => item.createdAt.toString()}
                            renderItem={({ item }) => <Text style={styles.comment}>{item.descripcion}</Text>}
                        />
                    ) : (
                        <Text style={styles.noCommentsText}>Todavía no hay comentarios</Text>
                    )}
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
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    userName: {
        fontWeight: 'bold',
        color: '#ffd700', 
        marginBottom: 10,
        fontSize: 22,
        fontFamily: 'serif', 
        textShadowColor: '#ff0000', 
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
    },
    img: {
        height: 300,
        width: '100%',
        borderRadius: 10,
        marginBottom: 10,
    },
    postDescription: {
        color: '#ffffff', 
        marginBottom: 10,
        fontSize: 18,
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
        borderWidth: 1,
        borderColor: '#dcdcdc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '100%',
        backgroundColor: '#f0f0f0',
        color: '#000',
    },
    button: {
        backgroundColor: '#ff0000', 
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    buttonText: {
        color: '#ffffff', 
        fontWeight: 'bold',
        fontSize: 16,
    },
    flatlist: {
        width: '100%',
        maxHeight: '40%',
    },
    comment: {
        color: '#ffffff', 
        marginBottom: 5,
        fontSize: 16,
    },
    noCommentsText: {
        color: '#8e8e8e',
        marginTop: 10,
    },
});

export default PostDetail;