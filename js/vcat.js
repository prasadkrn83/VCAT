 'use strict';
 debugger;
 var selectedId=""
 navigator.webkitGetUserMedia({ audio: true }, function() {

 }, function(e) {
     alert('not ok--' + e);
 });
 var default_url='http://ec2-54-237-121-246.compute-1.amazonaws.com:8081/vcat/testcase';

 chrome.storage.sync.set({'remoteserver':default_url}, function() {
    console.log('Remote server set to : ' + default_url);
    });
 $(document).ready(function() {
    /*$( "input[type='text']" ).change(function() {
            // Check input( $( this ).val() ) for validity here
        $(this).css('border-color', '');

    });*/
     var counter = 0;
     //var autoSaveList =             chrome.storage.sync.set({'autoSaveList':autoSaveList});
     
    $('#vcatonoff').change(function() {
        console.log('setting vcat to : '+$(this).prop('checked'));
        turnVCATOnOff($(this).prop('checked'));     
    });

     
   chrome.storage.sync.get('autoSaveList', function(result) {
    if(result.autoSaveList==undefined){
        return;
    }
    for (var i = 1; i<result.autoSaveList.length; i++) {
        addAutoSaveRow(result.autoSaveList[i].key,result.autoSaveList[i].value,i,false);
        counter++;
    }
          
    });

    chrome.storage.sync.get('remoteserver', function(result) {
            $('#remoteserver').val(result.remoteserver);
            console.log('Remote server set to : '+ result.remoteserver);
     });

     $("#addrow").on("click", function() {
        
         counter++;
         addAutoSaveRow("","",counter,true);

     });

     $("#remoteserverBtn").on("click", function() {
           chrome.storage.sync.set({'remoteserver':$('#remoteserver').val()}, function() {
             console.log('Remote server set to : ' + $('#remoteserver').val());
              });
         

     });
     $("#saveauto").on("click", function() {
          var autoSaveList = new Array();
          for (var i = 0; i <= counter; i++) {
            var name = $('#name'+i).val();

            if(name==""){
                $("#name"+i).css('border-color', 'red');
                generateWarningToast("Error","Key cannot be empty");
                return;
            }
            else {
               $("#name"+i).css('border-color', '');
            }
            var value= $('#value'+i).val();
            if(value==""){
                 $("#value"+i).css('border-color', 'red');
                generateWarningToast("Error","Value cannot be empty");

                return;
            }
            else {
               $("#value"+i).css('border-color', '');
            }
            var entry={key:name,value:value};
            autoSaveList.push(entry);
            } 
          //chrome.storage.sync.set(autoSaveList, function() {
            chrome.storage.sync.set({'autoSaveList':autoSaveList}, function() {
             console.log('Value is set to ' + autoSaveList);
              });

        //});
     });



     $("table.order-list").on("click", ".ibtnDel", function(event) {
         $(this).closest("tr").remove();
         counter -= 1;
         save();
     });

     $("h5 button").click(function() {
         $("h5 button").removeClass("btn-primary");
         $("h5 button").addClass("btn-outline-primary");
         $(this).removeClass("btn-outline-primary");
         $(this).addClass("btn-primary");
     });

     $("#executeBtn").click(function(){
         var bgPage = chrome.extension.getBackgroundPage();
         bgPage.callAnnyangCommand($("#command").val());
     });
 });

 function 
     addAutoSaveRow(key,value,count,isDisabled){
         var newRow = $("<tr>");
         var cols = ""; 
         var disabledStr=(isDisabled==true)?"disabled":"";
         var readOnlyStr=(isDisabled==true)?"":"readOnly";

         cols += '<td>'+count+'</td>';
         cols += '<td><input type="text" class="form-control" id="name' + count + '" value="'+key+'" /></td>';
         cols += '<td><input type="text" class="form-control" id="value' + count + '" value="'+value+'" /></td>';

         //cols += '<td><input type="button" class="ibtnEdit btn btn-md  btn-success" '+disabledStr+' value="Edit"></td>';
         cols += '<td><input type="button" class="ibtnDel btn btn-md btn-danger " id="delete'+count+'" value="Delete"></td>';

         newRow.append(cols);
         $("table.order-list").append(newRow);
     }

function turnVCATOnOff(onoff) {
    chrome.runtime.sendMessage({vcat: 'onoff',status:onoff});
}

function addRow(){
    
     console.log('triggering addrow');
    $( "#addrow" ).trigger( "click" );

}

function deleteRow(num){
    $( "#delete"+num ).trigger( "click" );

}
function save(){
    console.log('triggering save');
    $( "#saveauto" ).trigger( "click" );

}
chrome.runtime.onMessage.addListener( function(request,sender,sendResponse)
{
    if( request.command === "addrow" ){
        addRow();
        
    }else if( request.command === "save" ){
        save();
        
    }else if( request.command === "delete" ){
        deleteRow(request.number);
        
    }else if( request.command === "key" ){
        $( selectedId ).val(request.key);
        
    }else if( request.command === "value" ){
                $( selectedId ).val(request.value);
        
    }else if( request.command === "selectkey" ){
        $( "#name"+request.number ).select();
        selectedId="#name"+request.number;
        
    }else if( request.command === "selectvalue" ){
        $( "#value"+request.number ).select();
        selectedId="#value"+request.number;
    }
    else if( request.command === "expandautocompelte" ){
        $( "#collapseTwo").trigger( "click" );
    }
});

function generateWarningToast(heading,message) {
    $.toast({
        heading: heading,
        text: message,
        hideAfter: 2000,
        icon: 'warning'
    });
}