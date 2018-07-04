function getElement(editor,index){
    return{
        type: "hbox",
        id: "hbox"+index,
        widths: ["100%"],
        children: [{
            id: "highlight"+index,
            type: "text",
            label: "Highlight "+index,
            commit: function(dataArr, dialog) {
                var text=dialog.getContentElement('tab-highlight', 'text'+index);
                dataArr.push({"text":this.getValue()});
            }
        }]
    };
}

CKEDITOR.dialog.add( 'highlightDialog', function( editor ) {
    return {
        title: 'Highlight',
        minWidth: 600,
        minHeight: 300,

        contents: [
            {
                id: 'tab-highlight',
                label: 'Highlight',
                elements: [getElement(editor,1),getElement(editor,2),getElement(editor,3)]
            }
        ],

        onShow: function() {
            var selection = editor.getSelection();
            var element = selection.getStartElement();

            if ( element )
                element = element.getAscendant( 'div', true );

            if ( !element || element.getId() != 'highlight' ) {
                element = editor.document.createElement( 'div' );
                element.setAttribute("id", "highlight");
                this.insertMode = true;
            }
            else{
                this.insertMode = false;
            }

            this.element = element;
            if ( !this.insertMode )
                setupContent( this.element, this );
        },

        onOk: function() {
            var dialog = this;
            var div = this.element;
            div.setAttribute("class", "highlight-in-article");
            var dataArr=[];
            this.commitContent(dataArr, dialog);
            if(validateData(dataArr)){
                div.setHtml("");
                var heading = editor.document.createElement('h3');
                heading.setHtml('হাইলাইটস');
                div.append(heading);
                var ul=editor.document.createElement('ul');
                ul.setAttribute("id", "highlight-ul");
                ul.setAttribute("class", "highlight-ul");
                
                var counter=0;
                for(var i=0;i<dataArr.length;i++){
                    if(dataArr[i].text!=""){
                        var li = editor.document.createElement('li');
                        li.setAttribute("id", "highlight-ul-li-"+(++counter));
                        li.setAttribute("class", "highlight-ul-li");
                        li.setHtml(dataArr[i].text);
                        ul.append(li);
                    }
                }
                div.append(ul);
                div.appendBogus(true);
                if(dialog.insertMode)
                    editor.insertElement( div );
            }else{
                alert("Please insert data for atleast one highlight.");
                return false;
            }
        }
    };
});
function validateData(dataArr){
    var result=false;
    for(var i=0;i<dataArr.length;i++){
        var text=dataArr[i].text;
        if(text!=""){
            return true;
        }
    }
    return result;
}
function setupContent(element, dialog){
    if(element.getChildren() && element.getChildren()!=undefined && element.getChildren()!=null && element.getChildren().count()>1){
        var ul=element.getChildren().getItem(1);
        if(ul && ul!=undefined && ul!=null && ul.getAttribute("id")=="highlight-ul"){
            if(ul.getChildren() && ul.getChildren()!=undefined && ul.getChildren()!=null && ul.getChildren().count()>0){
                var counter=1;
                for(i=0;i<ul.getChildren().count();i++){
                    var li=ul.getChildren().getItem(i);
                    var highlight=dialog.getContentElement('tab-highlight', 'highlight'+counter);
                    highlight.setValue(li.getHtml());
                    counter++;
                }
            }
        }
    }
}