import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../firebase/Config';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            email: '',
            error: ''
        };
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                console.log('El email logueado es ', auth.currentUser.email);
                this.props.navigation.navigate('tabnav');
            }
        });
    }

    onSubmit(email, password) {
        if (
            email === null || email === '' || !email.includes('@')
        ) {
            this.setState({ error: 'El email tiene un formato invalido' });
            return false;
        }
        if (
            password === null || password === '' || password.length < 6
        ) {
            this.setState({ error: 'La password no puede ser menor de 6 caracteres' });
            return false;
        }

        auth.signInWithEmailAndPassword(email, password)
            .then(user => {
                if (user) {
                    this.props.navigation.navigate('tabnav');
                    console.log("El usuario logueado es ", user);
                }
            })
            .catch(error => {
                this.setState({ error: error.message });
            });
    }

    redirect() {
        this.props.navigation.navigate('register');
    }

    render() {
        const { email, password, error } = this.state;
        const isFormValid = email.includes('@') && password.length >= 6;

        return (
            <View style={styles.container}>
                <Text style={styles.title}>Loguea tu usuario</Text>
                <TextInput
                    onChangeText={(text) => this.setState({ email: text, error: '' })}
                    value={email}
                    placeholder='Indica tu email'
                    keyboardType='default'
                    style={styles.input}
                />
                <TextInput
                    onChangeText={(text) => this.setState({ password: text, error: '' })}
                    value={password}
                    placeholder='Indica tu contraseña'
                    secureTextEntry={true}
                    keyboardType='default'
                    style={styles.input}
                />
                <TouchableOpacity
                    style={[styles.btn, { backgroundColor: isFormValid ? '#ff0000' : '#aaa' }]}
                    onPress={() => this.onSubmit(email, password)}
                    disabled={!isFormValid}
                >
                    <Text style={styles.textBtn}>Loguearme</Text>
                </TouchableOpacity>
                <Text style={styles.registerText}>
                    ¿No tienes una cuenta?
                    <TouchableOpacity onPress={() => this.redirect()}>
                        <Text style={styles.registerLink}> Registrate</Text>
                    </TouchableOpacity>
                </Text>
                {
                    error !== '' ?
                        <Text style={styles.errorText}>
                            {error}
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
        marginBottom: 16,
        padding: 10,
        backgroundColor: '#ffffff', 
        color: '#000', 
    },
    btn: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    textBtn: {
        color: '#ffffff', 
        fontWeight: 'bold',
    },
    registerText: {
        color: '#ffffff', 
        textAlign: 'center',
        marginTop: 20,
    },
    registerLink: {
        color: '#ffd700', 
        fontWeight: 'bold',
    },
    errorText: {
        color: '#ff0000', 
        textAlign: 'center',
        marginTop: 20,
    },
});

export default Login;
