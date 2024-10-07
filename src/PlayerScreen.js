import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { nextSong } from '../PlayerAPIs';

export default function PlayerScreen() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);  // State to control modal(queue sheet) visibility

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    nextSong()
  };

  const handleNextSong = () => {
    console.log("Next song");
  };

  const handleToggleModal = () => {
    setIsModalVisible(!isModalVisible);  // Toggle modal visibility
  };

  const albumCoverUrl = 'https://vanderbilthustler.com/wp-content/uploads/2023/02/VH-Album-Covers-1.png';  // Album cover I found online

  // Example playlist data (20 artificial songs just so I can have enough songs to scroll through the queue/playlist queue)
  const playlist = [
    { title: 'Song 1', artist: 'Artist 1', album: 'Album 1' },
    { title: 'Song 2', artist: 'Artist 2', album: 'Album 2' },
    { title: 'Song 3', artist: 'Artist 3', album: 'Album 3' },
    { title: 'Song 4', artist: 'Artist 4', album: 'Album 4' },
    { title: 'Song 5', artist: 'Artist 5', album: 'Album 5' },
    { title: 'Song 6', artist: 'Artist 6', album: 'Album 6' },
    { title: 'Song 7', artist: 'Artist 7', album: 'Album 7' },
    { title: 'Song 8', artist: 'Artist 8', album: 'Album 8' },
    { title: 'Song 9', artist: 'Artist 9', album: 'Album 9' },
    { title: 'Song 10', artist: 'Artist 10', album: 'Album 10' },
    { title: 'Song 11', artist: 'Artist 11', album: 'Album 11' },
    { title: 'Song 12', artist: 'Artist 12', album: 'Album 12' },
    { title: 'Song 13', artist: 'Artist 13', album: 'Album 13' },
    { title: 'Song 14', artist: 'Artist 14', album: 'Album 14' },
    { title: 'Song 15', artist: 'Artist 15', album: 'Album 15' },
    { title: 'Song 16', artist: 'Artist 16', album: 'Album 16' },
    { title: 'Song 17', artist: 'Artist 17', album: 'Album 17' },
    { title: 'Song 18', artist: 'Artist 18', album: 'Album 18' },
    { title: 'Song 19', artist: 'Artist 19', album: 'Album 19' },
    { title: 'Song 20', artist: 'Artist 20', album: 'Album 20' },
  ];

  // Function to render each item in the queue
  const renderQueueItem = ({ item }) => (
    <View style={styles.queueItem}>
      <Text style={styles.queueItemText}>{item.title} - {item.artist}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Now Playing</Text>

      <Image
        source={{ uri: albumCoverUrl }}
        style={styles.albumArt}
        onError={(e) => console.error('Failed to load album cover', e.nativeEvent.error)}
      />

      <Text style={styles.trackTitle}>Track Title</Text>
      <Text style={styles.trackArtist}>Artist Name</Text>

      {/* Playback Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={handleNextSong}>
          <Ionicons name="play-skip-back" size={48} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePlayPause}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={64} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextSong}>
          <Ionicons name="play-skip-forward" size={48} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tempofy Button */}
      <TouchableOpacity style={styles.tempofyButton}>
        <Text style={styles.tempofyButtonText}>Tempofy</Text>
      </TouchableOpacity>

      {/* Queue Button */}
      <TouchableOpacity
        style={styles.queueButton}
        onPress={handleToggleModal}  // Open the modal when the button is pressed
      >
        <Ionicons name="list" size={24} color="white" />
        <Text style={styles.queueButtonText}>View Queue</Text>
      </TouchableOpacity>

      {/* Modal for Queue */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleToggleModal}  // Close the modal when button is pressed
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.queueTitle}>Queue</Text>

            {/* Playlist inside the modal */}
            <FlatList
              data={playlist}
              renderItem={renderQueueItem}
              keyExtractor={(item, index) => index.toString()}
            />

            {/* Close button */}
            <TouchableOpacity onPress={handleToggleModal} style={styles.closeButton}>
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
  },
  albumArt: {
    width: 250,
    height: 250,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#333',
  },
  trackTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  trackArtist: {
    fontSize: 18,
    color: '#AAAAAA',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    alignItems: 'center',
    marginBottom: 40,
  },
  tempofyButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 20,
  },
  tempofyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  queueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1DB954',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 20,
  },
  queueButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Dimmed background
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',  // Modal occupies 80% of the screen
  },
  queueTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  queueItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  queueItemText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 20,
  },
});
