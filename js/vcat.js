 'use strict';
 debugger;
 navigator.webkitGetUserMedia({ audio: true }, function() {

 }, function(e) {
     alert('not ok--' + e);
 });
 var default_url='http://ec2-54-237-121-246.compute-1.amazonaws.com:8081/vcat/testcase';

 chrome.storage.sync.set({'remoteserver':default_url}, function() {
    console.log('Remote server set to : ' + default_url);
    });
 $(document).ready(function() {
     var counter = 0;
     //var autoSaveList =             chrome.storage.sync.set({'autoSaveList':autoSaveList});

   chrome.storage.sync.get('autoSaveList', function(result) {
    for (var i = 0; i<=result.autoSaveList.length; i++) {
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
            var value= $('#value'+i).val();
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
         counter -= 1
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


         cols += '<td><input type="text" class="form-control" id="name' + count + '" value="'+key+'" '+readOnlyStr+'/></td>';
         cols += '<td><input type="text" class="form-control" id="value' + count + '" value="'+value+'" '+readOnlyStr+'/></td>';

         cols += '<td><input type="button" class="ibtnEdit btn btn-md  btn-success" '+disabledStr+' value="Edit"></td>';
         cols += '<td><input type="button" class="ibtnDel btn btn-md btn-danger "  value="Delete"></td>';

         newRow.append(cols);
         $("table.order-list").append(newRow);
     }

