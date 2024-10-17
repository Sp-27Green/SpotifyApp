import { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { StatusBar } from "expo-status-bar";
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { newUser, intervalList } from '../ExtraFunctions';
import { TempoInterval } from '../TempoIntervalClass';
import { TempoIntervalTemplate } from '../TempoIntervalTemplateClass';
import TemplateListItem from "../TemplateListItems.js";

export const TemplateScreen = ({ route }) => {
    const { value } = route.params;
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    let interval, intervalName = 'Enter Interval Template Name', intervalArray;

    // Set interval information if value exists
    if (value !== -1 && value !== "null") {
        interval = newUser.usersIntervalTemplates[value];
        intervalName = interval.getTemplateName();
        intervalArray = interval.intervalArray;
    }

    const [text, onChangeText] = useState(intervalName);

    // Runs when the component is first mounted
    useEffect(() => {
        intervalList.length = 0;
        if (intervalArray) {
            const list = intervalArray.map((item, i) => ({
                id: (i + 1).toString(),
                text: `Item ${(i + 1)}`,
                userTemplate: value,
                lowTempo: item.lowTempo,
                highTempo: item.highTempo,
                interval: item.getIntervalType(),
                songAmount: item.getSongAmount()
            }));
            setData(list);
            intervalList.push(...intervalArray);
        }
    }, []);

    const handleDeleteItem = (id) => {
        const updatedData = data.filter(item => item.id !== id);
        const updatedList = updatedData.map((item, index) => ({
            ...item,
            id: (index + 1).toString(),
            text: `Item ${index + 1}`,
        }));
        setData(updatedList);
    };

    const handleAddItem = () => {
        const newId = (data.length + 1).toString();
        const newItem = { id: newId, text: `Item ${newId}`, userTemplate: value, lowTempo: 80, highTempo: 80, interval: "increase", songAmount: 1 };
        const newInterval = new TempoInterval();
        intervalList.push(newInterval);
        setData([...data, newItem]);
    };

    const handleSave = () => {
        const tempoTemplate = new TempoIntervalTemplate(text);
        if (value === "null" || value === -1) {
            newUser.usersIntervalTemplates.push(tempoTemplate);
            Object.assign(newUser.usersIntervalTemplates[newUser.usersIntervalTemplates.length - 1].intervalArray, intervalList);
        } else {
            newUser.usersIntervalTemplates[value].setTemplateName(text);
            Object.assign(newUser.usersIntervalTemplates[value].intervalArray, intervalList);
        }
        navigation.goBack();
    };

    const renderItem = ({ item }) => (
        <TemplateListItem item={item} onDelete={handleDeleteItem} />
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.top}>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={text}
                    placeholder="Enter Template Name"
                    placeholderTextColor="#888"
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
                    <Text style={styles.addButtonText}>Add Interval</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                style={styles.list}
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <View style={styles.bottom}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        padding: 20,
    },
    top: {
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderColor: '#555',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        color: '#fff',
        backgroundColor: '#2C2C2C',
        marginBottom: 20,
    },
    addButton: {
        backgroundColor: '#1DB954',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    list: {
        flex: 1,
    },
    bottom: {
        marginBottom: 20,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#1DB954',
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 30,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TemplateScreen;
