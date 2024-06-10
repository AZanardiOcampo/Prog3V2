import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import {FontAwesome} from '@expo/vector-icons'
import {db, auth} from '../firebase/config'
import firebase from 'firebase'

export default class Post extends Component {
    constructor(props){
        super(props)
        this.state = {
            estaMiLike: false,
        }
    }

    componentDidMount(){
        console.log('this props', this.props)
        let estaMiLike = this.props.post.data.likes.includes(auth.currentUser.email)
        if(estaMiLike){
            this.setState({estaMiLike: true})
        }
    }

    like(){
        db
        .collection('posteos')
        .doc(this.props.post.id)
        .update({
            likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
        })
        .then(()=> this.setState({estaMiLike: true}))
        .catch((err) => console.log(err))
    }

    unlike(){
        db
        .collection('posteos')
        .doc(this.props.post.id)
        .update({
            likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)
        })
        .then(()=> this.setState({estaMiLike: false}))
        .catch((err) => console.log(err))
    }


  render() {
    return (
      <View>
        <Image 
         source={{uri: this.props.post.data.imageUrl}}
            style={styles.imgPost}
        />
        <Text>
            {
            this.props.post.data.descripcion
            }
        </Text>
            <Text>
        {
            this.props.post.data.likes.length
        }
            </Text>
        {
            this.state.estaMiLike ?
           <TouchableOpacity
            onPress={()=> this.unlike()}
           >
                <FontAwesome name='heart' color={'red'} size={24} />
            </TouchableOpacity>
            :
           <TouchableOpacity
            onPress={()=> this.like()}
           >
                <FontAwesome name='heart-o' color={'red'} size={24} />
            </TouchableOpacity> 
        }
            
      </View>
    )
  }
}

const styles = StyleSheet.create({
    imgPost:{
        height: 200,
        width: '100%'
    }
})