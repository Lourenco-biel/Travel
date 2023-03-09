import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import formatCurrency from '../utils/formatCurrency'
import viagem from "../assets/images/viagem.jpeg";

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
        padding: 20,
    },
    card: {
        backgroundColor: '#58baff',
        borderRadius: 8,
        border: '1px solid #blue',
        padding: 20,
        marginBottom: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardImage: {
        width: 180,
        height: 180,
        borderRadius: 4,
        marginRight: 20,
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
    },
    cardText: {
        fontSize: 14,
        lineHeight: 1.5,
    },
    cardId: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        lineHeight: 1.5,
    },
    separator: {
        marginRight: 10,
    },
});

const MyDocument = ({ data, total, user }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {user.map((user, index) => (
                    <View key={index} >
                        <Text style={styles.cardText}>Nome: {user.name} </Text>
                        <Text style={styles.cardText}>Local: {user.location} </Text>
                        <Text style={styles.cardText}>Destino: {user.destination}</Text>
                    </View>
                ))}
                {data.map((item, index) => (
                    <View>
                        <View key={index} style={styles.card}>
                            <View>
                                <Text style={styles.cardId}>#{index + 1}</Text>
                                {item && item.path ?
                                    <Image source={item.path} style={styles.cardImage} />
                                    : <Image source={viagem} style={styles.cardImage} />
                                }
                            </View>
                            <Text style={styles.separator}></Text>
                            <View>
                                <Text style={styles.cardTitle}>Local: {item.name}</Text>
                                <Text style={styles.cardText}>Sobre:  {item.description}</Text>
                                <Text style={styles.cardText}>Localização:  {item.location}</Text>
                                <Text style={styles.cardText}>Data:  {item.date ? item.date : "Indefinido"}</Text>
                                <Text style={styles.cardText}>Horas:  {item.hours ? item.hours : 'Indefinido'}</Text>
                                <Text style={styles.cardText}>Custo:  {formatCurrency(item.cost)}</Text>
                            </View>
                        </View>
                    </View>
                ))}
                <Text style={styles.cardText}>Total gasto: {total}</Text>
            </Page>
        </Document>
    )
};

export default MyDocument;
