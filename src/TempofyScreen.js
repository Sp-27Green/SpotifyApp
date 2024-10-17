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

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            intervalDropdownState.length = 0;
            for (var i = 0; i < newUser.usersIntervalTemplates.length; i++) {
                var newItem = { label: newUser.usersIntervalTemplates[i].getTemplateName(), value: i + 1 };
                intervalDropdownState.push(newItem);
            }
            setIntervalDropdownState([...intervalDropdownState]);
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        setTimeout(() => {
            renderList();
        }, 1000);
    });

    useEffect(() => {
        startHashTable(playlistID);
    }, []);

    const handleReplaceSong = async (id) => {
        var key = await tempofyQueue.songArray[id - 1].tempo;
        var song = await newSongHashTable.getSong(key);
        tempofyQueue.songArray[id - 1] = await song;
        var newItem = await { id: id, text: `Item ${id}`, songTitle: song.songTitle, artist: song.artist, albumImage: song.albumImage, tempo: song.tempo };
        data[id - 1] = await newItem;
        await setData([...data]);
    };

    const renderItem = ({ item }) => (
        <TempofyListItem item={item} onDelete={handleReplaceSong} />
    );

    const handleSave = () => {
        createTempofyPlaylist(text);
        navigation.navigate('Player');
    };

    function renderList() {
        data.length = 0;
        for (var i = 0; i < tempofyQueue.songArray.length; i++) {
            const newId = (i + 1).toString();
            var newItem = { id: newId, text: `Item ${newId}`, songTitle: tempofyQueue.songArray[i].songTitle, artist: tempofyQueue.songArray[i].artist, albumImage: tempofyQueue.songArray[i].albumImage, tempo: tempofyQueue.songArray[i].tempo };
            data.push(newItem);
        }
        setData([...data]);
    }

    const handleTempofy = async (value) => {
        const tempofyListResult = await tempofyList(newUser.usersIntervalTemplates[value - 1].intervalArray);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.top}>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={text}
                />
                <View title="Interval Dropdown" style={styles.dropdownContainer}>
                    <Text style={styles.label}>Interval Type:</Text>
                    <RNPickerSelect
                        style={pickerStyles}
                        onValueChange={async (value) => {
                            setPickerState(value);
                            if (value == 'null') {
                                setEditButton("Create new Interval Set");
                            }
                            else if (value >= 1) {
                                setEditButton("Edit Interval Set");
                                handleTempofy(value);
                            }
                        }}
                        items={intervalDropdownState}
                    />
                </View>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={async () => {
                        if (pickerState >= 0 && pickerState != "null") {
                            navigation.navigate("Template", { value: pickerState - 1 });
                        } else {
                            navigation.navigate("Template", { value: pickerState });
                        }
                    }}>
                    <Text style={styles.buttonText}>{editButton}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
                <FlatList
                    style={styles.list}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <StatusBar style="auto" />
            <View style={styles.bottom}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1c1c',
        padding: 20,
    },
    top: {
        backgroundColor: '#2c2c2c',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    input: {
        height: 40,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#fff',
        padding: 10,
        borderRadius: 10,
        color: '#fff',
        backgroundColor: '#3c3c3c',
    },
    dropdownContainer: {
        marginBottom: 20,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 5,
    },
    editButton: {
        backgroundColor: '#1DB954',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: '#1DB954',
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 30,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    list: {
        marginTop: 20,
    },
    bottom: {
        backgroundColor: '#2c2c2c',
        padding: 20,
        borderRadius: 10,
    }
});

const pickerStyles = {
    inputIOS: {
        color: '#fff',
        paddingHorizontal: 10,
        backgroundColor: '#3c3c3c',
        borderRadius: 10,
        height: 40,
    },
    inputAndroid: {
        color: '#fff',
        paddingHorizontal: 10,
        backgroundColor: '#3c3c3c',
        borderRadius: 10,
        height: 40,
    },
};

export default TempofyScreen;
