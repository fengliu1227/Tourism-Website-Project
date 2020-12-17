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
            let user = "<dt> From:" + i.user + "</dt>";
            let rating = "<dd> Rating:" + i.rating + "</dd>";
            let content = "<dd> Content:" + i.comment + "</dd>";
            commentsList.append("<div class=\"search-card-center\">" + user + rating + content + "</div>");
            // commentsList.append("<dt> From:" + i.user + "<dt>");
            // commentsList.append("<dd> Rating:" + i.rating + "<dd>");
            // commentsList.append("<dd> Content:" + i.comment + "<dd>");
        }
    }

    function addComment(item) {
        console.log(item);
        console.log(item[0]);
        if (item) {
            rating.html(item[0].newRating);
            let commentUser = "<dt> From:" + item[0].user + "</dt>";
            let commentArating = "<dd> Rating:" + item[0].rating + "</dd>";
            let commentContent = "<dd> Content:" + item[0].comment + "</dd>";
            commentsList.append("<div> class=\"search-card-center\"" + commentUser + commentArating + commentContent + "</div>");
            // commentsList.append("<dt> From:" + item[0].user + "</dt>");
            // commentsList.append("<dd> Rating:" + item[0].rating + "<dd>");
            // commentsList.append("<dd> Content:" + item[0].comment + "</dd>");
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
                window.location.href = "/users/login"
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