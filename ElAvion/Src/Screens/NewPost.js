import { Text, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import {db, auth} from '../firebase/Config'
import Camara from '../components/Camara'

export default class NewPost extends Component {
    constructor(props){
        super(props)
        this.state={
            descripcion: '',
            imgPostUrl: '',
        }
    }

    onSubmit(descripcion){
        if(descripcion != ''){
            db.collection('posteos').add({
                descripcion: descripcion,
                owner: auth.currentUser.email,
                createdAt: Date.now(),
                imageUrl:this.state.imgPostUrl,
                likes:[],
                comments:[]
            })
            .then((resp)=>{
                this.setState({
                    descripcion:''
                },
                () => this.props.navigation.navigate('new-post')
                )
            })
            .catch((err)=> console.log(err))
        }
    }

    actualizarImgUrl(url){
        this.setState({
            imgPostUrl: url
        })
    }

  render() {
    return (
      <View
      style={styles.contenedor}
      >
        {
            this.state.imgPostUrl === ''
            ?
            
            <Camara actualizarImgUrl={(url)=> this.actualizarImgUrl(url)} />
            :
            <>
                <TextInput
                    value={this.state.descripcion}
                    onChangeText={(text) => this.setState({descripcion: text})}
                    placeholder='Describe tu post'
                    style={styles.input}
                />
                <TouchableOpacity
                    onPress={()=> this.onSubmit(this.state.descripcion)}
                >
                    <Text>Crear post</Text>
                </TouchableOpacity>
            </>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
    contenedor:{
        flex:1
    },
    input:{
        borderColor: 'green',
        borderWidth: 1,
    }
})