(function($) {
    var commentsList = $('#commentsList');
    var searchTraveloguesForm = $('travelogues-Search-form');
    var newComment = $('#new-comment-input');
    var newCommentButton = $('#new-comment-submit');
    var attractionId = $('#attractionId-add-travelogue');

    function appendComments(List) {
        for (var i of List) {
            commentsList.append("<dt>" + i.user + "<dt>");
            commentsList.append("<dl>" + i.comment + "<dl>");
        }
    }

    function addComment(item) {
        if (item) {
            commentsList.append("<dt>" + item[0].user + "</dt>");
            commentsList.append("<dl>" + item[0].comment + "</dl>");
        } else {
            return;
        }
    }

    var requestConfig = {
        method: 'GET',
        url: '/api/comments/' + attractionId.val()
    };
    $.ajax(requestConfig).then(function(responseMessage) {
        var newElement = $(responseMessage);
        commentsList.empty();
        appendComments(newElement);
    });



    newCommentButton.on('click', function() {
        event.preventDefault();

        var requestConfig = {
            method: 'POST',
            url: '/api/addComment',
            data: { comment: newComment.val(), attractionId: attractionId.val() },
            dataType: "json",
            success: function(data) {},
            error: function(err) {
                window.location.href = "/users/login"
            }

        }
        $.ajax(requestConfig).then(function(responseMessage) {
            var newElement = $(responseMessage);
            console.log(newElement)
            addComment(newElement);
        })
    });
})(window.jQuery);