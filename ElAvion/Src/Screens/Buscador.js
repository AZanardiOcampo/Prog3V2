import React, { Component } from "react";
import { TextInput, View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { auth, db } from "../firebase/Config";

class Buscador extends Component {
    constructor(props) {
        super(props);

        this.state = {
            busqueda: "",
            resultados: [],
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

    selectUser(email) {
        if (email !== auth.currentUser.email) {
            this.props.navigation.navigate('user-profile', { email });
        } else {
            this.props.navigation.navigate('my-profile');
        }
    }

    userFilter() {
        const { busqueda, resultados, filtro } = this.state;
        return resultados.filter((usuario) => {
            if (!usuario.datos) return false;
            if (filtro === "email") {
                return usuario.datos.email && usuario.datos.email.toLowerCase().includes(busqueda.toLowerCase());
            } else if (filtro === "username") {
                return usuario.datos.username && usuario.datos.username.toLowerCase().includes(busqueda.toLowerCase());
            }
        });
    }

    render() {
        const resultadosFiltrados = this.userFilter();

        return (
            <View style={styles.containerPrincipal}>
                <View style={styles.filterContainer}>
                    <TouchableOpacity onPress={() => this.setState({ filtro: "email" })}>
                        <Text style={[styles.filterText, this.state.filtro === "email" && styles.filterTextSelected]}>Filtrar por Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ filtro: "username" })}>
                        <Text style={[styles.filterText, this.state.filtro === "username" && styles.filterTextSelected]}>Filtrar por Nombre</Text>
                    </TouchableOpacity>
                </View>
                <TextInput
                    placeholder="Buscar..."
                    keyboardType="default"
                    value={this.state.busqueda}
                    style={styles.input}
                    onChangeText={(text) => this.setState({ busqueda: text })}
                />
                {this.state.busqueda !== "" && resultadosFiltrados.length === 0 ? (
                    <Text style={styles.noResults}>El {this.state.filtro} no existe</Text>
                ) : (
                    <FlatList
                        data={resultadosFiltrados}
                        keyExtractor={(user) => user.id}
                        style={styles.container}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => this.selectUser(item.datos.email)}
                                style={styles.containerProfile}
                            >
                                <View style={styles.userInfo}>
                                    {this.state.filtro === "email" ? (
                                        <Text style={styles.email}>{item.datos.email}</Text>
                                    ) : (
                                        <Text style={styles.userName}>{item.datos.username}</Text>
                                    )}
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
        backgroundColor: '#2c2c2c',
        padding: 15,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    filterText: {
        color: '#b0b0b0',
        fontSize: 18,
        fontWeight: 'bold',
    },
    filterTextSelected: {
        color: '#ffd700',
    },
    input: {
        backgroundColor: '#444',
        color: '#fff',
        borderRadius: 10,
        padding: 12,
        marginBottom: 20,
        fontSize: 18,
    },
    noResults: {
        color: '#ffd700',
        textAlign: 'center',
        fontSize: 20,
        marginTop: 20,
    },
    container: {
        flex: 1,
    },
    containerProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3b3b3b',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        color: '#ffd700',
        fontFamily: 'serif',
    },
    email: {
        fontSize: 16,
        color: '#ccc',
    }
});

export default Buscador;
