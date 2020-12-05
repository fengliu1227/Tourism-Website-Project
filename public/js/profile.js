(function ($) {
    var userInfo = $('#userInfo');
    var edit_btn = $('#edit');
    var submit_btn = $('#submit-change');
    var error = $('#error');

    function editUserInfo() {
        submit_btn.show();
        userInfo.empty();
        let userInf = `
        <div class="profile-group">
            <label for="input-firstName">User firstName</label>
            <input type="text" id="input-firstName" name="userFirstName">
        </div>
        <div class="profile-group">
            <label for="input-lastName">User lastName</label>
            <input type="text" id="input-lastName" name="userLastName">
        </div>
        <div class="profile-group">
            <label for="input-gender">Gender</label>
            <select id="input-gender" name="gender">
                <option value="male">Male</option>
                <option value="female">Female</option>
        </div>`;
        userInfo.show();
        userInfo.append(userInf);
    }

    edit_btn.click(function (event) {
        event.preventDefault();
        editUserInfo();
    })

    
})(window.jQuery);