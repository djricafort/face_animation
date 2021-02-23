$(document).ready(function() {
    // Init
    populate_gallery();

    function populate_gallery() {
        $.ajax({
            type: 'POST',
            url: '/filenames_deepfakes',
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function(data) {
                file_path = data['filenames']
                var i;
                for (i = 0; i < file_path.length; i++) {
                    var video = document.createElement("video");
                    var div = document.getElementById('gallery');
                    div.appendChild(video);
                    video.setAttribute("src", file_path[i]);
                    $("video").addClass("img-thumbnail");
                    $("video").click(function() {
                        var video_player = document.getElementById("video-player");
                        video_player.setAttribute("src", this.src);
                        video_player.load();
                    })
                }
            },
        });

    }

    $('#btn-delete').click(function() {
        var fullPath = document.getElementById("video-player").src;
        var filename = fullPath.replace(/^.*[\\\/]/, '')
        location.reload();
        $.ajax({
            type: 'POST',
            url: '/delete_fake',
            data: JSON.stringify(filename),
            contentType: "application/json",
            dataType: "json",
            cache: false,
            processData: false,
            async: true,
            success: function(data) {
                console.log("success");
            },
        });

    });

    $('#btn-download').click(function() {
        var fullPath = document.getElementById("video-player").src;
        var filename = fullPath.replace(/^.*[\\\/]/, '');
        var a = document.getElementById("dl-link");
        a.href = fullPath;
        a.download = filename;
    });

    // $('#btn-hd').click(function() {
    //     var fullPath = document.getElementById("video-player").src;
    //     var filename = fullPath.replace(/^.*[\\\/]/, '')
    //     // location.reload();
    //     $.ajax({
    //         type: 'POST',
    //         url: '/increase_res',
    //         data: JSON.stringify(filename),
    //         contentType: "application/json",
    //         dataType: "json",
    //         cache: false,
    //         processData: false,
    //         async: true,
    //         success: function(data) {
    //             console.log("success");
    //         },
    //     });
    //     // location.reload();
    // });



});