import {Text, View, FlatList, TouchableOpacity, Image} from 'react-native'
import React, {Component} from 'react'
import {StyleSheet} from 'react-native'
import {db, auth} from '../firebase/Config'
import ProfilePost from '../components/ProfilePost'

export default class MyUser extends Component {
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
        db.collection('users').where('email', '==', auth.currentUser.email)
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

    deletePost(idPosteo) {
        db.collection('posteos').doc(idPosteo).delete()
            .then((res) => console.log(res))
            .catch(e => console.log(e))
    }

    render() {
        return (
            <View style={styles.containerPrincipal}>
                <Text style={styles.title}>Mi Perfil</Text>
                {this.state.datosUsuario ? 
                    <View style={styles.perfil}>
                        <Text style={styles.text}>{this.state.datosUsuario.username}</Text>
                        <Text style={styles.text}>{this.state.datosUsuario.email}</Text>
                        <Text style={styles.text}>{this.state.datosUsuario.minibio}</Text>
                        <Text style={styles.text}>Cantidad de posteos: {this.state.posteos.length}</Text>
                        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate("EditUser")}>
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.logoutButton} onPress={() => this.logout()}>
                            <Text style={styles.logoutButtonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                    : 
                     <Text>Cargando informaciÃ³n del usuario...</Text>
                    

                }
                <FlatList
                    data={this.state.posteos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => <View><ProfilePost borrarPosteo={(idPosteo) => this.deletePost(idPosteo)} post={item}/></View>}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    img: {
        flex: 1
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#000'
    }
})
