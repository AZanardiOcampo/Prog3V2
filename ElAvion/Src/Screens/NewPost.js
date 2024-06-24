import { Text, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React, { Component } from 'react';
import { db, auth } from '../firebase/Config';
import Camara from '../components/Camara';

export default class NewPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            descripcion: '',
            imgPostUrl: '',
        };
    }

    onSubmit(descripcion) {
        if (descripcion != '') {
            db.collection('posteos').add({
                descripcion: descripcion,
                owner: auth.currentUser.email,
                createdAt: Date.now(),
                imageUrl: this.state.imgPostUrl,
                likes: [],
                comments: []
            })
            .then((resp) => {
                this.setState({
                    descripcion: ''
                },
                () => this.props.navigation.navigate('home')
                );
            })
            .catch((err) => console.log(err));
        }
    }

    actualizarImgUrl(url) {
        this.setState({
            imgPostUrl: url
        });
    }

    render() {
        return (
            <View style={styles.contenedor}>
                {
                    this.state.imgPostUrl === ''
                    ?
                    <Camara actualizarImgUrl={(url) => this.actualizarImgUrl(url)} />
                    :
                    <>
                        <TextInput
                            value={this.state.descripcion}
                            onChangeText={(text) => this.setState({ descripcion: text })}
                            placeholder='Describe tu post'
                            style={styles.input}
                        />
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => this.onSubmit(this.state.descripcion)}
                        >
                            <Text style={styles.textBtn}>Crear post</Text>
                        </TouchableOpacity>
                    </>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: '#1e1e1e', 
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        borderColor: '#ffd700', 
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        backgroundColor: '#ffffff', 
        color: '#000', 
        width: '100%',
    },
    btn: {
        backgroundColor: '#ff0000', 
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
    },
    textBtn: {
        color: '#ffffff', 
        fontWeight: 'bold',
    },
});
