import { moduleName } from './globals.js';

// NOTE: Useful information here:
// https://foundryvtt.wiki/en/development/guides/creating-custom-dialog-windows
export class PlaylistSelectionDialog extends FormApplication {

    constructor(object, options = {}) {
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
        if (newPlaylist != null) {
            await PlaylistSound.create(soundCopy, {parent:newPlaylist});
            if (this.object.confirmCallback != null) {
                this.object.confirmCallback(formData.playlist);
            }
        }
      }
    }
  }