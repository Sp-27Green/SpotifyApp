import {Text, StyleSheet, View, PanResponder, TouchableOpacity, Animated } from "react-native";
import { useRef,useState, useEffect} from "react";
import RNPickerSelect from 'react-native-picker-select';
import { TempoInterval } from "./TempoIntervalClass";
import { intervalList } from "./ExtraFunctions";
import { getCurrentQueue } from "./TempoFunctions";

export default function TemplateListItem({ item, onDelete,}) {
  
  let newTempoInterval = new TempoInterval();
  const [lowTempoState, setLowTempoState] = useState(item.lowTempo);
  const [highTempoState, setHighTempoState] = useState(item.highTempo);
  const [intervalState, setIntervalState] = useState(item.interval);
  const [songAmountState, setSongAmountState] = useState(item.songAmount);

  var songAmountArray = [];
  var tempoAmountArray = [];

  

  useEffect(() => {    
    newTempoInterval.setLowTempo(lowTempoState);
    newTempoInterval.setHighTempo(highTempoState);
    newTempoInterval.setIntervalType(intervalState);
    newTempoInterval.setSongAmount(songAmountState);
    intervalList[item.id - 1] = newTempoInterval;
  }, [])

  for(var i = 0; i < 100; i++){
    var songAmount = i + 1;
    songAmountArray.push({label: songAmount.toString(), value: songAmount });
  }
  for(var i = 0; i < 20; i++){
    var tempoBottom = (16 + i) * 5;
    var tempoTop = tempoBottom + 4;
    tempoAmountArray.push({label: tempoBottom + "-" + tempoTop, value:tempoBottom});
  }

  

  const translateX = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx < -50) {
            Animated.spring(translateX, {
              toValue: -100,
              useNativeDriver: true,
            }).start();
          } 
          else {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
      })
    ).current;

  function handleUpdateInterval(){
    newTempoInterval.setLowTempo(lowTempoState);
    newTempoInterval.setHighTempo(highTempoState);
    newTempoInterval.setIntervalType(intervalState)
    newTempoInterval.setSongAmount(songAmountState)
    intervalList[item.id - 1] = newTempoInterval;
  }
    
  return (
    <View style={styles.itemContainer}>
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateX: translateX }],
        }}
      >
      <View style={styles.itemContainer}>
         <View title="low" style={styles.item} {...panResponder.panHandlers}>    
            <Text style={styles.text}>Low Tempo:</Text>
            <RNPickerSelect
            style={styles.picker}
              value = {lowTempoState}
                onValueChange={(value) => {
                  if(value <= highTempoState ){
                    setLowTempoState(value);
                    handleUpdateInterval()
                  }
                  else{
                    setLowTempoState(value);
                    setHighTempoState(value);
                    handleUpdateInterval();
                  }
                }}
                items={
                  tempoAmountArray
                }
            />
          </View>
          <View title="high" style={styles.item} {...panResponder.panHandlers}>     
            <Text style={styles.text}>High Tempo:</Text>
            <RNPickerSelect
            style={styles.picker}
            value = {highTempoState}
              onValueChange={(value) => {
                if(value >= lowTempoState){
                  setHighTempoState(value);
                  handleUpdateInterval();
                }
              }}
              items={
                tempoAmountArray
              }
            />
          </View>
          <View title="interval" style={styles.item} {...panResponder.panHandlers}>
            <Text style={styles.text}>Interval Type:</Text>
            <RNPickerSelect
            style={styles.picker}
              value = {intervalState}
              onValueChange={(value) => {
                setIntervalState(value);
                handleUpdateInterval();
              }}
              items={
                [
                  { label: 'Increase', value: 'increase' },
                  { label: 'Random', value: 'random'},
                  { label: 'Decrease', value: 'decrease' },
                ]
              }
            />
          </View>
          <View title="song" style={styles.item} {...panResponder.panHandlers}>   
            <Text style={styles.text}>Song amount:</Text>
            <RNPickerSelect
            style={styles.picker}
              value = {songAmountState}   
              onValueChange={(value) => {
                setSongAmountState(value);
                handleUpdateInterval()   
              }}
              items={
                songAmountArray
              }
            />        
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            onDelete(item.id);
            intervalList.splice(item.id - 1, 1 )
          }}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

  
  
const styles = StyleSheet.create({
  item: {
    flex: 1,
    padding: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "column",
    color: "white"
    
    
  },
  itemContainer: {
    flexDirection: "row",
    
  },
  deleteButton: {
    width: 100,
    height: "100%",
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: -100,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  picker: {
    inputIOS: {
      fontSize: 12,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: 'black',
      backgroundColor: "#1DB954",
      borderRadius: 8,
      color: 'white',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    },
    text:{
      textAlign: "center",
      color: "white"
  },
});