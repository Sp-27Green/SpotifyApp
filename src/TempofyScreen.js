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

//navigation to Tempofy page, 
//the call must look like this 
//navigation.navigate("Tempofy",  {value: playlistID})
//where playlistID is the the id for the playlist in Spotify, example: "6vlXUJKBK4DKYLXMP4Xk3s"
//or playlist id is "queue" for pulling the queue from the player page.
export function TempofyScreen({ route }) {
    //Sets the Interval Picker List to a blank array on load. So we can update it with the list of the user's Interval Templates.
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

    //Creates the Hashtable on load. 
    useEffect(() => {
        startHashTable(playlistID)
    }, [])

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

    //Handles the start of the tempofy flow.  This will pull the songs needed into the Tempofy queue. 
    const  handleTempofy =  async  () => {
        const tempofyListResult = await  tempofyList(newUser.usersIntervalTemplates[pickerState - 1].intervalArray);
    }
  

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
                        onValueChange={ async (value) => {
                            setPickerState(value)
                            templateIndex = value;
                            if(value == 'null'){
                                setEditButton("Create new Interval Set")
                            }
                            else if(value >= 1){
                                setEditButton("Edit Interval Set")
                                startHashTable(playlistID)
                            }
                        }}
                        items={intervalDropdownState}
                        style={pickerSelectStyles}
                    />
                </View>
                <Button
                title = {editButton}
                onPress={async () => {
                    if( pickerState >= 0 && pickerState != "null"){
                        navigation.navigate("Template",  {value: pickerState - 1})
                    }
                    else {
                        navigation.navigate("Template",  {value: pickerState})
                    }
                }}
                />
                <Button
                    title = "Tempofy"
                    onPress={async () => {
                        if(pickerState == 'create'){
                            navigation.navigate("Template")
                        }
                        else if(pickerState == 'null' || pickerState == " "){
                        //do nothing
                        }
                        else{
                            handleTempofy();
                        }
                    }}
                />
            </View>
            
            <FlatList
                style={styles.list}
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
            <StatusBar style="auto" />
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
