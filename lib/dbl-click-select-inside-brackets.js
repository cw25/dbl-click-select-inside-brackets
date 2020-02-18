'use babel';

import DblClickSelectInsideBracketsView from './dbl-click-select-inside-brackets-view';
import { CompositeDisposable } from 'atom';

export default {
  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable()
    this.dblClickSelectInsideBrackets()
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  dblClickSelectInsideBrackets() {
    let supported_chars = '{[(<';
    let supported_chars_inv = '}])>';
    let editor;

    if (editor = atom.workspace.getActiveTextEditor()) {
      atom.views.getView(editor).addEventListener('dblclick', function() {
        if (supported_chars.includes( editor.getSelectedText()[0] )) {
          opening_char = editor.getSelectedText()[0];
          closing_char = supported_chars_inv[ supported_chars.indexOf(opening_char) ]
          nested_openers = 0;

          while (true) {
            editor.selectRight()

            if (nested_openers == 0 && editor.getSelectedText().slice(-1)[0] == closing_char) {
              break;
            }

            if (editor.getSelectedText().slice(-1)[0] == opening_char) {
              nested_openers++;
            }
            else if (editor.getSelectedText().slice(-1)[0] == closing_char) {
              nested_openers--;
            }

            if (editor.getSelectedBufferRange().end.row == editor.getBuffer().getEndPosition().row && editor.getSelectedBufferRange().end.column == editor.getBuffer().getEndPosition().column) {
              break;
            }
          }
        }
      })
    }
  }
};
