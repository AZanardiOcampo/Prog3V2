import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, db } from '../firebase/Config';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email: '',
            error: '',
            minibio: ''
        };
    }

    onSubmit(username, email, password, minibio) {
        if (
            username === null || username === '' || username.length < 5
        ) {
            this.setState({ error: 'El nombre de usuario no puede ser menor de 5 caracteres' });
            return false;
        }
        if (
            email === null || email === '' || !email.includes('@')
        ) {
            this.setState({ error: 'El email tiene un formato invalido' });
            return false;
        }
        if (
            password === null || password === '' || password.length < 6
        ) {
            this.setState({ error: 'La contraseña no puede ser menor de 6 caracteres' });
            return false;
        }

        auth.createUserWithEmailAndPassword(email, password)
            .then(user => {
                if (user) {
                    console.log("El usuario creado es ", user);
                    db.collection('users').add({
                        email: email,
                        username: username,
                        password: password,
                        minibio: minibio,
                        createdAt: Date.now(),
                    })
                        .then(this.props.navigation.navigate('login'))
                        .catch((error) => console.log(error));
                }
            })
            .catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                    this.setState({ error: 'El email ya esta en uso' });
                }
            });
    }

    redirect() {
        this.props.navigation.navigate('login');
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Registra tu usuario</Text>
                <TextInput
                    onChangeText={(text) => this.setState({ email: text, error: '' })}
                    value={this.state.email}
                    placeholder='Indica tu email'
                    keyboardType='default'
                    style={styles.input}
                />
                <TextInput
                    onChangeText={(text) => this.setState({ password: text, error: '' })}
                    value={this.state.password}
                    placeholder='Indica tu contraseña'
                    keyboardType='default'
                    secureTextEntry={true}
                    style={styles.input}
                />
                <TextInput
                    onChangeText={(text) => this.setState({ username: text, error: '' })}
                    value={this.state.username}
                    placeholder='Indica tu nombre de usuario'
                    keyboardType='default'
                    style={styles.input}
                />
                <TextInput
                    onChangeText={(text) => this.setState({ minibio: text, error: '' })}
                    value={this.state.minibio}
                    placeholder='Indica tu mini biografía'
                    keyboardType='default'
                    style={styles.input}
                />
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => this.onSubmit(this.state.username, this.state.email, this.state.password, this.state.minibio)}
                >
                    <Text style={styles.textBtn}>Registrarme</Text>
                </TouchableOpacity>
                <Text style={styles.redirectText}>
                    ¿Ya tienes una cuenta?
                    <TouchableOpacity onPress={() => this.redirect()}>
                        <Text style={styles.redirectLink}> Loguéate</Text>
                    </TouchableOpacity>
                </Text>
                {
                    this.state.error !== '' ?
                        <Text style={styles.errorText}>
                            {this.state.error}
                        </Text>
                        :
                        null
                }
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffd700', 
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'serif', 
        textShadowColor: '#ff0000', 
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
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
    redirectText: {
        color: '#ffffff', 
        textAlign: 'center',
        marginTop: 20,
    },
    redirectLink: {
        color: '#ffd700', 
        fontWeight: 'bold',
    },
    errorText: {
        color: '#ff0000', 
        textAlign: 'center',
        marginTop: 20,
    },
});

export default Register;