'use strict';

var React = require('react');
var Link  = require('react-router').Link;
var PlaylistsStore = require('../stores/playlistsStore');
var ListItem = require('./ListItem');
var _ = require('lodash');
var classNames = require('classnames');

var SongsView = React.createClass({

  getStateFromStores: function() {
    var id = parseInt(this.props.query.playlistId);
    var playlist = PlaylistsStore.find({ id: id });
    return {
      playlist: playlist
    }
  },

  getInitialState: function() {
    return this.getStateFromStores();
  },

  render: function() {
    var cover = this.state.playlist.artwork_url || this.state.playlist.tracks[0].artwork_url;
    var audio  = this.props.currentAudio;
    var mine   = true; //_.detect(this.state.playlist.tracks, { id: this.props.currentTrack.id });

    var playPause = classNames({
      'overlay__play-pause' : true,
      'fi-play'             : false, //mine ? (audio.paused || audio.error) : true,
      'fi-pause'            : false, //mine ? !audio.paused : false,
      'loading'             : false //mine ? audio.loading : false
    });

    var listItemClasses = classNames({
      'list-item' : true,
      'playlist'  : true,
      'active'    : false //mine && !audio.error
    });

    var numTracks = this.state.playlist.tracks.length + ' track'
      + (this.state.playlist.tracks.length > 1 ? 's' : '')

    return (
      <div>
        <div className={listItemClasses}>
          <div className="playlist__header__dark">
            <div className="playlist__header__dark" style={{'backgroundImage' : 'url(' + cover + ')'}}>
              <div className="header__info">
                <div>
                  <span className="header__field__username">{this.state.playlist.user.username}</span>
                  <Link to="playlists" className="header__button"><i className="fa fa-chevron-down"></i></Link>
                </div>
                <div>
                  <span className="header__field__title">{this.state.playlist.title}</span>
                </div>
                <div>
                  <span className="header__field__tracks">{ numTracks }</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="playlist__items">
          {this.state.playlist.tracks.map(function(track) {
            var me      = this.props.currentTrack && this.props.currentTrack === track.id
            var paused  = me ? audio.paused  : true
            var loading = me ? audio.loading : false
            var error   = me ? audio.error   : !track.streamable
            var active  = me && !error

            return (
              <ListItem
                type    = 'small'
                key     = { track.id }
                track   = { track }
                active  = { active }
                paused  = { paused }
                loading = { loading }
                error   = { error }
              >
              </ListItem>
            )
          }, this)}
        </section>


      </div>
    )
  }
});

module.exports = SongsView;
