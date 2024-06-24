import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import { Camera } from 'expo-camera/legacy';
import { storage, auth } from '../firebase/Config';

export default class Camara extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dioPermiso: false,
            urlTemporal: ''
        };
        this.metodosCamara = null;
    }

    componentDidMount() {
        console.log('Camera', Camera);
        Camera.requestCameraPermissionsAsync()
            .then(() => this.setState({ dioPermiso: true }))
            .catch(() => console.log('No nos dieron los permisos'));
    }

    tomarFoto() {
        this.metodosCamara.takePictureAsync()
            .then((urlTemp) => this.setState({ urlTemporal: urlTemp.uri }))
            .catch((err) => console.log(err));
    }

    descartarFoto() {
        this.setState({
            urlTemporal: ''
        });
    }

    guardarFotoEnFirebase() {
        fetch(this.state.urlTemporal)
            .then((img) => img.blob())
            .then((imgProcesada) => {
                const ref = storage.ref(`${auth.currentUser.email}_${Date.now()}.jpg`);
                ref.put(imgProcesada)
                    .then(() => {
                        ref.getDownloadURL()
                            .then(url => this.props.actualizarImgUrl(url));
                    });
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <View style={styles.contenedor}>
                {
                    this.state.dioPermiso ?
                        this.state.urlTemporal === '' ?
                            <>
                                <Camera
                                    style={styles.camara}
                                    ref={(metodos) => this.metodosCamara = metodos}
                                    type={Camera.Constants.Type.back}
                                />
                                <TouchableOpacity
                                    style={styles.btn}
                                    onPress={() => this.tomarFoto()}
                                >
                                    <Text style={styles.btnText}>Tomar foto</Text>
                                </TouchableOpacity>
                            </>
                            :
                            <>
                                <Image
                                    style={styles.imagen}
                                    source={{ uri: this.state.urlTemporal }}
                                />
                                <TouchableOpacity
                                    style={styles.btn}
                                    onPress={() => this.descartarFoto()}
                                >
                                    <Text style={styles.btnText}>Rechazar foto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.btn}
                                    onPress={() => this.guardarFotoEnFirebase()}
                                >
                                    <Text style={styles.btnText}>Aceptar foto</Text>
                                </TouchableOpacity>
                            </>
                        :
                        <Text style={styles.errorText}>No diste permisos para usar la Camara</Text>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: '#1e1e1e', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    camara: {
        height: 400,
        width: 400,
    },
    imagen: {
        height: 400,
        width: '100%',
    },
    btn: {
        backgroundColor: '#ff0000', 
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        width: '80%',
    },
    btnText: {
        color: '#ffffff', 
        fontWeight: 'bold',
    },
    errorText: {
        color: '#ff0000', 
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
});
