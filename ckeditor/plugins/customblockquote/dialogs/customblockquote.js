CKEDITOR.dialog.add('blockquoteDialog', function(editor) {
	return {
		title: 'Block Quote Properties',
		minWidth: 400,
		minHeight: 200,
		contents: [
			{
				id: 'tab-basic',
				label: 'Block Quote Settings',
				elements: [
					{
						type: 'textarea',
						id: 'quote',
						label: 'Quote',
						validate: CKEDITOR.dialog.validate.notEmpty("Quote field cannot be empty."),
						setup: function(element) {
							if (element.getChildren() && element.getChildren() != undefined && element.getChildren() != null && element.getChildren().count() > 1) {
								var span = element.getChildren().getItem(0);
								this.setValue(span.getHtml());
							}
						},
						commit: function(element) {
							if (element.getChildren() && element.getChildren() != undefined && element.getChildren() != null && element.getChildren().count() > 1) {
								var span = element.getChildren().getItem(0);
								span.setHtml(this.getValue());
							}
						}
					},
					{
						type: 'text',
						id: 'title',
						label: 'Quoted by',
						setup: function(element) {
							if (element.getChildren() && element.getChildren() != undefined && element.getChildren() != null && element.getChildren().count() > 1) {
								var small = element.getChildren().getItem(1);
								this.setValue(small.getHtml());
							}
						},
						commit: function(element) {
							if (element.getChildren() && element.getChildren() != undefined && element.getChildren() != null && element.getChildren().count() > 1) {
								var span = element.getChildren().getItem(0);
								var small = element.getChildren().getItem(1);
								small.setHtml(this.getValue());
							}
						}
					}
				]
			}
		],
		onShow: function() {
			var selection = editor.getSelection();
			var element = selection.getStartElement();
			if (element) element = element.getAscendant('blockquote', true);
			if (!element || element.getName() != 'blockquote') {
				element = editor.document.createElement('blockquote');
				element.setAttribute('class', 'custom-block-quote');
				span = editor.document.createElement('span');
				element.append(span);
				small = editor.document.createElement('small');
				element.append(small);
				this.insertMode = true;
			} else {
				this.insertMode = false;
			}
			
			this.element = element;
			
			if (!this.insertMode){
				this.setupContent(this.element);
			}
		},
		onOk: function() {
			var dialog = this;
			var blockquote = this.element;
			this.commitContent(blockquote);
			if (this.insertMode) editor.insertElement(blockquote);
		}
	};
});
