var fr = new FileReader();
var filecount = 0;
var $result = $("#result");
var fileP;


// Code for outputting file content
function previewFile(value)
{
    document.getElementById("preview").innerHTML = value;                 
}



// CODE FOR OPENING A FILE -- READING
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
                    zip.file(zipEntry.name).async('string').then(function (fileData) {
                        // fileData is a string of the contents
                        var content = fileData.split("\n");
                        content = content.slice(0, content.length - 1);
                        var $filecol = $("<div>", {
                            "id": zipEntry.name,
                            "class": "column",
                            "value": content,
                            "style": "background-color:#bbb;",
                            text : zipEntry.name
                        });
                        var $previewButton = $("<button>",{
                            text : "preview",
                            "onclick": "previewFile('"+ content +"')"
                        });
                        $filecol.append($previewButton);
                        $rowContent.append($filecol); 
                    });
                    filecount++;
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







