import React, { Component } from "react";
import { TextInput, View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { auth, db } from "../firebase/Config";

class Buscador extends Component {
    constructor(props) {
        super(props);

    this.state = {
        busqueda: "",
        resultados: [],
        IdUserSeleccionado: "",
        filtro: "email", 
        };
    }

    componentDidMount() {
        db.collection("users").onSnapshot((snapshot) => {
        let info = [];
        snapshot.forEach((doc) => {
            info.push({
            id: doc.id,
            datos: doc.data(),
        });
    });

    this.setState({
        resultados: info,
    });
});
}

seleccionarUsuario(MailUserSeleccionado) {
    if (MailUserSeleccionado != auth.currentUser.email) {
        this.props.navigation.navigate('profileuser', { mail: MailUserSeleccionado });
    } else {
        this.props.navigation.navigate('profile');
    }
}

filtrarUsuarios() {
    const { busqueda, resultados, filtro } = this.state;
    return resultados.filter((usuario) => {
        if (filtro === "email") {
            return usuario.datos.mail.toLowerCase().includes(busqueda.toLowerCase());
    } else if (filtro === "username") {
            return usuario.datos.nombre.toLowerCase().includes(busqueda.toLowerCase());
    } else {
            return usuario.datos.mail.toLowerCase().includes(busqueda.toLowerCase()) ||
            usuario.datos.nombre.toLowerCase().includes(busqueda.toLowerCase());
        }
    });
}

render() {
    const resultadosFiltrados = this.filtrarUsuarios();

    return (
    <View style={styles.containerPrincipal}>
    <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => this.setState({ filtro: "email" })}>
            <Text style={[styles.filterText, this.state.filtro === "email" && styles.filterTextSelected]}>Filtrar por Email</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.setState({ filtro: "username" })}>
            <Text style={[styles.filterText, this.state.filtro === "username" && styles.filterTextSelected]}>Filtrar por Nombre</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.setState({ filtro: "both" })}>
            <Text style={[styles.filterText, this.state.filtro === "both" && styles.filterTextSelected]}>Filtrar por Ambos</Text>
        </TouchableOpacity>
    </View>
    <TextInput
        placeholder="Search..."
        keyboardType="default"
        value={this.state.busqueda}
        style={styles.input}
        onChangeText={(text) => this.setState({ busqueda: text })}
    />
        {resultadosFiltrados.length === 0 ? (
        <Text style={styles.noResults}>No hay resultados para su búsqueda</Text>
        ) : (
        <FlatList
            data={resultadosFiltrados}
            keyExtractor={(user) => user.id}
            style={styles.container}
            renderItem={({ item }) => (
            <TouchableOpacity
                onPress={() => this.seleccionarUsuario(item.datos.mail)}
                style={styles.containerProfile}
            >
                {item.datos.fotoPerfil !== '' ? (
                <Image
                    style={styles.profilePic}
                    source={{ uri: item.datos.fotoPerfil }}
                    resizeMode="contain"
                />
                ) : (
                <Image
                    style={styles.profilePic}
                    source={require('../../assets/DefaultPhoto.jpg')}
                    resizeMode="contain"
                />
                )}
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.datos.nombre}</Text>
                    <Text style={styles.email}>{item.datos.mail}</Text>
                </View>
            </TouchableOpacity>
        )}
    />
)}
</View>
);
}
}

const styles = StyleSheet.create({
    containerPrincipal: {
        flex: 1,
        backgroundColor: '#1e1e1e', 
        padding: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    filterText: {
        color: 'grey',
        fontSize: 16,
        fontWeight: 'bold',
    },
    filterTextSelected: {
        color: '#ffd700', 
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    noResults: {
        color: '#ffd700', 
        textAlign: 'center',
        fontSize: 18,
        marginTop: 20,
    },
    container: {
        flex: 1,
    },
    containerProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#282828',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
    },
    profilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        color: '#ffd700', 
        fontFamily: 'serif',
    },
    email: {
        fontSize: 14,
        color: '#ccc', 
    }
});

export default Buscador;