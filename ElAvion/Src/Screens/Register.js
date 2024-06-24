import React, {Component} from 'react'
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native'
import { auth, db } from '../firebase/Config'

class Register extends Component {
    constructor(props){
        super(props)
        this.state = {
            username:'',
            password:'',
            email:'',
            error: '',
            minibio: ''
        }
    }

    onSubmit(username, email, password, minibio){
        if(
            username === null || username === '' || username.length < 5
        ){
            this.setState({error: 'El nombre de usuario no puede ser menor de 5 caracteres'})
            return false
        }
        if(
            email === null || email === '' || !email.includes('@')
        ){
            this.setState({error: 'El email tiene un formato invalido'})
            return false
        }
        if(

            password === null || password === '' || password.length < 6
        ){
            this.setState({error: 'La contraseña no puede ser menor de 6 caracteres'})
            return false
        }

        auth.createUserWithEmailAndPassword(email, password)
        .then(user => {if(user) {
            console.log("El usuario creado es ", user);
            db.collection('users').add({
                email: email,
                username: username,
                password: password,
                minibio: minibio,
                createdAt: Date.now(),
            })
            .then(this.props.navigation.navigate('login'))
            .catch((error) => console.log(error))
        }} 
    
    )
        .catch((error) => {if(error.code === "auth/email-already-in-use"){
            this.setState({error: 'El email ya esta en uso'})
        }}) 
    }

    redirect(){
        this.props.navigation.navigate('login')
    }

    render(){
        return(
            <View>
                <Text>Registra tu usuario</Text>
                <TextInput
                    onChangeText={(text) => this.setState({email: text, error: ''})}
                    value={this.state.email}
                    placeholder='Indica tu email'
                    keyboardType='default'
                    style={styles.input}
                />
                <TextInput
                    onChangeText={(text) => this.setState({password: text, error: ''})}
                    value={this.state.password}
                    placeholder='Indica tu contraseÃ±a'
                    keyboardType='default'
                    secureTextEntry = {true}
                    style={styles.input}
                />
                <TextInput
                        onChangeText={(text) => this.setState({username: text, error: ''})}
                        value={this.state.username}
                        placeholder='Indica tu nombre de usuario'
                        keyboardType='default'
                        style={styles.input}
                />
                <TextInput
                        onChangeText={(text) => this.setState({minibio: text, error: ''})}
                        value={this.state.minibio}
                        placeholder='Indica tu nombre de mini biografia'
                        keyboardType='default'
                        style={styles.input}
                />
                <TouchableOpacity
                    style={styles.btn}
                    onPress={()=> this.onSubmit(this.state.username, this.state.email, this.state.password, this.state.minibio)}
                >
                    <Text style={styles.textBtn}>Registrarme</Text>
                </TouchableOpacity>
                <Text>
                        Ya tenes una cuenta? 
                        <TouchableOpacity onPress={() => this.redirect()}>
                            <Text>Logueate</Text>
                        </TouchableOpacity>
                    </Text>
                {
                    this.state.error !== '' ?
                    <Text>
                        {this.state.error}
                    </Text>
                    : 
                    ''
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        borderColor: 'red',
        borderWidth: 1,
        borderRadius:5,
        marginBottom:16
    },
    btn:{
        backgroundColor:'green',
        textAlign: 'center',
        padding: 10
    },
    textBtn: {
        color: 'white',

    }
})

export default Register