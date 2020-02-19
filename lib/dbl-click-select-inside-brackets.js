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
    let supported_chars     = '{[(<';
    let supported_chars_inv = '}])>';
    let editor;

    if (editor = atom.workspace.getActiveTextEditor()) {
      atom.views.getView(editor).addEventListener('dblclick', function() {
        if (!supported_chars.includes( editor.getSelectedText()[0] )) {
          return false;
        }

        opening_char = editor.getSelectedText()[0];
        closing_char = supported_chars_inv[ supported_chars.indexOf(opening_char) ]
        nested_openers = 0;

        range_to_end = editor.getSelectedBufferRange().copy();
        range_to_end.end = editor.getBuffer().getEndPosition();
        remaining_text = editor.getBuffer().getTextInRange( range_to_end )

        for (var i = 1; i < remaining_text.length; i++) {
          if (nested_openers == 0 && remaining_text.charAt(i) == closing_char) {
            break;
          }

          if (remaining_text.charAt(i) == opening_char) {
            nested_openers++;
          }
          else if (remaining_text.charAt(i) == closing_char) {
            nested_openers--;
          }
        }

        // If a closing bracket is found, expand the selection
        if (remaining_text.length != i && i > 1) {
          // Begin the selection just inside the opening bracket
          editor.setCursorBufferPosition(editor.getSelectedBufferRange().start.translate([0,1]));
          // And end just before the closing bracket
          editor.selectRight(i - 1);
        }
      })
    }
  }
};
