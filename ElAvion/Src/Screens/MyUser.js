import {Text, View, FlatList, TouchableOpacity, Image} from 'react-native'
import React, {Component} from 'react'
import {StyleSheet} from 'react-native'
import {db, auth} from '../firebase/config'
import PostPerfil from '../Component/PostPerfil'

export default class miPerfil extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posteos: [],
            datosUsuario: null,
            idUsuario: null
        }
    }

    componentDidMount() {
        db.collection('posteos').where('owner', '==', auth.currentUser.email).onSnapshot(
            docs => {
                let posts = []
                docs.forEach(doc => {
                    posts.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                this.setState({posteos: posts})
            }
        )
        db.collection('users').where('mail', '==', auth.currentUser.email)
            .onSnapshot(data => {
                data.forEach(doc => {
                    this.setState({datosUsuario: doc.data(), idUsuario: doc.id })
                });
            })
    }

    logout() {
        auth.signOut()
            .then(() => this.props.navigation.navigate('login'))
    }

    borrarPosteo(idPosteo) {
        db.collection('posteos').doc(idPosteo).delete()
            .then((res) => console.log(res))
            .catch(e => console.log(e))
    }
    borrarUser(id){
        db.collection('users').doc(id).delete()
        .then(() =>{
            auth.currentUser.delete()
            .then(() => {
                auth.signOut()
                .then(() => {
                    console.log('Usuario borrado y deslogueado correctamente');
                    this.props.navigation.navigate('login');
                })
                .catch((error) => {
                    console.error('Error al desloguear:', error);
                    // Manejar errores de deslogueo según sea necesario
                });
                
            })
            .catch((e) => console.log(e))
        })
        .catch((e) => console.log('error en el documento:' + e))
    }

    render() {
        return (
            <View style={styles.containerPrincipal}>
                <Text style={styles.title}>Mi Perfil</Text>
                {this.state.datosUsuario ? 
                    <View style={styles.perfil}>
                        <Image style={styles.img} source={this.state.datosUsuario.fotoPerfil ? {uri: this.state.datosUsuario.fotoPerfil} : require('../../assets/fotoDeafult.jpeg')} resizeMode='contain' />
                        <Text style={styles.text}>{this.state.datosUsuario.nombre}</Text>
                        <Text style={styles.text}>{this.state.datosUsuario.mail}</Text>
                        <Text style={styles.text}>{this.state.datosUsuario.minibio}</Text>
                        <Text style={styles.text}>Cantidad de posteos: {this.state.posteos.length}</Text>
                        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate("EditUser")}>
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.logoutButton} onPress={() => this.logout()}>
                            <Text style={styles.logoutButtonText}>Logout</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.logoutButton} onPress={() => this.borrarUser(this.state.idUsuario)}>
                            <Text style={styles.logoutButtonText}>Borrar Perfil</Text>
                        </TouchableOpacity>
                    </View>
                    : 
                    // <TouchableOpacity style={styles.logoutButton} onPress={() => this.logout()}>
                    //         <Text style={styles.logoutButtonText}>Logout</Text>
                    //     </TouchableOpacity>
                     <Text>Cargando información del usuario...</Text>
                    

                }
                <FlatList
                    data={this.state.posteos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => <View><PostPerfil borrarPosteo={(idPosteo) => this.borrarPosteo(idPosteo)} posteo={item}/></View>}
                />
            </View>
        )
    }
}
