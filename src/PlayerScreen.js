import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentlyPlayingTrack, pausePlayback, nextSong, skipToPrevious } from '../PlayerAPIs'; // Import APIs

export default function PlayerScreen() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);  // State to control modal(queue sheet) visibility

  useEffect(() => {
    fetchCurrentlyPlaying();
  }, []);

  const fetchCurrentlyPlaying = async () => {
    const track = await getCurrentlyPlayingTrack(); // Fetch currently playing track from Spotify
    if (track && track.item) {
      setCurrentTrack(track.item); // Set track information
      setIsPlaying(!track.is_playing); // Update play/pause state based on Spotify
    }
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      await pausePlayback(); // Pause playback
    } else {
      await nextSong(); // Resume playback
    }
    setIsPlaying(!isPlaying); // Toggle play/pause state
  };

  const handleNextSong = async () => {
    await nextSong(); // Skip to next track
    fetchCurrentlyPlaying(); // Fetch new track info after skipping
  };

  const handlePreviousSong = async () => {
    await skipToPrevious(); // Go back to previous track
    fetchCurrentlyPlaying(); // Fetch new track info after skipping back
  };

  const handleToggleModal = () => {
    setIsModalVisible(!isModalVisible);  // Toggle modal visibility
  };

  // Example playlist data (20 artificial songs just so I can have enough songs to scroll through the queue/playlist queue)
  const playlist = [
    { title: 'Song 1', artist: 'Artist 1', album: 'Album 1' },
    // ... more songs
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

      {currentTrack && (
        <View>
          <Image
            source={{ uri: currentTrack.album.images[0].url }}
            style={styles.albumArt}
            onError={(e) => console.error('Failed to load album cover', e.nativeEvent.error)}
          />
          <Text style={styles.trackTitle}>{currentTrack.name}</Text>
          <Text style={styles.trackArtist}>{currentTrack.artists.map(artist => artist.name).join(', ')}</Text>
        </View>
      )}

      {/* Playback Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={handlePreviousSong}>
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
