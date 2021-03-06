'use strict';

var McFly            = require('../utils/mcfly')
var SoundCloud       = require('../utils/soundcloud')

var CurrenTrackStore = require('../stores/currentTrackStore')

var actions

window.require('ipc').on('GlobalShortcuts', function(accelerator) {
  switch (accelerator) {

    case 'MediaPlayPause':
      if (CurrenTrackStore.getAudio().paused)
        actions.playTrack()
      else
        actions.pauseTrack()
      break

    case 'MediaPreviousTrack':
      actions.previousTrack()
      break

    case 'MediaNextTrack':
      actions.nextTrack()
      break

  }

})

actions = McFly.createActions({

  /**
   * App
   */
  setVisibleTab: function(tab) {
    return {
      'actionType' : 'VISIBLE_TAB',
      'tab'        : tab
    }
  },

  setActiveTab: function(tab) {
    return {
      'actionType' : 'ACTIVE_TAB',
      'tab'        : tab
    }
  },

  /**
   * Tracks
   */
  playTrack: function(track) {
    return {
      'actionType' : 'PLAY_TRACK',
      'track'      : track
    }
  },

  pauseTrack: function() {
    return {
      'actionType' : 'PAUSE_TRACK'
    }
  },

  seekTrack: function(seconds) {
    if (isFinite(seconds))
      return {
        'actionType' : 'SEEK_TRACK',
        'time'       : seconds
      }
  },

  nextTrack: function() {
    return {
      'actionType' : 'NEXT_TRACK'
    }
  },

  previousTrack: function() {
    return {
      'actionType' : 'PREVIOUS_TRACK'
    }
  },

  likeTrack: function(track) {
    return SoundCloud.toggleLikeTrack(track)
      .then(function() {
        return {
          'actionType' : !track.user_favorite ? 'LIKE_TRACK' : 'UNLIKE_TRACK',
          'track'      : track
        }
      })
  },

  /**
   * Playlist
   */
  setPlaylist: function(tracks) {
    return {
      'actionType' : 'SET_PLAYLIST',
      'tracks'     : tracks
    }
  },

  addToPlaylist: function(tracks) {
    return {
      'actionType' : 'ADD_TO_PLAYLIST',
      'tracks'     : tracks
    }
  },

  /**
   * Collections
   */
  fetchLikes: function(url) {
    return SoundCloud.fetchLikes(url)
      .then(function(page) {
         return {
          'actionType' : 'LOADED_COLLECTION',
          'tracks'     : page.tracks,
          'next_href'  : page.next_href
        }
      })
      .catch(function(ex) {
        console.error(ex)
      })
  },

  fetchFeed: function(url) {
    return SoundCloud.fetchFeed(url)
      .then(function(page) {
        return {
          'actionType' : 'LOADED_FEED',
          'tracks'     : page.tracks,
          'next_href'  : page.next_href
        }
      })
      .catch(function(ex) {
        console.error(ex)
      })
  },

  fetchPlaylists: function() {
    return SoundCloud.fetchPlaylists()
      .then(function(playlists) {
        return {
          'actionType' : 'LOADED_PLAYLISTS',
          'playlists'  : playlists
        }
      })
      .catch(function(ex) {
        console.error(ex)
      })
  },

})

module.exports = actions
