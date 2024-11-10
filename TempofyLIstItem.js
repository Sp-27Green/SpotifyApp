import {Text, StyleSheet, View, PanResponder, TouchableOpacity, Animated, Image} from "react-native";
import { useRef } from "react";
  
export default function TempofyListItem({ item, onDelete }) {
    const translateX = useRef(new Animated.Value(0)).current;
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
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
  
    return (
      <View style={styles.itemContainer}>
        <Animated.View
            style={{
                flex: 1,
                transform: [{ translateX: translateX }],
            }}
        >
            <View style={styles.cell} {...panResponder.panHandlers}>
                <Image source = {{uri: item.albumImage}} style={styles.albumArt}/>
                <View style={styles.info}>
                    <Text style={styles.text}>{item.songTitle}</Text>
                    <Text style={styles.text}>{item.artist}</Text>
                    <Text style={styles.text}>{"Tempo: " + item.tempo}</Text>
                </View>
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDelete(item.id)}
            >
                <Text style={styles.deleteButtonText}>Replace</Text>
            </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
  
const styles = StyleSheet.create({
item: {
    flex: 1,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
},
text:{
    color: "white"
},
itemContainer: {
    width: 400,
    height: 75,
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
albumArt: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
});