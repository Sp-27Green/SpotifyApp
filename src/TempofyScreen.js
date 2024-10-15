import { useEffect, useState } from 'react';
import {StyleSheet, Button, View, Text, SafeAreaView, TextInput, FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import React  from 'react';
import { StatusBar } from "expo-status-bar";
import { createTempofyPlaylist, startHashTable, tempofyList } from '../TempoFunctions';
import { tempofyQueue, newUser } from '../ExtraFunctions';
import { newSongHashTable } from '../TempoFunctions';
import TempofyListItem from '../TempofyListItem';

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
    //List of states needed. 
    const {playlistID} = route.params;
    const [editButton, setEditButton] = useState( "Create new Interval Set");
    const [pickerState, setPickerState] = useState('null');
    const[intervalDropdownState, setIntervalDropdownState] = useState(intervalPickerList);
    const [data, setData] = useState(flatListArray);
    const [text, onChangeText] = useState('Enter Playlist Name');
  
    //This useEffect will run everytime the TempofyScreen is navigated to.  
    //This helps reload the names of the interval in the picker dropdown. 
    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () =>{
            //Set the intervalTemplate 
            intervalDropdownState.length = 0;
            //Loops throught the User's Interval Templates, and loads the name and index into the intervalDropdownState
            for(var i = 0; i < newUser.usersIntervalTemplates.length; i++){
                var newItem = {label: newUser.usersIntervalTemplates[i].getTemplateName(), value: i + 1};
                intervalDropdownState.push(newItem);
            }
            setIntervalDropdownState([...intervalDropdownState]);
        })
        return unsubscribe;
    }, [navigation]);

    //Use effect re-renders the page every second.  
    //This is used when printing the tempofy queue.
    //The queue may be very large and take a while to print.  
    //So this will re-render the page to show the tempofy queue as songs are being added to the queue.
    useEffect(() => {
        setTimeout(() => {
            renderList()
        }, 1000);
    });

    //Function is used to replace song in the queue.
    //ID is used from the list to find the correct index of the queue.
    const handleReplaceSong = async  (id) => {
        //Tempo is pulled from the song that needs replaced. 
        var key = await tempofyQueue.songArray[id - 1].tempo;
        //New song is pulled from the hash table using the key. 
        var song = await newSongHashTable.getSong(key);
        //New song is inserted into the tempofy queue and the flatlist data depending the onn the id given. 
        tempofyQueue.songArray[id - 1] = await song;
        var newItem =  await { id:  id, text:  `Item ${id}`, songTitle:  song.songTitle, artist:  song.artist, albumImage:  song.albumImage, tempo:  song.tempo};
        data[id - 1] = await newItem;
        //data is updated. 
        await setData([...data]);
    };

    //Renders the item that will be inserted to the list. 
    const renderItem = ({ item }) => (
        <TempofyListItem item={item} onDelete={handleReplaceSong} />
    );

    //Handle Save will call the createTempofyPlaylist function to save the Playlist to Spotify.
    //Then pops back to the previous screen. 
    const handleSave = () => {
        createTempofyPlaylist(text);
        navigation.pop();
    };

    //Function is called by the use effect to render each item in the flat list. 
    //The items are the songs in the tempofy queue. 
    function renderList(){
        //Set data length to zero.
        data.length = 0;
        //Loop through the song array in Tempofy Queue object. 
        for(var i = 0; i < tempofyQueue.songArray.length; i++){
            //For each element create new id for the Flatlist, create item for the flatlist, and push to data. 
            const newId =  (i + 1).toString();
            var newItem =  { id:  newId, text:  `Item ${newId}`, songTitle:  tempofyQueue.songArray[i].songTitle, artist:  tempofyQueue.songArray[i].artist, albumImage:  tempofyQueue.songArray[i].albumImage, tempo:  tempofyQueue.songArray[i].tempo};
            data.push(newItem);
        }
        //set the items created to the data state.
        setData([...data]);
    }

    //Handles the start of the tempofy flow.  This will pull the songs needed into the Tempofy queue. 
    const  handleTempofy =  async  () => {
        const tempofyListResult = await  tempofyList(newUser.usersIntervalTemplates[pickerState - 1].intervalArray);
    }
  

    return (
        <SafeAreaView 
            style={[styles.container,
                {
                
                    flexDirection: 'column',
                },
            ]}>
            <View style={styles.top}>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={text}
                />
                <View title="Interval Dropdwon" style={styles.item} >
                    <Text>Interval Type:</Text>
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
                        items={
                            intervalDropdownState
                        }
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
                    <Button 
                        title = "Save"
                        onPress={handleSave}
                    />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  scrollView: {
    backgroundColor: 'white',
    
  },
  top:{
    backgroundColor: '#bfc0c6',
  },
  bottom:{
   
    backgroundColor: '#bfc0c6',
  }, 
  container:{
          flex: 1,
      padding: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    margin: 2,
    borderColor: '#2a4944',
    borderWidth: 1,
    backgroundColor: '#d2f7f1'
 },


 list: {
   
  alignSelf: "stretch",
},
});










    
  
  

  
  
  
  