(function($) {
    var commentsList = $('#commentsList');
    var addCommentForm = $('#add-comment-form');
    var newComment = $('#new-comment-input');
    var newCommentButton = $('#new-comment-submit');
    var attractionId = $('#attractionId-add-travelogue');
    var ratingFromComment = $('#input-comment-attraction-rating');
    var rating = $('#detail-attration-rating');

    function appendComments(List) {
        for (var i of List) {
            commentsList.append("<dt> From:" + i.user + "<dt>");
            commentsList.append("<dd> Rating:" + i.rating + "<dd>");
            commentsList.append("<dd> Content:" + i.comment + "<dd>");
        }
    }

    function addComment(item) {
        if (item) {
            rating.html(item[0].newRating);
            commentsList.append("<dt> From:" + item[0].user + "</dt>");
            commentsList.append("<dd> Rating:" + item[0].rating + "<dd>");
            commentsList.append("<dd> Content:" + item[0].comment + "</dd>");
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
            data: { comment: newComment.val(), rating: ratingFromComment.val(), attractionId: attractionId.val() },
            dataType: "json",
            success: function(data) {},
            error: function(err) {
                alert("something went wrong");
            }

        }
        $.ajax(requestConfig).then(function(responseMessage) {
            var newElement = $(responseMessage);
            newComment.val('');
            ratingFromComment.val('');
            addComment(newElement);
        })
    });
})(window.jQuery);