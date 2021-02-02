// CODE FOR OPENING A FILE -- READING
var fr = new FileReader();
var $result = $("#result");
var fileP;
$("#file").on("change", function(evt) {
    // remove content
    $result.html("");
    // be sure to show the results
    $("#result_block").removeClass("hidden").addClass("show");

    // Closure to capture the file information.
    function handleFile(f) {
        var $title = $("<h4>", {
            text : f.name
        });
        var $fileContent = $("<div id='output'> </div>");
        var $rowContent = $("<div id='row' class='row'></div>");
        $fileContent.append($rowContent);
        $result.append($title);
        $result.append($fileContent);

        var dateBefore = new Date();
        JSZip.loadAsync(f)                                   // 1) read the Blob
        .then(function(zip) {
            var dateAfter = new Date();
            $title.append($("<span>", {
                "class": "small",
                text:" (loaded in " + (dateAfter - dateBefore) + "ms)"
            }));

            zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
                if (zipEntry.dir != true){
                    $rowContent.append($("<div>", {
                        "class": "column",
                        "style": "background-color:#bbb;",
                        text : zipEntry.name
                    }));
                }
            });
        }, function (e) {
            $result.append($("<div>", {
                "class" : "alert alert-danger",
                text : "Error reading " + f.name + ": " + e.message
            }));
        });
    }

    var files = evt.target.files;
    fileP = files;
    for (var i = 0; i < files.length; i++) {
        handleFile(files[i]);
    }
});

// Code for outputting file content

function previewFile(filenumber)
{
    var file = fileP[filenumber];
    var reader = new FileReader();
    reader.onload = (function(reader)
        {
            return function()
            {
                // Get file contents
                var contents = reader.result;
                // Output them to the preview window
                $('#preview').innerHTML = contents;
            }
        })(reader);

    reader.readAsText(file);
}

