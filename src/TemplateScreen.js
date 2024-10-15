import { useEffect, useState } from 'react';
import {StyleSheet, Button, View, SafeAreaView, TextInput, FlatList} from 'react-native';
import { StatusBar } from "expo-status-bar";
import React  from 'react';
import { useNavigation } from '@react-navigation/native';
import {  newUser, intervalList } from '../ExtraFunctions';
import { TempoInterval } from '../TempoIntervalClass';
import { TempoIntervalTemplate } from '../TempoIntervalTemplateClass';
import TemplateListItem from "../TemplateListItems.js"

var flatListArray = [];

export const TemplateScreen = ({ route }) => { 
    const {value} = route.params;
    const navigation = useNavigation();
    const [data, setData] = useState(flatListArray);
  
    if(value != -1 && value != "null"){
        interval = newUser.usersIntervalTemplates[value];
        intervalName = interval.getTemplateName();
        intervalArray = interval.intervalArray;
    }
    else{
        intervalName = 'Enter Interval Template Name';
    }
    const [text, onChangeText] = useState(intervalName);

    useEffect(() => {
        intervalList.length = 0;
        flatListArray.length = 0;
        if(value != -1 && value != "null"){
            for(var i = 0; i < intervalArray.length; i++){
                const newId =  (i + 1).toString();
                var newItem =  { id:  newId, text:  `Item ${newId}`, userTemplate:  value, lowTempo:  intervalArray[i].lowTempo, highTempo:   intervalArray[i].highTempo, interval:  intervalArray[i].getIntervalType(), songAmount:  intervalArray[i].getSongAmount() };
                intervalList.push(intervalArray[i]);
                data.push(newItem);
            }
        }
        setData([...data]);
    }, [])

    const handleDeleteItem = (id) => {
        const updatedData = data.filter((item) => item.id !== id);
        if(data.length > 0){
            for(var i = 0; i < data.length; i++){
                var newId = (i + 1).toString();
                data[i].id = newId;
                data[i].text = `Item ${newId}`;
            }
        }
        setData(updatedData);
    };

    const renderItem = ({ item }) => (
        <TemplateListItem item={item} onDelete={handleDeleteItem}  />
    );

    const handleAddItem = () => {
        const newId = data.length + 1
        const newItem = { id: newId, text: "Item " + newId, userTemplate:  value, lowTempo:  80, highTempo:  80, interval:  "increase", songAmount:  1 };
        newInterval = new TempoInterval()
        intervalList.push(newInterval)
        setData([...data, newItem]); 
    };
  
    const handleSave = (item) => {
        var tempoTemplate = new TempoIntervalTemplate(text);
        if(value == "null" || value == -1){
            newUser.usersIntervalTemplates.push(tempoTemplate);
            Object.assign(newUser.usersIntervalTemplates[newUser.usersIntervalTemplates.length - 1].intervalArray, intervalList);
        }
        else {
            newUser.usersIntervalTemplates[value].setTemplateName(text);
            Object.assign(newUser.usersIntervalTemplates[value].intervalArray, intervalList);
        }
        navigation.pop();
    };
  
    return (
        <SafeAreaView style=
            {[
            styles.container,
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
                    <Button
                        title = "Add interval"
                        onPress={handleAddItem}
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



  
  
  
  