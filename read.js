var fr = new FileReader();
var filecount = 0;
var $result = $("#result");
var fileP;


// Code for outputting file content
function previewZipFile(value, name)
{
    var extension = name.substr(name.lastIndexOf('.') + 1);
    if (extension == 'txt'){
        var lines = value.split('\n');
        if (lines.length > 1){
        for(var i = 0; i < lines.length; i++)
            document.getElementById("preview").innerHTML += value;
        }
        document.getElementById("preview").innerHTML = value;
    }
    else if (extension == 'gif' || extension == 'png' || extension == 'jpg'){
        var $img = document.createElement("img");
        $img.src = value;
        var preview = document.getElementById("preview");
        while (preview.firstChild){
            preview.removeChild(preview.firstChild);
        }
        document.getElementById("preview").append($img);
    }
    else {
        var lines = value.split('\n');
        if (lines.length > 1){
        for(var i = 0; i < lines.length; i++)
            document.getElementById("preview").innerHTML += value;
        }
        document.getElementById("preview").innerHTML = value;
    }          
}


// CODE FOR OPENING A FILE -- READING
$("#file").on("change", function(evt) {
    // remove content
    $result.html("");
    // be sure to show the results
    $("#result_block").removeClass("hidden").addClass("show");


    // Closure to capture the file information.
    function handleZipFile(f) {
        var $fileContent = $("<div id='output'> </div>");
        var $rowContent = $("<div id='row' class='row'></div>");
        $fileContent.append($rowContent);
        $result.append($fileContent);

        var dateBefore = new Date();
        JSZip.loadAsync(f)                                   // 1) read the Blob
        .then(function(zip) {
            var dateAfter = new Date();

            zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
                if (zipEntry.dir != true){
                    var filename = zipEntry.name;
                    var extension = filename.substr(filename.lastIndexOf('.') + 1);
                    if (extension == 'txt' || extension == 'svg'){
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
                            "onclick": "previewZipFile('"+ content +"','" + zipEntry.name + "')"
                        });
                        $filecol.append($previewButton);
                        $rowContent.append($filecol); 
                    });
                    filecount++;
                    }
                    else if (extension == 'gif' || extension == 'png' || extension == 'jpg'){
                        zip.file(zipEntry.name).async('base64').then(function (fileData) {
                        // fileData is a string of the contents
                            var content = "data:blob;base64," + fileData;
                            var $filecol = $("<div>", {
                                "id": zipEntry.name,
                                "class": "column",
                                "value": content,
                                "style": "background-color:#bbb;",
                                text : zipEntry.name
                            });
                            var $previewButton = $("<button>",{
                                text : "preview",
                                "onclick": "previewZipFile('"+ content +"','" + zipEntry.name + "')"
                            });
                            $filecol.append($previewButton);
                            $rowContent.append($filecol); 
                        });
                        filecount++;
                    }
                }
            });

            
        }, function (e) {
            $result.append($("<div>", {
                "class" : "alert alert-danger",
                text : "Error reading " + f.name + ": " + e.message
            }));
        });
    }

    // Code for unpacking single txt files
    function handleTxtFile(f) {
        var $fileContent = $("<div id='output'> </div>");
        var $rowContent = $("<div id='row' class='row'></div>");
        $fileContent.append($rowContent);
        $result.append($fileContent);

        fr.onload = (function(reader)
        {
            return function()
            {
                
                var content = reader.result;
                var lines = content.split('\n');
                var dateBefore = new Date();
                var dateAfter = new Date();
                var $filecol = $("<div>", {
                    "id": f.name,
                    "class": "column",
                    "value": content,
                    "style": "background-color:#bbb;",
                    text : f.name
                });
                $rowContent.append($filecol); 
                if (lines.length > 1){
                    document.getElementById("preview").innerHTML = lines[0] + '\n';
                    for(var i = 1; i < lines.length; i++)
                        document.getElementById("preview").innerHTML += lines[i] + '\n';
                }
            }
        })(fr);
        
        fr.readAsText(f);
    }

    // Code for unpacking single picture files
    function handlePicFile(f) {
        var $fileContent = $("<div id='output'> </div>");
        var $rowContent = $("<div id='row' class='row'></div>");
        $fileContent.append($rowContent);
        $result.append($fileContent);

        fr.onload = (function(reader)
        {
            return function()
            {
                var content = reader.result;
                var dateBefore = new Date();
                var dateAfter = new Date();
                var $filecol = $("<div>", {
                    "id": f.name,
                    "class": "column",
                    "value": content,
                    "style": "background-color:#bbb;",
                    text : f.name
                });
                var $img = document.createElement("img");
                $img.src = content;
                $rowContent.append($filecol); 
                var preview = document.getElementById("preview");
                while (preview.firstChild){
                    preview.removeChild(preview.firstChild);
                }
                document.getElementById("preview").append($img);
                    
            }
        })(fr);
        
        fr.readAsDataURL(f);
    }

    var files = evt.target.files;
    fileP = files;
    var filename = files[0].name;
    var extension = filename.substr(filename.lastIndexOf('.') + 1);
    if (extension == 'zip'){
        for (var i = 0; i < files.length; i++) {
            handleZipFile(files[i]);
        }
    }
    else if (extension == 'txt'){
        handleTxtFile(files[0]);
    }
    else if (extension == 'gif' || extension == 'png' || extension == 'jpg'){
        handlePicFile(files[0]);
    }
});







