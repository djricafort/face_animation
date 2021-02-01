$(document).ready(function() {

    populate_gallery();

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
                        var modal = document.getElementById("myModal");
                        var modalImg = document.getElementById("img01");
                        modal.style.display = "block";
                        modalImg.src = this.src;
                    })
                }
            },
        });
    }

    // Get the modal
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }

    $('#btn-close').click(function() {
        modal.style.display = "none";

    });

    $('#btn-delete').click(function() {
        var fullPath = document.getElementById("img01").src;
        var filename = fullPath.replace(/^.*[\\\/]/, '');
        modal.style.display = "none";
        location.reload();
        $.ajax({
            type: 'POST',
            url: '/delete_images',
            data: JSON.stringify(filename),
            contentType: "application/json",
            dataType: "json",
            cache: false,
            processData: false,
            async: true,
            success: function(data) {

            },
        });

    });

    $('#btn-download').click(function() {
        var fullPath = document.getElementById("img01").src;
        var filename = fullPath.replace(/^.*[\\\/]/, '');
        var a = document.getElementById("dl-link");
        a.href = fullPath;
        a.download = filename;
    });



    $("#imageUpload").change(function() {
        readURL(this);
    });

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
                        location.reload();
                    },
                });
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

});