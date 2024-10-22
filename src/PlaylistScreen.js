import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentUsersPlaylists } from '../PlaylistsAPIs';
import { startResumePlayback, queueTrack } from '../PlayerAPIs';
import { getUsersSavedAlbums } from '../AlbumAPIs';
import { getUsersSavedTracks } from '../TracksAPIs';

export default function PlaylistScreen() {
  const [playlists, setPlaylists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);

  useEffect(() => {
    // Fetch playlists, albums, and tracks when the component mounts
    async function fetchData() {
      const fetchedPlaylists = await getCurrentUsersPlaylists();
      setPlaylists(fetchedPlaylists.items); 
      setFilteredPlaylists(fetchedPlaylists.items); // Initial filter same as original data

      const fetchedAlbums = await getUsersSavedAlbums();
      setAlbums(fetchedAlbums.items);
      setFilteredAlbums(fetchedAlbums.items); 

      const fetchedTracks = await getUsersSavedTracks();
      setTracks(fetchedTracks.items);
      setFilteredTracks(fetchedTracks.items); 
    }

    fetchData();
  }, []);

  // Function to handle playback
  const handlePlay = async (uri) => {
    await startResumePlayback(uri);
  };

  // Function to queue a track
  const handleQueueTrack = async (uri) => {
    await queueTrack(uri);
  };

  // Function to handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const lowerCaseQuery = query.toLowerCase();

      // Filter playlists, albums, and tracks based on search query
      setFilteredPlaylists(playlists.filter(item => item.name.toLowerCase().includes(lowerCaseQuery)));
      setFilteredAlbums(albums.filter(item => item.album.name.toLowerCase().includes(lowerCaseQuery)));
      setFilteredTracks(tracks.filter(item => item.track.name.toLowerCase().includes(lowerCaseQuery)));
    } else {
      // Reset to original lists if search query is cleared
      setFilteredPlaylists(playlists);
      setFilteredAlbums(albums);
      setFilteredTracks(tracks);
    }
  };

  // Render a playlist, album, or track item
  const renderPlaylistItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePlay(item.uri)} style={styles.item}>
      {item.images[0] && (
        <Image source={{ uri: item.images[0].url }} style={styles.albumArt} />
      )}
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderAlbumItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePlay(item.album.uri)} style={styles.item}>
      {item.album.images[0] && (
        <Image source={{ uri: item.album.images[0].url }} style={styles.albumArt} />
      )}
      <Text style={styles.itemText}>{item.album.name}</Text>
    </TouchableOpacity>
  );

  const renderTrackItem = ({ item }) => (
    <View style={styles.trackItem}>
      <TouchableOpacity onPress={() => handlePlay(item.track.uri)} style={styles.trackPlayButton}>
        <Ionicons name="play-circle-outline" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.trackText}>{item.track.name}</Text>
      <TouchableOpacity onPress={() => handleQueueTrack(item.track.uri)} style={styles.trackQueueButton}>
        <Ionicons name="add-circle-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search playlists, albums, or tracks"
        placeholderTextColor="#b3b3b3"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Playlists Section */}
      <Text style={styles.sectionTitle}>Your Playlists</Text>
      <FlatList
        data={filteredPlaylists}
        keyExtractor={(item) => item.id}
        renderItem={renderPlaylistItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />

      {/* Albums Section */}
      <Text style={styles.sectionTitle}>Your Saved Albums</Text>
      <FlatList
        data={filteredAlbums}
        keyExtractor={(item) => item.album.id}
        renderItem={renderAlbumItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />

      {/* Tracks Section */}
      <Text style={styles.sectionTitle}>Your Saved Tracks</Text>
      <FlatList
        data={filteredTracks}
        keyExtractor={(item) => item.track.id}
        renderItem={renderTrackItem}
        horizontal={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#1DB954',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#fff',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  albumArt: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  itemText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  trackPlayButton: {
    marginRight: 10,
  },
  trackText: {
    color: '#FFFFFF',
    flex: 1,
  },
  trackQueueButton: {
    marginLeft: 10,
  },
});
