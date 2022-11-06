let moduleName = "magroader-playlist-utils";

Hooks.once('init', function() {

  libWrapper.register(moduleName, 'PlaylistDirectory.prototype._getSoundContextOptions', function (wrapped, ...args) {
    let result = wrapped(...args);

    result.push({
      name: "Add to Playlist",
      icon: '<i class="far fa-arrow-alt-circle-right"></i>',
      callback: li => {
        const playlistId = li.parents(".playlist").data("document-id");
        const playlist = game.playlists.get(playlistId);
        const sound = playlist.sounds.get(li.data("sound-id"));
        
        return Dialog.prompt({
          title: `Add "${sound.name}" to Playlist`,
          content: `<h4>Adding "${sound.name}" to Playlist</h4><p>Something should go here!</p>`,
          rejectClose: false,
          ok: function() {}
        });
      }
    });

    return result;
  }, 'WRAPPER');

});