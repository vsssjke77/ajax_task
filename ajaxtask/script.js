$(document).ready(function () {
    var url = "http://localhost:3000";


    getPosts();


    $("#addButton").on("click", function () {
        openModal();
    });


    $(".close").on("click", function () {
        closeModal();
    });

    $("#submitButton").on("click", function () {
        submitForm();
    });

    $("#changetheme").on("click", function () {
        ChangeTheme();
    });

    function openModal() {
        $("#modalArea").css("display", "block");
        getUsers();
    }

    function closeModal() {
        $("#modalArea").css("display", "none");
        $("#title").val("");
        $("#body").val("");
        $("#postForm").data("postId", "");
        formMode("create");
    }

    function formMode(mode) {
        let submitButton = $("#submitButton");

        if (mode === "create") {
            submitButton.text("Confirm adding");
        } else if (mode === "edit") {
            submitButton.text("Confirm editing");
        }

        submitButton.off("click").on("click", function () {
            submitForm();
        });
    }

    function submitForm() {
        var title = $("#title").val();
        var body = $("#body").val();
        var userId = $("#selectUser").val();
        var postId = $("#postForm").data("postId");

        if (!postId) {

            $.post(`${url}/posts`, { title: title, body: body, userId: userId }, function () {
                getPosts();
                closeModal();
            });
        } else {

            updatePost(postId, userId);
        }
    }

    function getPosts() {
        $(".loader").addClass("loading");

        $.get(`${url}/posts`, function (posts) {
            displayPosts(posts);
        })
    }

    function displayPosts(posts) {

        var list = $("#list");
        list.empty();


        var importantPosts = [];
        var normalPosts = [];


        function getUserInfo(userId) {
            return $.get(`${url}/users/${userId}`);
        }


        async function listPost() {
            for (const post of posts) {

                const userInfo = await getUserInfo(post.userId);

                if (isImportant(post.id)) {
                    importantPosts.push({ post, userInfo });
                } else {
                    normalPosts.push({ post, userInfo });
                }
            }


            var sortedPosts = importantPosts.concat(normalPosts);

            sortedPosts.forEach(async function (postObj) {
                const post = postObj.post;
                const userInfo = postObj.userInfo;

                var listItem = $("<li>").html(`
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                    <p>Posted by user: ${userInfo.name}</p>
                    <button class="editButton" data-post-id="${post.id}">Edit</button>
                    <button class="deleteButton" data-post-id="${post.id}">Delete</button>
                    <button class="markImportantButton ${isImportant(post.id) ? 'marked' : ''}" data-post-id="${post.id}">Mark</button>
                `);


                if (isImportant(post.id)) {
                    listItem.addClass("important-post");
                    listItem.find('.markImportantButton').html('Marked');
                }

                list.append(listItem);

            });


            $(".editButton").on("click", function () {
                var postId = $(this).data("post-id");
                editPost(postId);
            });

            $(".deleteButton").on("click", function () {
                var postId = $(this).data("post-id");
                deletePost(postId);
            });

            $(".markImportantButton").on("click", function () {
                var postId = $(this).data("post-id");
                markImp(postId);
            });
            $(".loader").removeClass("loading");

        }

        listPost();
    }

    function isImportant(postId) {
        var importantPosts = JSON.parse(localStorage.getItem("importantPosts")) || [];
        return importantPosts.includes(postId);
    }

    function markImp(postId) {
        var importantPosts = JSON.parse(localStorage.getItem("importantPosts")) || [];

        if (importantPosts.includes(postId)) {

            importantPosts = importantPosts.filter(id => id !== postId);
        } else {

            importantPosts.push(postId);
        }

        localStorage.setItem("importantPosts", JSON.stringify(importantPosts));

        getPosts();
    }

    window.editPost = function (postId) {
        $.get(`${url}/posts/${postId}`, function (post) {
            $("#title").val(post.title);
            $("#body").val(post.body);
            $("#selectUser").val(post.userId);
            $("#postForm").data("postId", postId);
            formMode("edit");
            openModal();
        });
    };

    function updatePost(postId, userId) {
        var title = $("#title").val();
        var body = $("#body").val();

        $.ajax({
            method: "PUT",
            url: `${url}/posts/${postId}`,
            data: { title: title, body: body, userId: userId },
            success: function () {
                getPosts();
                closeModal();
            }
        });
    }

    window.deletePost = async function (postId) {
        if (isImportant(postId)) {
            let response = await fetch(`${url}/posts/${postId}`);
            let commits = await response.json();
            if (confirm("You want to delete marked post: " + commits['title'] + "?")) {
                deletePostRequest(postId);
            }
        } else {
            deletePostRequest(postId);
        }
    };

    function deletePostRequest(postId) {
        $.ajax({
            method: "DELETE",
            url: `${url}/posts/${postId}`,
            success: function () {
                getPosts();
            }
        });
    }

    function getUsers() {
        $.get(`${url}/users`, function (users) {
            var selectUser = $("#selectUser");
            selectUser.empty();

            users.forEach(function (user) {
                var option = $("<option>").attr("value", user.id).text(user.name);
                selectUser.append(option);
            });
        });
    }

    function ChangeTheme() {
        var body = document.querySelector("body");
        var currentTheme = JSON.parse(localStorage.getItem("theme")) || [];
        var themeImage = document.getElementById("changetheme");

        function toggleDarkThemeOnElements(element, darkTheme) {
            if (darkTheme) {
                element.classList.add('darktheme');
            } else {
                element.classList.remove('darktheme');
            }
        }

        if (currentTheme.includes('dark')) {
            themeImage.src = themeImage.dataset.light;
            currentTheme.splice(currentTheme.indexOf('dark'), 1);
            body.classList.remove('darktheme');

            var elements = document.querySelectorAll('*');
            elements.forEach(function (element) {
                element.classList.remove('darktheme');
            });
        } else {
            currentTheme.push('dark');
            themeImage.src = themeImage.dataset.dark;
            body.classList.add('darktheme');

            var elements = document.querySelectorAll('*');
            elements.forEach(function (element) {
                toggleDarkThemeOnElements(element, true);
            });
        }

        localStorage.setItem("theme", JSON.stringify(currentTheme));
    }
});