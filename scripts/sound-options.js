import { moduleName } from './globals.js';
import { PlaylistSelectionDialog } from './playlist-selection-dialog.js';

export class SoundOptions {
  constructor() {
    this.currentPlaylistId = null;
  }

  init() {
    libWrapper.register(moduleName, 'PlaylistDirectory.prototype._getSoundContextOptions', function (wrapped, ...args) {
      let result = wrapped(...args);

      result.push({
        name: "Copy to Playlist",
        icon: '<i class="far fa-copy"></i>',
        callback: li => {
          const playlistId = li.parents('.playlist').data('document-id');
          const playlist = game.playlists.get(playlistId);
          const sound = playlist.sounds.get(li.data('sound-id'));
          if (this.currentPlaylistId == null) {
            this.currentPlaylistId = playlistId;
          }
          new PlaylistSelectionDialog(
            {
              sound: sound,
              originalPlaylistId: playlistId,
              currentPlaylistId: this.currentPlaylistId,
              confirmCallback: (id) => this.currentPlaylistId = id,
            }
          ).render(true);
        }
      });

      result.push({
        name: "Copy to Last Playlist",
        icon: '<i class="far fa-rotate-left"></i>',
        condition: li => {
          const playlistId = li.parents('.playlist').data('document-id');
          return this.currentPlaylistId != null && this.currentPlaylistId != playlistId;
        },
        callback: async li => {
          const playlistId = li.parents('.playlist').data('document-id');
          const playlist = game.playlists.get(playlistId);
          if (playlist == null)
            return;
          const sound = playlist.sounds.get(li.data('sound-id'));

          let soundCopy = sound.toObject();
          let newPlaylist = game.playlists.get(this.currentPlaylistId);
          if (newPlaylist == null)
            return;

          await PlaylistSound.create(soundCopy, { parent: newPlaylist });
        }
      });

      return result;
    }, 'WRAPPER');
  }
}