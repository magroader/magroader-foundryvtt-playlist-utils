let moduleName = "magroader-playlist-utils";
let currentPlaylistId = null;

Hooks.once('init', function() {

  libWrapper.register(moduleName, 'PlaylistDirectory.prototype._getSoundContextOptions', function (wrapped, ...args) {
    let result = wrapped(...args);

    result.push({
      name: "Add to Playlist",
      icon: '<i class="far fa-arrow-alt-circle-right"></i>',
      callback: li => {
        const playlistId = li.parents('.playlist').data('document-id');
        const playlist = game.playlists.get(playlistId);
        const sound = playlist.sounds.get(li.data('sound-id'));
        if (currentPlaylistId == null) {
          currentPlaylistId = playlistId;
        }
        new PlaylistSelectionDialog(
          {
            sound: sound,
            originalPlaylistId: playlistId,
            currentPlaylistId: currentPlaylistId,
          }
        ).render(true);
      }
    });
    
    result.push({
      name: "Add to Last Playlist",
      icon: '<i class="far fa-arrow-alt-circle-right"></i>',
      condition: li => {
        const playlistId = li.parents('.playlist').data('document-id');
        return currentPlaylistId != null && currentPlaylistId != playlistId;
      },
      callback: async li => {
        const playlistId = li.parents('.playlist').data('document-id');
        const playlist = game.playlists.get(playlistId);
        const sound = playlist.sounds.get(li.data('sound-id'));
        
        let soundCopy = sound.toObject();
        let newPlaylist = game.playlists.get(currentPlaylistId);
        await PlaylistSound.create(soundCopy, {parent:newPlaylist});
      }
    });

    return result;
  }, 'WRAPPER');

});


export class PlaylistSelectionDialog extends FormApplication {

  constructor(object, app, options = {}) {
    super(object, options);
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
        id: moduleName + 'playlist-dialog',
        classes: ['form'],
        title: 'Add to Playlist',
        template: 'modules/' + moduleName + '/templates/playlist-selector.html',
        width: 500,
        submitOnChange: false,
        closeOnSubmit: true
    });
  }

  getData(options) {

    let gamePlaylists = game.playlists.map((p) => {
      return {
        id: p.id,
        name: p.name,
        selected: p.id == this.object.currentPlaylistId
      }});

    let data = mergeObject(
      super.getData(options), 
      {playlists: gamePlaylists},
      {recursive: false}
    );

    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);
    $('button[name="submit"]', html).click(this._onSubmit.bind(this));
  }

  async _updateObject(event, formData) {
    if (formData.playlist != this.object.originalPlaylistId) {
      let soundCopy = this.object.sound.toObject();
      let newPlaylist = game.playlists.get(formData.playlist);
      currentPlaylistId = formData.playlist;
      await PlaylistSound.create(soundCopy, {parent:newPlaylist});
    }
  }
}