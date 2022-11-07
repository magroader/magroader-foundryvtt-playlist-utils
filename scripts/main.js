import {SoundOptions} from './sound-options.js';

let soundOptions = new SoundOptions();

Hooks.once('init', function() {
  soundOptions.init();
});