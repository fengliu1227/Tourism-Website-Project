(function ($) {
    var userInfo = $('#userInfo');
    var edit_btn = $('#edit');
    var submit_btn = $('#submit-change');
    var error = $('#error');
    var add_btn = $('#addAttraction');
    var attractionInfo = $('#attractionInfo');
    var submit_add_btn = $('#submit-new-attraction');
    
    edit_btn.click(function (event) {
        event.preventDefault();
        submit_btn.show();
        userInfo.show();
    })
    add_btn.click(function(event){
        event.preventDefault();
        attractionInfo.show();
    })

    
})(window.jQuery);