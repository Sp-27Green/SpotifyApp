import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { search } from '../SearchAPIs';
import { startResumePlayback, queueTrack } from '../PlayerAPIs';
import { getAlbumTracks } from '../AlbumAPIs';
import { getPlaylistTracks } from '../PlaylistsAPIs';

export default function SearchScreen({ navigation }) {
  const [searchString, setSearchString] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [filter, setFilter] = useState('all'); // Added filter state

  const handleSearch = async () => {
    if (searchString) {
      setLoading(true);
      try {
        const response = await search(searchString);
        if (response) {
          let combinedResults = [
            ...(response.tracks?.items || []),
            ...(response.albums?.items || []),
            ...(response.playlists?.items || []),
            ...(response.artists?.items || []),
          ];

          // Apply filter to search results
          if (filter === 'songs') combinedResults = response.tracks?.items || [];
          if (filter === 'albums') combinedResults = response.albums?.items || [];
          if (filter === 'playlists') combinedResults = response.playlists?.items || [];
          if (filter === 'artists') combinedResults = response.artists?.items || [];

          setResults(combinedResults);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
      setLoading(false);
    }
  };

  // Filter the results after they have been fetched
  const getFilteredResults = () => {
    if (filter === 'all') {
      return results;
    }
    return results.filter((item) => {
      if (filter === 'songs' && item.type === 'track') return true;
      if (filter === 'albums' && item.type === 'album') return true;
      if (filter === 'playlists' && item.type === 'playlist') return true;
      if (filter === 'artists' && item.type === 'artist') return true;
      return false;
    });
  };

  const handleAlbumPress = (albumId) => {
    navigation.navigate('AlbumDetail', { albumId });
  };

  const handlePlaylistPress = (playlistId) => {
    navigation.navigate('PlaylistDetailScreen', { playlistId });
  };

  const handleArtistPress = (artistId) => {
    navigation.navigate('ArtistDetailScreen', { artistId });
  };

  const handleQueue = async (item) => {
    try {
      await queueTrack(item.uri);
      console.log(`Queued: ${item.name}`);
    } catch (error) {
      console.error('Error queuing track:', error);
    }
  };

  const handleQueueAlbumTracks = async (albumId) => {
    try {
      const albumTracks = await getAlbumTracks(albumId);
      if (albumTracks && albumTracks.items) {
        const trackUris = albumTracks.items.map(track => track.uri);
        await Promise.all(trackUris.map(uri => queueTrack(uri)));
        console.log(`Queued all tracks from album: ${albumId}`);
      } else {
        console.error('No tracks found in the album.');
      }
    } catch (error) {
      console.error('Error queuing album tracks:', error);
    }
  };

  const handleQueuePlaylistTracks = async (playlistId) => {
    try {
      const playlistTracks = await getPlaylistTracks(playlistId);
      const trackUris = playlistTracks.items.map(track => track.track.uri);
      await Promise.all(trackUris.map(uri => queueTrack(uri)));
      console.log(`Queued all tracks from playlist: ${playlistId}`);
    } catch (error) {
      console.error('Error queuing playlist tracks:', error);
    }
  };

  const handlePlay = async (item) => {
    try {
      await startResumePlayback(item.uri);
      setPlayingTrackId(item.id);
    } catch (error) {
      console.error('Error starting playback:', error);
    }
  };

  const renderSong = (item) => (
    <View style={styles.cell}>
      <TouchableOpacity style={styles.queueButton} onPress={() => handleQueue(item)}>
        <Ionicons name="add" size={24} color="#1DB954" />
      </TouchableOpacity>
      <Image
        source={{ uri: item.album?.images[0]?.url || 'https://via.placeholder.com/50' }}
        style={styles.albumArt}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.artist}>{item.artists?.map(artist => artist.name).join(', ')}</Text>
      </View>
      <TouchableOpacity style={styles.playButton} onPress={() => handlePlay(item)}>
        <Ionicons name="play" size={24} color="#1DB954" />
      </TouchableOpacity>
    </View>
  );

  const renderAlbum = (item) => (
    <View style={styles.cell}>
      <TouchableOpacity style={styles.queueButton} onPress={() => handleQueueAlbumTracks(item.id)}>
        <Ionicons name="add" size={24} color="#1DB954" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.cell} onPress={() => handleAlbumPress(item.id)}>
        <Image source={{ uri: item.images[0]?.url }} style={styles.albumArt} />
        <View style={styles.info}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.artist}>{item.artists?.map(artist => artist.name).join(', ')}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderPlaylist = (item) => (
    <View style={styles.cell}>
      <TouchableOpacity style={styles.queueButton} onPress={() => handleQueuePlaylistTracks(item.id)}>
        <Ionicons name="add" size={24} color="#1DB954" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.cell} onPress={() => handlePlaylistPress(item.id)}>
        <Image source={{ uri: item.images[0]?.url }} style={styles.albumArt} />
        <View style={styles.info}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.artist}>{item.owner?.display_name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderArtist = (item) => (
    <View style={styles.cell}>
      <TouchableOpacity style={styles.cell} onPress={() => handleArtistPress(item.id)}>
        <Image source={{ uri: item.images[0]?.url || 'https://via.placeholder.com/50' }} style={styles.albumArt} />
        <View style={styles.info}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.artist}>Artist</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for songs, albums, playlists, or artists"
        value={searchString}
        onChangeText={setSearchString}
        onSubmitEditing={handleSearch}
      />
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setFilter('all')} style={filter === 'all' ? styles.filterButtonActive : styles.filterButton}>
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('songs')} style={filter === 'songs' ? styles.filterButtonActive : styles.filterButton}>
          <Text style={styles.filterText}>Songs</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('albums')} style={filter === 'albums' ? styles.filterButtonActive : styles.filterButton}>
          <Text style={styles.filterText}>Albums</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('playlists')} style={filter === 'playlists' ? styles.filterButtonActive : styles.filterButton}>
          <Text style={styles.filterText}>Playlists</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('artists')} style={filter === 'artists' ? styles.filterButtonActive : styles.filterButton}>
          <Text style={styles.filterText}>Artists</Text>
        </TouchableOpacity>
      </View>
      {loading ? <Text style={styles.loadingText}>Loading...</Text> : null}
      <FlatList
        data={getFilteredResults()}
        renderItem={({ item }) => {
          if (item.type === 'album') return renderAlbum(item);
          if (item.type === 'playlist') return renderPlaylist(item);
          if (item.type === 'track') return renderSong(item);
          if (item.type === 'artist') return renderArtist(item);
        }}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  searchInput: {
    height: 40,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 20, 
    paddingHorizontal: 15,
    margin: 10,
    color: '#FFFFFF',
    backgroundColor: '#2A2A2A', 
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  filterButtonActive: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1DB954',
  },
  filterText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
  title: {
    color: '#FFFFFF',
  },
  artist: {
    color: '#AAAAAA',
  },
  tempo: {
    color: '#AAAAAA',
    fontStyle: 'italic',
  },
  queueButton: {
    marginRight: 10,
  },
  playButton: {
    marginLeft: 'auto',
  },
  loadingText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 20,
  },
});
