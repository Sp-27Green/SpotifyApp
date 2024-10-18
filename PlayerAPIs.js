//Used for the Categories Spotify APIs

import { storeData, newUser } from './ExtraFunctions';

global.Buffer = require('buffer').Buffer;

//Retrieves the playback state of the player and returns the JSON. 
export async function getPlaybackState() {
    if (Date.now() > newUser.getExpiresIn()) {
        await refreshUserToken();
    }

    let playbackState = "";
    await fetch('https://api.spotify.com/v1/me/player', {
        method: "GET",
        headers: {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
        .then(response => response.json())
        .then(responseJson => {
            playbackState = responseJson;
            console.log('Playback state:', responseJson); // Debugging info
        })
        .catch(error => {
            console.error('Error fetching playback state:', error);
        });

    return playbackState;
}

// Function to call a GET API to retrieve devices. Only retrieves the first device.
export async function getPlayer() {
    if (Date.now() > newUser.getExpiresIn()) {
        await refreshUserToken();
    }

    await fetch('https://api.spotify.com/v1/me/player/devices', {
        headers: {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
        .then(response => response.json())
        .then(responseJson => {
            if (responseJson.devices && responseJson.devices.length > 0) {
                const firstDevice = responseJson.devices[0];
                if (firstDevice.id) {
                    newUser.setCurrentPlayer(firstDevice.id);
                    storeData(newUser.getUserName(), JSON.stringify(newUser));
                } else {
                    console.error('Device ID not found.');
                }
            } else {
                console.error('No devices found.');
            }
        })
        .catch(error => {
            console.error('Error fetching devices:', error);
        });
}

// Function to skip to the next song on the current player.
export const nextSong = async () => {
    if (Date.now() > newUser.getExpiresIn()) {
        await refreshUserToken();
    }

    const currentPlayer = newUser.getCurrentPlayer();
    if (currentPlayer) {
        fetch('https://api.spotify.com/v1/me/player/next?device_id=' + currentPlayer, {
            method: "POST",
            headers: {
                'Authorization': "Bearer " + newUser.getAccessToken(),
            }
        })
            .catch(error => {
                console.error('Error skipping to the next song:', error);
            });
    } else {
        console.error('No current player device ID available.');
    }
};

// Retrieves the currently playing track and returns the JSON.
export async function getCurrentlyPlayingTrack() {
    if (Date.now() > newUser.getExpiresIn()) {
        await refreshUserToken();
    }

    let currentlyPlayingTrack = "";
    await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        method: "GET",
        headers: {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
        .then(response => response.json())
        .then(responseJson => {
            currentlyPlayingTrack = responseJson;
            console.log('Currently playing track:', responseJson); // Debugging info
        })
        .catch(error => {
            console.error('Error fetching currently playing track:', error);
        });

    return currentlyPlayingTrack;
}

// Starts or resumes playback based on the sent URI during the call. 
export async function startResumePlayback(uri) {
    if (Date.now() > newUser.getExpiresIn()) {
        await refreshUserToken();
    }

    let bodyString = {};
    if (uri && uri[8] === 't') {
        // If the URI corresponds to a track, use the "uris" field
        bodyString = { "uris": [uri] };
    } else if (uri) {
        // If the URI is a context, use "context_uri"
        bodyString = { "context_uri": uri };
    }

    fetch("https://api.spotify.com/v1/me/player/play?device_id=" + newUser.getCurrentPlayer(), {
        method: "PUT",
        headers: {
            'Authorization': "Bearer " + newUser.getAccessToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyString)
    })
        .then(response => console.log('Playback started/resumed', response))
        .catch(error => {
            console.error('Error starting/resuming playback:', error);
        });
}

// Pauses playback of the player.
export async function pausePlayback() {
    if (Date.now() > newUser.getExpiresIn()) {
        await refreshUserToken();
    }

    fetch("https://api.spotify.com/v1/me/player/pause?device_id=" + newUser.getCurrentPlayer(), {
        method: "PUT",
        headers: {
            'Authorization': "Bearer " + newUser.getAccessToken(),
            'Content-Type': 'application/json'
        },
    })
        .then(response => console.log('Playback paused', response))
        .catch(error => {
            console.error('Error pausing playback:', error);
        });
}

// Sets the position of the track in milliseconds.
export async function seekToPosition(time) {
    if (Date.now() > newUser.getExpiresIn()) {
        await refreshUserToken();
    }

    fetch("https://api.spotify.com/v1/me/player/seek?device_id=" + newUser.getCurrentPlayer() + "&position_ms=" + time, {
        method: "PUT",
        headers: {
            'Authorization': "Bearer " + newUser.getAccessToken(),
            'Content-Type': 'application/json'
        },
    })
        .then(response => console.log('Seeked to position', response))
        .catch(error => {
            console.error('Error seeking to position:', error);
        });
}

// Skips to the previous song on the player.
export async function skipToPrevious() {
    if (Date.now() > newUser.getExpiresIn()) {
        await refreshUserToken();
    }

    fetch('https://api.spotify.com/v1/me/player/previous?device_id=' + newUser.getCurrentPlayer(), {
        method: "POST",
        headers: {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
        .catch(error => {
            console.error('Error skipping to the previous song:', error);
        });
}

// Sets the repeat mode of the player.
export async function setRepeatMode(context) {
    if (Date.now() > newUser.getExpiresIn()) {
        await refreshUserToken();
    }

    fetch('https://api.spotify.com/v1/me/player/repeat?device_id=' + newUser.getCurrentPlayer() + '&state=' + context, {
        method: "PUT",
        headers: {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
        .catch(error => {
            console.error('Error setting repeat mode:', error);
        });
}

// Toggles playback shuffle on the player.
export async function togglePlaybackShuffle(context) {
    if (Date.now() > newUser.getExpiresIn()) {
        await refreshUserToken();
    }

    fetch('https://api.spotify.com/v1/me/player/shuffle?device_id=' + newUser.getCurrentPlayer() + '&state=' + context, {
        method: "PUT",
        headers: {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
        .catch(error => {
            console.error('Error toggling playback shuffle:', error);
        });
}

// Retrieves the user's current queue and returns the JSON.
export async function getTheUsersQueue() {
    if (Date.now() > newUser.getExpiresIn()) {
        await refreshUserToken();
    }

    let usersQueue = "";
    await fetch('https://api.spotify.com/v1/me/player/queue', {
        method: "GET",
        headers: {
            'Authorization': "Bearer " + newUser.getAccessToken(),
        }
    })
        .then(response => response.json())
        .then(responseJson => {
            usersQueue = responseJson;
            console.log('User queue:', responseJson); // Debugging info
        })
        .catch(error => {
            console.error('Error fetching user queue:', error);
        });

    return usersQueue;
}

// Function to queue a track in the user's playback queue.
export async function queueTrack(uri) {
    if (Date.now() > newUser.getExpiresIn()) {
        await refreshUserToken();
    }

    if (!uri) {
        console.error('No URI provided for queuing the track.');
        return;
    }

    fetch(`https://api.spotify.com/v1/me/player/queue?uri=${uri}`, {
        method: "POST",
        headers: {
            'Authorization': "Bearer " + newUser.getAccessToken(),
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (response.ok) {
                console.log('Track queued successfully');
            } else {
                console.error('Failed to queue track:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error queuing track:', error);
        });
}

export async function getAllPlaylistItems(playlistID) {
    if (Date.now() > newUser.getExpiresIn()) {
        refreshUserToken();
    }
    let playlistItemsJSON = [];
    let nextUrl = 'https://api.spotify.com/v1/playlists/' + playlistID + '/tracks';

    while (nextUrl) {
        await fetch(nextUrl, {
            method: "GET",
            headers: {
                'Authorization': "Bearer " + newUser.getAccessToken(),
            }
        })
        .then((response) => response.json())
        .then((responseJson) => {
            playlistItemsJSON = [...playlistItemsJSON, ...responseJson.items];
            nextUrl = responseJson.next;
        })
        .catch((error) => {
            console.error('Error fetching playlist items:', error);
            nextUrl = null;
        });
    }
    return { items: playlistItemsJSON };
}