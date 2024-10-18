import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { startResumePlayback, queueTrack } from '../PlayerAPIs';
import { getAlbum } from '../AlbumAPIs';

export default function AlbumDetail({ route, navigation }) {
  const { albumId } = route.params;
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [playingTrackId, setPlayingTrackId] = useState(null); 

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        const albumData = await getAlbum(albumId);
        if (albumData) {
          setAlbum(albumData);
          setTracks(albumData.tracks.items);
        } else {
          console.error('No album data returned');
        }
      } catch (error) {
        console.error('Error fetching album details:', error);
      }
    };

    fetchAlbumDetails();
  }, [albumId]);

  const handlePlay = async (item) => {
    try {
      await startResumePlayback(item.uri);
      setPlayingTrackId(item.id);
    } catch (error) {
      console.error('Error starting playback:', error);
    }
  };

  const handleQueue = async (item) => {
    try {
      await queueTrack(item.uri);
      console.log(`Queued: ${item.name}`);
    } catch (error) {
      console.error('Error queuing track:', error);
    }
  };

  const renderTrackItem = ({ item }) => (
    <View style={styles.trackItem}>
      <TouchableOpacity style={styles.queueButton} onPress={() => handleQueue(item)}>
        <Ionicons name="add" size={24} color="#1DB954" />
      </TouchableOpacity>
      <Text style={styles.trackTitle}>{item.name}</Text>
      <TouchableOpacity style={styles.playButton} onPress={() => handlePlay(item)}>
        <Ionicons name="play" size={24} color="#1DB954" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#1DB954" />
      </TouchableOpacity>

      {album ? (
        <View style={styles.albumInfo}>
          <Image source={{ uri: album.images[0]?.url }} style={styles.albumCover} />
          <Text style={styles.albumTitle}>{album.name}</Text>
          <Text style={styles.artistName}>{album.artists.map(artist => artist.name).join(', ')}</Text>
        </View>
      ) : (
        <Text style={styles.loadingText}>Loading album details...</Text>
      )}

      <FlatList
        data={tracks}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
        scrollIndicatorInsets={{ right: 1 }} 
        showsVerticalScrollIndicator={true} 
      />
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
  albumInfo: {
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
  albumCover: {
    width: 150,
    height: 150,
    borderRadius: 5,
    marginBottom: 10,
  },
  albumTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  artistName: {
    color: '#AAAAAA',
    fontSize: 16,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  playButton: {
    marginRight: 10,
  },
  queueButton: {
    marginLeft: 'auto',
  },
  trackTitle: {
    flex: 1,
    color: '#FFFFFF',
  },
  flatListContent: {
    paddingBottom: 100,
  },
});
