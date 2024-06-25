import { Text, View, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { Component } from 'react';
import { db, auth } from '../firebase/Config';
import Camara from '../components/Camara';

export default class NewPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            descripcion: '',
            imgPostUrl: '',
            isCameraVisible: true,
        };
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (!user) {
                this.props.navigation.navigate('login');
            }
        });
    }

    onSubmit(descripcion) {
        if (descripcion.trim() !== '' && this.state.imgPostUrl !== '') {
            db.collection('posteos').add({
                descripcion: descripcion,
                owner: auth.currentUser.email,
                createdAt: Date.now(),
                imageUrl: this.state.imgPostUrl,
                likes: [],
                comments: []
            })
            .then(() => {
                this.setState({
                    descripcion: '',
                    imgPostUrl: '',
                    isCameraVisible: true,
                }, () => this.props.navigation.navigate('home'));
            })
            .catch((err) => console.log(err));
        } else {
            this.setState({ error: 'Debe completar todos los campos' });
        }
    }

    actualizarImgUrl(url) {
        this.setState({
            imgPostUrl: url,
            isCameraVisible: false,
        });
    }

    render() {
        return (
            <View style={styles.contenedor}>
                {this.state.isCameraVisible ? (
                    <Camara actualizarImgUrl={(url) => this.actualizarImgUrl(url)} />
                ) : (
                    <>
                        <Image source={{ uri: this.state.imgPostUrl }} style={styles.imagePreview} />
                        <TextInput
                            value={this.state.descripcion}
                            onChangeText={(text) => this.setState({ descripcion: text, error: '' })}
                            placeholder='Describe tu post'
                            style={styles.input}
                        />
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => this.onSubmit(this.state.descripcion)}
                        >
                            <Text style={styles.textBtn}>Crear post</Text>
                        </TouchableOpacity>
                        {this.state.error ? <Text style={styles.errorText}>{this.state.error}</Text> : null}
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => this.setState({ isCameraVisible: true, imgPostUrl: '' })}
                        >
                            <Text style={styles.textBtn}>Tomar otra foto</Text>
                        </TouchableOpacity>
                    </>
                )}
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
        marginBottom: 10,
    },
    textBtn: {
        color: '#ffffff', 
        fontWeight: 'bold',
    },
    imagePreview: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginBottom: 20,
    },
    errorText: {
        color: '#ff0000', 
        textAlign: 'center',
        marginBottom: 20,
    },
});