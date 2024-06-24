import React, { Component } from 'react';
import { getAuth, updatePassword } from 'firebase/auth';
import { Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { db, auth } from '../firebase/Config'
import * as ImagePicker from 'expo-image-picker'
import { storage } from "../firebase/Config";


class EditUser extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            user: "",
            pass: "",
            minibio: "",
            datosUsuario: {},
            idUsuario: null,
            fotoPerfil:""
        };
    }

    componentDidMount(){
        db.collection('users').where('mail', '==', auth.currentUser.email)
        .onSnapshot(data => {
            data.forEach(doc => {    
                console.log(doc.data());
                this.setState({ datosUsuario: doc.data(), idUsuario: doc.id })
            });
        });
    }

    Editar = (user,minibio,pass) => {
        if (user !== "") {
            db.collection("users").doc(this.state.idUsuario).update({nombre: user}).then();
        }
        if (minibio !== "") {
            db.collection("users").doc(this.state.idUsuario).update({minibio: minibio}).then();
        }
        if (pass.length > 5) {
            auth.currentUser.updatePassword(pass)
            .then(() => {
                console.log('Se actualizó la contraseña');
            }).catch((error) => {
                console.log(error);
            });
        }
        if(this.state.fotoPerfil != ""){
            db.collection("users").doc(this.state.idUsuario).update({fotoPerfil:this.state.fotoPerfil}).then(()=> alert("Foto de perfil actualizada"))
          }
        this.props.navigation.navigate('profile')
        
    }
    elegirIMG(){
        ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect:[4,3],
            quality:1
          })
          .then(img => 
            fetch(img.assets[0].uri)
            .then(res => res.blob())
            .then(img =>{
              const ref = storage.ref(`ProfileImg/${Date.now()}.jpg`)
              ref.put(img)
              .then(()=>{
                ref.getDownloadURL()
                .then(url =>{
                  this.setState({fotoPerfil: url},()=>console.log(this.state))
                })
              })
            }))  
        }
    render() {
        return ( 
            <View>
                <TouchableOpacity
                    style={styles.img}
                    onPress={()=> this.elegirIMG()}>
                        {this.state.fotoPerfil == "" ? <Image source={require(`../../assets/fotoDeafult.jpeg`)} style={styles.img} resizeMode='contains' />
                            : <Image source={{uri:this.state.fotoPerfil}} style={styles.img} resizeMode='contains'/>}
                    </TouchableOpacity>
                <TextInput 
                    style={styles.input}
                    placeholder={this.state.datosUsuario.nombre || 'Nombre'}
                    onChangeText={(text) => this.setState({ user: text, error: '' })}
                    value={this.state.user}
                />
                <TextInput 
                    style={styles.input}
                    placeholder='Ingresa tu nueva contraseña'
                    onChangeText={(text) => this.setState({ pass: text, error: '' })}
                    value={this.state.pass}
                    secureTextEntry={true}
                />
                <TextInput
                    style={styles.input}
                    placeholder={this.state.datosUsuario.minibio || 'Minibio'}
                    onChangeText={(text) => this.setState({ minibio: text })}
                    value={this.state.minibio}
                />
                <TouchableOpacity onPress={() => this.Editar(this.state.user,this.state.minibio,this.state.pass)}>
                    <Text>Confirmar cambios</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
