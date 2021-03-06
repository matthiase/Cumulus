'use strict';

var McFly             = require('../utils/mcfly')
var Actions           = require('../actions/actionCreators')

var AppStore          = require('../stores/appStore')
var PlaylistStore     = require('../stores/playlistStore')
var CurrentTrackStore = require('../stores/currentTrackStore')

var _                 = require('lodash')

var _loaded      = false
var _favorites   = []
var _next_href

function _appendFavorites(tracks) {
  _favorites = _.uniq(_favorites.concat(tracks), 'id')
}

var LikesStore = McFly.createStore({

  getLikes: function() {
    return _favorites
  },

  loaded: function() {
    return _loaded
  },

  getNextHref: function() {
    return _next_href
  },

}, function(payload) {

  switch (payload.actionType) {

    case 'LOADED_COLLECTION':
      if (!AppStore.isVisibleTab('likes')) return

      _loaded = true
      _next_href = payload.next_href
      _appendFavorites(payload.tracks)

      if (PlaylistStore.getPlaylist().length === 0 || !CurrentTrackStore.getAudio().src)
        Actions.setPlaylist(payload.tracks)
      else
        Actions.addToPlaylist(payload.tracks)

      break

    case 'LIKE_TRACK':
      // we don't want duplicate tracks to end up in the LikesView
      if (_loaded && !_.detect(_favorites, { 'id' : payload.track.id }))
        _favorites.unshift(payload.track)
      break

    case 'UNLIKE_TRACK':
      if (_loaded)
        _.remove(_favorites, { 'id' : payload.track.id })
      break

    case 'PLAY_TRACK':
      if (AppStore.isVisibleTab('likes'))
        AppStore.setActiveTab('likes')

      break

    case 'NEXT_TRACK':
      if (!AppStore.isActiveTab('likes')) return

      if (!PlaylistStore.peekNextTrack()) {
        Actions.fetchLikes(_next_href)
          .then(function() {
            Actions.nextTrack()
          })
      }
      break


  }

  LikesStore.emitChange()

  return true
});

module.exports = LikesStore
