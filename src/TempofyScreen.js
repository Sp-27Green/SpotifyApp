import { useEffect, useState } from 'react';
import { StyleSheet, Button, View, Text, SafeAreaView, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import React from 'react';
import { StatusBar } from "expo-status-bar";
import { createTempofyPlaylist, startHashTable, tempofyList } from '../TempoFunctions';
import { tempofyQueue, newUser } from '../ExtraFunctions';
import { newSongHashTable } from '../TempoFunctions';
import TempofyListItem from '../TempofyLIstItem';

export function TempofyScreen({ route }) {
    let intervalPickerList = [];
    let flatListArray = [];
    const navigation = useNavigation();
    const { playlistID } = route.params;
    const [editButton, setEditButton] = useState("Create new Interval Set");
    const [pickerState, setPickerState] = useState('null');
    const [intervalDropdownState, setIntervalDropdownState] = useState(intervalPickerList);
    const [data, setData] = useState(flatListArray);
    const [text, onChangeText] = useState('Enter Playlist Name');

    // Reload Interval Templates when the screen is focused
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            intervalDropdownState.length = 0;
            for (let i = 0; i < newUser.usersIntervalTemplates.length; i++) {
                let newItem = { label: newUser.usersIntervalTemplates[i].getTemplateName(), value: i + 1 };
                intervalDropdownState.push(newItem);
            }
            setIntervalDropdownState([...intervalDropdownState]);
        });
        return unsubscribe;
    }, [navigation]);

    // Render list every second for real-time updating of Tempofy Queue
    useEffect(() => {
        setTimeout(() => {
            renderList()
        }, 1000);
    });

    // Replace a song in the queue by its ID
    const handleReplaceSong = async (id) => {
        let key = tempofyQueue.songArray[id - 1].tempo;
        let song = await newSongHashTable.getSong(key);
        tempofyQueue.songArray[id - 1] = song;
        let newItem = { id: id, text: `Item ${id}`, songTitle: song.songTitle, artist: song.artist, albumImage: song.albumImage, tempo: song.tempo };
        data[id - 1] = newItem;
        setData([...data]);
    };

    // Render a song in the queue
    const renderItem = ({ item }) => (
        <TempofyListItem item={item} onDelete={handleReplaceSong} />
    );

    // Save playlist and go back to the previous screen
    const handleSave = () => {
        createTempofyPlaylist(text);
        navigation.pop();
    };

    // Render Tempofy Queue list
    function renderList() {
        data.length = 0;
        for (let i = 0; i < tempofyQueue.songArray.length; i++) {
            const newId = (i + 1).toString();
            let newItem = { id: newId, text: `Item ${newId}`, songTitle: tempofyQueue.songArray[i].songTitle, artist: tempofyQueue.songArray[i].artist, albumImage: tempofyQueue.songArray[i].albumImage, tempo: tempofyQueue.songArray[i].tempo };
            data.push(newItem);
        }
        setData([...data]);
    }

    // Start the Tempofy flow
    const handleTempofy = async () => {
        await tempofyList(newUser.usersIntervalTemplates[pickerState - 1].intervalArray);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.top}>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={text}
                    placeholder="Enter Playlist Name"
                    placeholderTextColor="#888"
                />
                <View style={styles.dropdownContainer}>
                    <Text style={styles.label}>Interval Type:</Text>
                    <RNPickerSelect
                        onValueChange={async (value) => {
                            setPickerState(value);
                            if (value === 'null') {
                                setEditButton("Create new Interval Set");
                            } else if (value >= 1) {
                                setEditButton("Edit Interval Set");
                                startHashTable(playlistID);
                            }
                        }}
                        items={intervalDropdownState}
                        style={pickerSelectStyles}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Template", { value: pickerState >= 0 ? pickerState - 1 : pickerState })}>
                    <Text style={styles.buttonText}>{editButton}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleTempofy}>
                    <Text style={styles.buttonText}>Tempofy</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                style={styles.list}
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
            <View style={styles.bottom}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

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
    },
    dropdownContainer: {
        marginTop: 20,
    },
    label: {
        color: '#fff',
        marginBottom: 8,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#1DB954',
        paddingVertical: 15,
        borderRadius: 30,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    list: {
        flex: 1,
        marginTop: 20,
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

const pickerSelectStyles = {
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 8,
        color: 'white',
        paddingRight: 30,
        backgroundColor: '#2C2C2C',
    },
    inputAndroid: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 8,
        color: 'white',
        paddingRight: 30,
        backgroundColor: '#2C2C2C',
    },
};

export default TempofyScreen;
