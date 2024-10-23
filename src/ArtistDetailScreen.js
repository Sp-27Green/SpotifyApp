import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getArtist, getArtistsTopTracks, getArtistsAlbums, getArtistsRelatedArtists, getArtistsDiscography } from '../ArtistsAPIs';
import { startResumePlayback, queueTrack } from '../PlayerAPIs';

export default function ArtistDetailScreen({ route, navigation }) {
  const { artistId } = route.params;
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [discography, setDiscography] = useState([]);
  const [loading, setLoading] = useState(true);
  const [discographySearch, setDiscographySearch] = useState('');
  const [filteredDiscography, setFilteredDiscography] = useState([]);
  const [showTopTracks, setShowTopTracks] = useState(false);
  const [showRelatedArtists, setShowRelatedArtists] = useState(false);
  const [showDiscography, setShowDiscography] = useState(false);

  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        const artistData = await getArtist(artistId);
        setArtist(artistData);

        const topTracksData = await getArtistsTopTracks(artistId);
        setTopTracks(topTracksData.tracks);

        const albumsData = await getArtistsAlbums(artistId);
        setAlbums(albumsData.items.sort((a, b) => new Date(a.release_date) - new Date(b.release_date)));

        const relatedArtistsData = await getArtistsRelatedArtists(artistId);
        setRelatedArtists(relatedArtistsData.artists);

        const discographyData = await getArtistsDiscography(artistId);
        setDiscography(discographyData.items);
        setFilteredDiscography(discographyData.items);
      } catch (error) {
        console.error('Error fetching artist details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistDetails();
  }, [artistId]);

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

  const handleDiscographySearch = (text) => {
    setDiscographySearch(text);
    if (text) {
      const filtered = discography.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredDiscography(filtered);
    } else {
      setFilteredDiscography(discography);
    }
  };

  const handleAlbumPress = (albumId) => {
    navigation.navigate('AlbumDetail', { albumId });
  };

  const handleArtistPress = (artistId) => {
    navigation.navigate('ArtistDetailScreen', { artistId });
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#1DB954" />
      </TouchableOpacity>

      {loading ? (
        <Text style={styles.loadingText}>Loading artist details...</Text>
      ) : (
        <>
          {artist && (
            <View style={styles.artistInfo}>
              <Image
                source={{ uri: artist?.images?.[0]?.url || 'https://via.placeholder.com/150' }}
                style={styles.artistImage}
              />
              <Text style={styles.artistName}>{artist?.name || 'Unknown Artist'}</Text>
            </View>
          )}

          <View style={styles.albumSection}>
            <Text style={styles.sectionTitle}>Albums</Text>
            <FlatList
              data={albums}
              horizontal
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleAlbumPress(item.id)}>
                  <View style={styles.albumItem}>
                    <Image source={{ uri: item.images[0]?.url }} style={styles.albumImage} />
                    <View style={styles.albumInfo}>
                      <Text style={styles.albumTitle}>{item.name}</Text>
                      {/* <Text style={styles.trackTempo}>Tempo: {item.tempo || 'Unknown'}</Text> */}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>

          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setShowTopTracks(!showTopTracks)}
          >
            <Text style={styles.sectionTitle}>Top Tracks</Text>
            <Ionicons
              name={showTopTracks ? 'chevron-up' : 'chevron-down'}
              size={28}
              color="#FFFFFF"
            />
          </TouchableOpacity>
          {showTopTracks && (
            <View>
              {topTracks.map((item) => (
                <View key={item.id} style={styles.trackItem}>
                  <TouchableOpacity onPress={() => handlePlayTrack(item.uri)}>
                    <Ionicons name="play" size={28} color="#1DB954" />
                  </TouchableOpacity>
                  <View style={styles.trackInfo}>
                    <Text style={styles.trackTitle}>{item.name}</Text>
                    <Text style={styles.trackArtist}>
                      {item.artists?.map(artist => artist.name).join(', ')}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleQueueTrack(item.uri)}>
                    <Ionicons name="add" size={28} color="#1DB954" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setShowDiscography(!showDiscography)}
          >
            <Text style={styles.sectionTitle}>Full Discography</Text>
            <Ionicons
              name={showDiscography ? 'chevron-up' : 'chevron-down'}
              size={28}
              color="#FFFFFF"
            />
          </TouchableOpacity>
          {showDiscography && (
            <>
              <TextInput
                style={styles.searchInput}
                placeholder="Search discography"
                value={discographySearch}
                onChangeText={handleDiscographySearch}
              />
              <View>
                {filteredDiscography.map((item) => (
                  <View key={item.id} style={styles.trackItem}>
                    <TouchableOpacity onPress={() => handlePlayTrack(item.uri)}>
                      <Ionicons name="play" size={28} color="#1DB954" />
                    </TouchableOpacity>
                    <View style={styles.trackInfo}>
                      <Text style={styles.trackTitle}>{item.name}</Text>
                      <Text style={styles.trackArtist}>
                        {item.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist'}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleQueueTrack(item.uri)}>
                      <Ionicons name="add" size={28} color="#1DB954" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </>
          )}

          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setShowRelatedArtists(!showRelatedArtists)}
          >
            <Text style={styles.sectionTitle}>Related Artists</Text>
            <Ionicons
              name={showRelatedArtists ? 'chevron-up' : 'chevron-down'}
              size={28}
              color="#FFFFFF"
            />
          </TouchableOpacity>
          {showRelatedArtists && (
            <View>
              {relatedArtists.map((item) => (
                <TouchableOpacity key={item.id} onPress={() => handleArtistPress(item.id)}>
                  <View style={styles.relatedArtistItem}>
                    <Image source={{ uri: item.images[0]?.url }} style={styles.relatedArtistImage} />
                    <View style={styles.relatedArtistInfo}>
                      <Text style={styles.relatedArtistName}>{item.name}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

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
  artistInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  artistImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  artistName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  albumSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#1DB954',
    fontSize: 28,
    marginBottom: 10,
  },
  albumItem: {
    marginRight: 10,
  },
  albumImage: {
    width: 120,
    height: 120,
    borderRadius: 5,
  },
  albumTitle: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  trackInfo: {
    marginLeft: 10,
    flex: 1,
  },
  trackTitle: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  trackArtist: {
    color: '#AAAAAA',
  },
  relatedArtistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 5,
  },
  relatedArtistImage: {
    width: 120,
    height: 120,
    borderRadius: 50,
    marginRight: 10,
  },
  relatedArtistInfo: {
    flex: 1,
  },
  relatedArtistName: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  searchInput: {
    height: 40,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    color: '#FFFFFF',
  },
});
