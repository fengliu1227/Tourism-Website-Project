(function ($) {
    var userInfo = $('#userInfo');
    var edit_btn = $('#edit');
    var submit_btn = $('#submit-change');
    // var error = $('#error');
    var add_btn = $('#addAttraction');
    var attractionInfo = $('#attractionInfo');
    // var submit_add_btn = $('#submit-new-attraction');
    var cancelSubmitProfileBtn = $('#cancelSubmitProfile');
    var cancelAddAttractionBtn = $('#cancel-new-attraction');

// Show the profile edit input
    edit_btn.click(function (event) {
        event.preventDefault();
        edit_btn.hide();
        userInfo.show();
        cancelSubmitProfileBtn.click(function(){
            $("#userInfo :input").val("");
            userInfo.hide();
            edit_btn.show();
        })
    })
// Show the add-attraction input page
    add_btn.click(function(event){
        event.preventDefault();
        add_btn.hide();
        attractionInfo.show();
        cancelAddAttractionBtn.click(function(){
            $(".attraction-group :input").val("");
            attractionInfo.hide();
            add_btn.show();
        })
    })

    
})(window.jQuery);