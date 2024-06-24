import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import { db, auth, storage } from '../firebase/Config';

class UserEdit extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            user: "",
            pass: "",
            minibio: "",
            datosUsuario: {},
            idUsuario: null,
            fotoPerfil: ""
        };
    }

    componentDidMount() {
        db.collection('users').where('email', '==', auth.currentUser.email)
            .onSnapshot(data => {
                data.forEach(doc => {    
                    console.log(doc.data());
                    this.setState({ datosUsuario: doc.data(), idUsuario: doc.id });
                });
            });
    }

    Edit = (user, minibio, pass) => {
        if (user !== "") {
            db.collection("users").doc(this.state.idUsuario).update({ username: user }).then();
        }
        if (minibio !== "") {
            db.collection("users").doc(this.state.idUsuario).update({ minibio: minibio }).then();
        }
        if (pass.length > 5) {
            auth.currentUser.updatePassword(pass)
                .then(() => {
                    console.log('Cambios hechos');
                }).catch((error) => {
                    console.log(error);
                });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput 
                    style={styles.input}
                    placeholder= 'Ingresa tu nuevo nombre de usuario'
                    onChangeText={(text) => this.setState({ user: text, error: '' })}
                />
                <TextInput 
                    style={styles.input}
                    placeholder='Ingresa tu nueva contraseña'
                    onChangeText={(text) => this.setState({ pass: text, error: '' })}
                    secureTextEntry={true}
                />
                <TextInput
                    style={styles.input}
                    placeholder= 'Ingresa tu nueva minibio'
                    onChangeText={(text) => this.setState({ minibio: text })}
                />
                <TouchableOpacity style={styles.btn}
                 onPress={() => { this.Edit(this.state.user, this.state.minibio, this.state.pass); this.props.navigation.navigate('my-profile');
    }}
>
    <Text style={styles.textBtn}>Confirmar cambios</Text>
</TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e', 
        padding: 20,
        justifyContent: 'center',
    },
    input: {
        borderColor: '#ffd700', 
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 16,
        backgroundColor: '#ffffff', 
        color: '#000', 
    },
    btn: {
        backgroundColor: '#ff0000', 
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    textBtn: {
        color: '#ffffff', 
        fontWeight: 'bold',
    },
});

export default UserEdit;