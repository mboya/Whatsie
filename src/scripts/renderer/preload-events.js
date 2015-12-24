import {webFrame, ipcRenderer as ipcr} from 'electron';
import spellChecker from 'spellchecker';

// Set zoom level
ipcr.on('zoom-level', function(event, zoomLevel) {
  log('zoom level', zoomLevel);
  webFrame.setZoomLevel(zoomLevel);
});

// Set spell checker
ipcr.on('spell-checker', function(event, enabled, autoCorrect) {
  autoCorrect = !!autoCorrect;
  log('spell checker enabled:', enabled, 'auto correct:', autoCorrect);
  if (enabled) {
    webFrame.setSpellCheckProvider('en-US', autoCorrect, {
      spellCheck: function(text) {
        return !spellChecker.isMisspelled(text);
      }
    });
  } else {
    webFrame.setSpellCheckProvider('en-US', autoCorrect, {
      spellCheck: function() {
        return true;
      }
    });
  }
});

// Insert the given theme css into the DOM
ipcr.on('apply-theme', function(event, css) {
  let styleBlock = document.getElementById('cssTheme');

  if (!styleBlock) {
    styleBlock = document.createElement('style');
    styleBlock.id = 'cssTheme';
    styleBlock.type = 'text/css';
    document.head.appendChild(styleBlock);
  }

  styleBlock.innerHTML = css;
});

// Add the selected misspelling to the dictionary
ipcr.on('add-selection-to-dictionary', function() {
  spellChecker.add(document.getSelection().toString());
});

// Simulate a click on the 'New chat' button
ipcr.on('new-conversation', function() {
  const newChatButton = document.querySelector('button.icon-chat');
  if (newChatButton) {
    newChatButton.click();
  }
  const inputSearch = document.querySelector('input.input-search');
  if (inputSearch) {
    inputSearch.focus();
  }
});
