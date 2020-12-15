(function($) {
    var travelogue_submit_btn = $('#travelogue_submit_btn');

    travelogue_submit_btn.click(function(event){
        event.preventDefault();
        var requestConfig ={
            method : 'POST',
            url : '/travelogues/add',
            contentType: 'application/json',
            data : JSON.stringify({
                travelogueTitle : $('#travelogueTitle').val(),
                travelogueContent :$('#editor').html()
            })
        }
        $.ajax(requestConfig).then(function(returnData){
        });
    })


})(window.jQuery);