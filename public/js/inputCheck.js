(function($) {
    // check login input
    var emailLogIn = $('#input-useremail-login');
    var passwordLogIn = $('#input-password-login');
    $('#logIn').click(function(event){
        event.preventDefault();
        if($.trim(emailLogIn.val()) == ""|| $.trim(passwordLogIn.val())==""){
            alert("please enter non-space input");
            return false;
        }
        $('#login-form').submit();
    })

// check signup input
    var emailSignUp = $('#input-useremail-signin');
    var passwordSignUp = $('#input-password-signin');
    $('#signUp').click(function(event){
        event.preventDefault();
        if($.trim(emailSignUp.val()) == ""|| $.trim(passwordSignUp.val())==""){
            alert("please enter non-space input");
            return false;
        }
        $('#signup-form').submit();
    })
    
// check profile input
    var firstNameProfile = $('#input-firstName');
    var lastNameProfile = $('#input-lastName');
    var passwordProfile = $('#input-password');
    $('#submit-change').click(function(event){
        event.preventDefault();
        if($.trim(firstNameProfile.val()) == ""||$.trim(lastNameProfile.val())==""|| $.trim(passwordProfile.val())==""){
            alert("please enter non-space input");
            return false;
        }
        $('#profile-form').submit();
    })

    var attractionName = $('#input-attraction-name');
    var attractionCategory = $('#input-attraction-category');
    var attractionAddress = $('#input-attraction-address');
    var attractionContent = $('#input-attraction-content');

    $('#submit-new-attraction').click(function(event){
        event.preventDefault();
        if($.trim(attractionName.val()) == ""||$.trim(attractionCategory.val())==""|| $.trim(attractionAddress.val())==""||$.trim(attractionContent.val())==""){
            alert("please enter non-space input");
            return false;
        }
        $('#profile-attraction-form').submit();
    })

    var commentContentUpdate = $('#updated-comment-input');
    var commentRatingUpdata = $('#input-update-rating');
    $('#updated-comment-submit').click(function(event){
        event.preventDefault();
        if($.trim(commentContentUpdate.val())=="" && $.trim(commentRatingUpdata.val())==""){
            alert("please enter non-space input");
            return false;
        }
        $('#add-comment-form-update').submit();
    })

    // var commentContent = $('#input-comment-attraction-rating');
    // var commentRating = $('#new-comment-input');

    // $('#new-comment-submit').click(function(event){
    //     event.preventDefault();
    //     if($.trim(commentContent.val())=="" || $.trim(commentRating.val())==""){
    //         alert("please enter non-space input");
    //         return false;
    //     }
    //     $('#add-comment-form').submit();
    // })





})(window.jQuery);