import { Text, View, FlatList } from 'react-native'
import React, { Component } from 'react'
import Post from '../components/Post'
import {db, auth} from '../firebase/config'
export default class Feed extends Component {
    constructor(props){
        super(props)
        this.state = {
            posteos:[]
        }
    }

    // Where, OrderBy, Limit

    componentDidMount(){
        db.collection('posteos')
        .onSnapshot((docs)=>{
            let postObtenidos = []

            docs.forEach(doc => {
                postObtenidos.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            this.setState({
                posteos: postObtenidos
            })
        })
    }

    render() {
        return (
        <View>
            <FlatList
                data={this.state.posteos}
                keyExtractor={(item) => item.id.toString()}
                renderItem = {({ item }) => 
                <Post post={ item } />
                }
            />
        </View>
        )
    }
}