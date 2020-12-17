(function ($) {
    $('#sortBtn').click(function(event){
        event.preventDefault();
        $("#attractionTableSorted").show();
        $("#attractionTable").hide();
    })
    $('#defualtBtn').click(function(event){
        event.preventDefault();
        $("#attractionTableSorted").hide();
        $("#attractionTable").show();
    })
})(window.jQuery);