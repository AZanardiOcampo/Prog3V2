import {Text, View, TouchableOpacity, Image, FlatList, TextInput} from 'react-native'
import {Component} from 'react'
import { StyleSheet } from 'react-native'
import firebase from 'firebase'
import {db, auth} from '../firebase/config'
import { Text, View, TouchableOpacity, Image, FlatList, TextInput } from 'react-native';
import { Component } from 'react';
import { StyleSheet } from 'react-native';
import firebase from 'firebase';
import { db, auth } from '../firebase/config';
import { AntDesign } from '@expo/vector-icons';

class DetallePosteo extends Component {
    constructor(props){
        super(props)
        this.state ={
        conteo: 0,
        }

    constructor(props){
        super(props);
        this.state = {
            conteo: 0,
            miLike: false,
            likes: 0,
            datosUsuario: {},
            id: this.props.route.params.id,
            post: null,
            comentario: ""
            }
        }
    }
}

componentDidMount(){

    db.collection('posteos').doc(this.state.id)
    .onSnapshot(data => {
    this.setState({post:data.data()})
})

        .onSnapshot(data => {
            this.setState({ post: data.data() });
        });
}

componentDidUpdate() {
    db.collection('users').where('mail', '==', this.state.post.owner)
.onSnapshot(data => {
     data.forEach(doc => {    

    this.setState({datosUsuario:doc.data()})
    });
    this.setState({miLike: this.state.post.likes.includes(auth.currentUser.email),
        likes: this.state.post.likes.length,})
})
    if (this.state.post) {
        db.collection('users').where('mail', '==', this.state.post.owner)
            .onSnapshot(data => {
                data.forEach(doc => {
                    this.setState({ datosUsuario: doc.data() });
                });
                this.setState({
                    miLike: this.state.post.likes.includes(auth.currentUser.email),
                    likes: this.state.post.likes.length,
                });
            });
    }
}

Likear() {
    db.collection('posteos').doc(this.props.route.params.id).update({likes:firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)})
    .then(()=> {this.setState({likes:this.state.post.likes.length , miLike : true})})
    db.collection('posteos').doc(this.props.route.params.id).update({ likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email) })
        .then(() => { this.setState({ likes: this.state.post.likes.length, miLike: true }) });
}

Deslikear() {
    db.collection('posteos').doc(this.props.route.params.id).update({likes:firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)})
    .then(()=> {this.setState({likes:this.state.post.likes.length, miLike: false})})
    db.collection('posteos').doc(this.props.route.params.id).update({ likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email) })
        .then(() => { this.setState({ likes: this.state.post.likes.length, miLike: false }) });
}
onSubmit(comentario){
    if (comentario != ''){

onSubmit(comentario) {
    if (comentario != '') {
        db.collection('posteos').doc(this.state.id).update({
            comments: firebase.firestore.FieldValue.arrayUnion({
                    owner: auth.currentUser.email,
                    descripcion : comentario,
                    createdAt : Date.now(),
                owner: auth.currentUser.email,
                descripcion: comentario,
                createdAt: Date.now()
            })
        }).then(res => console.log(res))
        .catch((e)=>console.log(e))
            .catch((e) => console.log(e));
    }
    else {
        alert('no podes comentar algo vacio')
        alert('no podes comentar algo vacio');
    }

}}}