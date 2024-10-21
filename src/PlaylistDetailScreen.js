import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllPlaylistItems } from '../PlaylistsAPIs';
import { startResumePlayback, queueTrack } from '../PlayerAPIs';

export default function PlaylistDetailScreen({ route, navigation }) {
  const { playlistId } = route.params;
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylistTracks = async () => {
      try {
        const fetchedTracks = await getAllPlaylistItems(playlistId);
        setTracks(fetchedTracks?.items || []); // Ensure all tracks are shown
      } catch (error) {
        console.error('Error fetching playlist tracks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistTracks();
  }, [playlistId]);

  const handlePlayTrack = async (trackUri) => {
    try {
      await startResumePlayback(trackUri);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const handleQueueTrack = async (trackUri) => {
    try {
      await queueTrack(trackUri);
      console.log('Track queued:', trackUri);
    } catch (error) {
      console.error('Error queuing track:', error);
    }
  };

  const renderTrack = ({ item }) => {
    const track = item.track;

    return (
      <View style={styles.trackItem}>
        <TouchableOpacity onPress={() => handleQueueTrack(track.uri)}>
          <Ionicons name="add" size={24} color="#1DB954" />
        </TouchableOpacity>
        <Image
          source={{ uri: track.album?.images[0]?.url || 'https://via.placeholder.com/50' }}
          style={styles.trackImage}
        />
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle}>{track.name}</Text>
          <Text style={styles.trackArtist}>{track.artists.map(artist => artist.name).join(', ')}</Text>
        </View>
        <TouchableOpacity onPress={() => handlePlayTrack(track.uri)}>
          <Ionicons name="play" size={24} color="#1DB954" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#1DB954" />
      </TouchableOpacity>
      {/* Tempofy Button */}
      <TouchableOpacity style={styles.tempofyButton}
        onPress={()=> {
          navigation.navigate("Tempofy",  {playlistID: playlistId})
        }}
      >
        <Text style={styles.tempofyButtonText}>Tempofy</Text>
      </TouchableOpacity>

      {loading ? (
        <Text style={styles.loadingText}>Loading tracks...</Text>
      ) : (
        <FlatList
          data={tracks}
          renderItem={renderTrack}
          keyExtractor={item => item.track?.id || item.id}
        />
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 10,
  },
  backButton: {
    marginBottom: 10,
  },
  loadingText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 20,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  trackArtist: {
    color: '#AAAAAA',
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
    textAlign: "center",
  },
});
