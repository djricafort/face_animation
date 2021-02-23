$(document).ready(function() {
    // Init
    $('.image-section').hide();
    $('.loader').hide();
    $('#srcVid2').hide();
    $('#outVid2').hide();
    $('#result').hide();
    $('#image-selector').hide();

    // Upload Preview
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var form_data = new FormData($('#upload-file')[0]);
                $.ajax({
                    type: 'POST',
                    url: '/upload_image',
                    data: form_data,
                    contentType: false,
                    cache: false,
                    processData: false,
                    async: true,
                    success: function(data) {
                        var img = document.getElementById('uploaded-image');
                        img.src = data;
                        console.log('Success!');
                    },
                });
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    function readVideo(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var form_data = new FormData($('#upload-videoFile')[0]);
                $.ajax({
                    type: 'POST',
                    url: '/upload_video',
                    data: form_data,
                    contentType: false,
                    cache: false,
                    processData: false,
                    async: true,
                    success: function(data) {
                        $("#uploaded-video").remove();
                        var x = document.getElementById('srcVid2');
                        x.setAttribute("src", data);
                        $('#srcVid2').show();
                        console.log('Success!');
                    },
                });

            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imageUpload").change(function() {
        readURL(this);
    });

    $("#videoUpload").change(function() {
        readVideo(this);
    });


    // Generate synthetic video
    $('#btn-generate').click(function() {
        $("#out-image").remove();
        $('.loader').show();
        var files = [];
        var filename = "";
        var fullImagePath = document.getElementById('uploaded-image').src;
        var fullVideoPath = document.getElementById('srcVid2').src;
        filename = fullImagePath.replace(/^.*[\\\/]/, '')
        files.push(filename);
        filename = fullVideoPath.replace(/^.*[\\\/]/, '')
        files.push(filename);

        $.ajax({
            type: 'POST',
            url: '/generate',
            data: JSON.stringify(files),
            contentType: "application/json",
            dataType: "json",
            cache: false,
            processData: false,
            async: true,
            success: function(data) {
                file_path = data['filename']
                $('.loader').hide();
                document.getElementById('outVid2').src = file_path;
                $('#outVid2').show();
            },
            error: function(xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText
                // alert('Error - ' + errorMessage);
                alert('Video took too long to process. The synthetic video can be found in the synthetic video tab');
            }
        });
    });

    $('#select-image').click(function() {
        document.getElementById('gallery').innerHTML = "";
        populate_gallery();

    });

    $('#select-video').click(function() {
        document.getElementById('gallery').innerHTML = "";
        populate_video_gallery();

    });


    function populate_gallery() {
        $.ajax({
            type: 'POST',
            url: '/filenames_images',
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function(data) {
                file_path = data['filenames']
                var i;
                for (i = 0; i < file_path.length; i++) {
                    var img = new Image();
                    var div = document.getElementById('gallery');
                    div.appendChild(img);
                    img.src = file_path[i];
                    $("img").addClass("img-thumbnail");
                    $("img").click(function() {
                        var img = document.getElementById('uploaded-image');
                        img.src = this.src;
                    })
                }
                $('#image-selector').show();
            },
        });
    }


    function populate_video_gallery() {

        $.ajax({
            type: 'POST',
            url: '/filenames_videos',
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
                        $("#uploaded-video").remove();
                        var x = document.getElementById('srcVid2');
                        x.setAttribute("src", this.src);
                        $('#srcVid2').show();
                    })
                }
                $('#image-selector').show();
            },
        });

    }

});