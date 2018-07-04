CKEDITOR.plugins.add('customblockquote', {
	icons: 'customblockquote',
	init: function(editor) {
		editor.addCommand('customblockquote', new CKEDITOR.dialogCommand('blockquoteDialog'));
		editor.ui.addButton('Blockquote', {
			label: 'Insert Blockquote',
			command: 'customblockquote',
			toolbar: 'insert,1'
		});
		if (editor.contextMenu) {
			editor.addMenuGroup('blockquoteGroup');
			editor.addMenuItem('blockquoteItem', {
				label: 'Edit Blockquote',
				icon: this.path + 'styles/quote-icon.png',
				command: 'customblockquote',
				group: 'blockquoteGroup'
			});
			editor.contextMenu.addListener(function(element, selection) {
				if (element.getAscendant('blockquote', true)) {
					return { blockquoteItem: CKEDITOR.TRISTATE_OFF };
				}
			});

		}
		//editor.addContentsCss(this.path + 'styles/custom-blockquote.css');
		CKEDITOR.dialog.add('blockquoteDialog', this.path + 'dialogs/customblockquote.js');
		editor.on('doubleclick', function(event) {
                var element = event.data.element;
                if (element.is('blockquote') && element.getAttribute("class")=="custom-block-quote") {
                    event.data.dialog = 'blockquoteDialog';
                }
            }
        );
	}
});
