'use babel';

import DblClickSelectInsideBracketsView from './dbl-click-select-inside-brackets-view';
import { CompositeDisposable } from 'atom';

export default {
  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();
    this.dblClickSelectInsideBrackets();
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  dblClickSelectInsideBrackets() {
    let opening_chars = '{[(<';
    let closing_chars = '}])>';
    let editor;

    if (editor = atom.workspace.getActiveTextEditor()) {
      atom.views.getView(editor).addEventListener('dblclick', function() {

        dbl_clicked_char = editor.getSelectedText()[0];
        if (!opening_chars.includes(dbl_clicked_char) && !closing_chars.includes(dbl_clicked_char)) {
          return false;
        }

        forward_search = opening_chars.includes(dbl_clicked_char);
        search_range = editor.getSelectedBufferRange().copy();
        nested_brackets = 0;

        if (forward_search) {
          search_char = closing_chars[ opening_chars.indexOf(dbl_clicked_char) ]
          search_range.end = editor.getBuffer().getEndPosition();
          search_text = editor.getBuffer().getTextInRange(search_range)

          for (var i = 1; i < search_text.length; i++) {
            if (nested_brackets == 0 && search_text.charAt(i) == search_char) {
              break;
            }

            if (search_text.charAt(i) == dbl_clicked_char) {
              nested_brackets++;
            }
            else if (search_text.charAt(i) == search_char) {
              nested_brackets--;
            }
          }
        }
        else {
          search_char = opening_chars[ closing_chars.indexOf(dbl_clicked_char) ]
          search_range.end = search_range.start;
          search_range.start = editor.getBuffer().getFirstPosition();
          search_text = editor.getBuffer().getTextInRange(search_range)

          for (var i = 1; i < search_text.length; i++) {
            if (nested_brackets == 0 && search_text.charAt(search_text.length - i) == search_char) {
              break;
            }

            if (search_text.charAt(search_text.length - i) == dbl_clicked_char) {
              nested_brackets++;
            }
            else if (search_text.charAt(search_text.length - i) == search_char) {
              nested_brackets--;
            }
          }
        }

        // If a counterpart bracket is found, set the selection
        if (search_text.length != i && i > 1) {
          if (forward_search) {
            editor.setCursorBufferPosition(editor.getSelectedBufferRange().start.translate([0,1]));
            editor.selectRight(i-1)
          }
          else {
            editor.setCursorBufferPosition(editor.getSelectedBufferRange().start);
            editor.selectLeft(i-1)
          }
        }
      })
    }
  }
};
