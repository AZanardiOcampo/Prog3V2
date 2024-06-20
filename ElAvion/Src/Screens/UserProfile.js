import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Register from '../screens/Register';
import { db, auth } from '../firebase/config';

export default class PerfilUsuario extends Component {
    constructor(props) {
        super(props)
        super(props);
        this.state = {
            posteos: [],
            datosUsuario:null,
            datosUsuario: null,
            mail: this.props.route.params.mail,
        }
        };
    }
    componentDidMount(){
        db.collection('posteos').where('owner','==',this.state.mail).onSnapshot (

    componentDidMount() {
        db.collection('posteos').where('owner', '==', this.state.mail).onSnapshot(
            docs => {
                let posts=[]
                docs.forEach( doc => {
                let posts = [];
                docs.forEach(doc => {
                    posts.push({
                        id: doc.id,
                        data : doc.data()
                    })

                })
                this.setState({posteos:posts}, () => {console.log('Posteos en el state extendido',this.state.posteos)})

                        data: doc.data()
                    });
                });
                this.setState({ posteos: posts }, () => { console.log('Posteos en el state extendido', this.state.posteos) });
            }
        )
        );
        db.collection('users').where('mail', '==', this.state.mail)
        .onSnapshot(data => {
            data.forEach(doc => {    
                console.log(doc.data());
                this.setState({datosUsuario:doc.data()})
            .onSnapshot(data => {
                data.forEach(doc => {
                    console.log(doc.data());
                    this.setState({ datosUsuario: doc.data() });
                });
            });
     })
    }

/* ACA VIENE RENDER */
