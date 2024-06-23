import React, {Component} from 'react'
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native'
import { auth } from '../firebase/Config'

class Login  extends Component {
    constructor(props){
        super(props)
        this.state = {
            password:'',
            email:'',
            error: ''
        }
    }

    componentDidMount(){
        auth.onAuthStateChanged(user => {
            if(user){
                console.log('El email logueado es ' , auth.currentUser.email);
            }
        })
    }

    onSubmit( email, password){
        if(
            email === null || email === '' || !email.includes('@')
        ){
            this.setState({error: 'El email tiene un formato invalido'})
            return false
        }
        if(

            password === null || password === '' || password.length < 6
        ){
            this.setState({error: 'La password no puede ser menor de 6 caracteres'})
            return false
        }

        auth.signInWithEmailAndPassword(email, password)
        .then(user => 
        {if(user) {
            this.props.navigation.navigate('tabnav')
            console.log("El usuario logueado es ", user);
        }})

    }
    

    redirect(){
        this.props.navigation.navigate('register')
    }
        render(){
            return(
                <View>
                    <Text>Loguea tu usuario</Text>
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
                        placeholder='Indica tu contraseña'
                        secureTextEntry = {true}
                        keyboardType='default'
                        style={styles.input}
                    />
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={()=> this.onSubmit(this.state.email, this.state.password)}
                    >
                        <Text style={styles.textBtn}>Loguearme</Text>
                    </TouchableOpacity>
                    <Text>
                        No tenes una cuenta? 
                        <TouchableOpacity onPress={() => this.redirect()}>
                            <Text> Registrate</Text>
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

export default Login