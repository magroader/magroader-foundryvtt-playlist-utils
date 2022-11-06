let moduleName = "magroader-playlist-utils";

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
        new PlaylistSelectionDialog(sound).render(true);
      }
    });

    return result;
  }, 'WRAPPER');

});


export class PlaylistSelectionDialog extends FormApplication {
  constructor(object, app, options = {}) {
      super(object, options);
      this.app = app;
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
      let data = mergeObject(super.getData(options),
          {
              playlists: game.playlists
          },
          { recursive: false }
      );

      return data;
  }
}