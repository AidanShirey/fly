var fr = new FileReader();
var filecount = 0;
var $result = $("#result");
var fileP;


// Code for outputting file content
function previewZipFile(value, name) {
    var extension = name.substr(name.lastIndexOf('.') + 1);
    if (extension == 'txt') {
        var lines = value.split('\n');
        var $div = document.createElement("div");
        $div.setAttribute('class', 'previewcontainer');
        var preview = document.getElementById("preview");
        while (preview.firstChild) {
            preview.removeChild(preview.firstChild);
        }
        if (lines.length > 1) {
            $div.innerHTML = lines[0] + '\n';
            for (var i = 1; i < lines.length; i++)
                $div.innerHTML += lines[i] + '\n';
        }
        else {
            $div.innerHTML += value;
        }
        document.getElementById("preview").append($div);
    }
    else if (extension == 'gif' || extension == 'png' || extension == 'jpg') {
        var $img = document.createElement("img");
        $img.src = value;
        $img.setAttribute('class', 'previewcontainer');
        var preview = document.getElementById("preview");
        while (preview.firstChild) {
            preview.removeChild(preview.firstChild);
        }
        document.getElementById("preview").append($img);
    }
    else {
        var lines = value.split('\n');
        var $img = document.createElement("div");
        $img.setAttribute('class', 'previewcontainer');
        if (lines.length > 1) {
            for (var i = 0; i < lines.length; i++)
                $img.innerHTML += value;
        }
        else {
            $img.innerHTML = value;
        }
        var preview = document.getElementById("preview");
        while (preview.firstChild) {
            preview.removeChild(preview.firstChild);
        }
        document.getElementById("preview").append($img);
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

                zip.forEach(function(relativePath, zipEntry) {  // 2) print entries
                    if (zipEntry.dir != true) {
                        var filedirectory = zipEntry.name;
                        var filename = filedirectory.substr(filedirectory.lastIndexOf('/') + 1);
                        var extension = filedirectory.substr(filedirectory.lastIndexOf('.') + 1);
                        if (extension == 'txt' || extension == 'svg') {
                            zip.file(zipEntry.name).async('string').then(function(fileData) {
                                // fileData is a string of the contents
                                var content = fileData.split("\n");
                                content = content.slice(0, content.length - 1);
                                var $filecol = $("<div>", {
                                    "id": filename,
                                    "class": "column",
                                    "value": content
                                });
                                var $filecard = $("<div>", {
                                    "class": "filecard",
                                    "onclick": "previewZipFile('" + content + "','" + zipEntry.name + "')"
                                });
                                var $filecolcontainer = $("<div>", {
                                    "class": "filecontainer",
                                    text: filename
                                });
                                $filecard.append($filecolcontainer);
                                $filecol.append($filecard);
                                $rowContent.append($filecol);
                            });
                            filecount++;
                        }
                        else if (extension == 'gif' || extension == 'png' || extension == 'jpg') {
                            zip.file(zipEntry.name).async('base64').then(function(fileData) {
                                // fileData is a string of the contents
                                var content = "data:blob;base64," + fileData;
                                var $filecol = $("<div>", {
                                    "id": filename,
                                    "class": "column",
                                    "value": content
                                });
                                var $filecard = $("<div>", {
                                    "class": "filecard",
                                    "onclick": "previewZipFile('" + content + "','" + zipEntry.name + "')"
                                });
                                var $filecolcontainer = $("<div>", {
                                    "class": "filecontainer",
                                    text: filename
                                });
                                $filecard.append($filecolcontainer);
                                $filecol.append($filecard);
                                $rowContent.append($filecol);
                            });
                            filecount++;
                        }
                    }
                });


            }, function(e) {
                $result.append($("<div>", {
                    "class": "alert alert-danger",
                    text: "Error reading " + f.name + ": " + e.message
                }));
            });
    }

    // Code for unpacking single txt files
    function handleTxtFile(f) {
        var $fileContent = $("<div id='output'> </div>");
        var $rowContent = $("<div id='row' class='row'></div>");
        $fileContent.append($rowContent);
        $result.append($fileContent);

        fr.onload = (function(reader) {
            return function() {

                var content = reader.result;
                var lines = content.split('\n');
                var dateBefore = new Date();
                var dateAfter = new Date();
                var $filecol = $("<div>", {
                    "id": f.name,
                    "class": "column",
                    "value": content,
                    text: f.name
                });
                var $div = document.createElement("div");
                $div.setAttribute('class', 'previewcontainer');
                var preview = document.getElementById("preview");
                while (preview.firstChild) {
                    preview.removeChild(preview.firstChild);
                }
                if (lines.length > 1) {
                    $div.innerHTML = lines[0] + '\n';
                    for (var i = 1; i < lines.length; i++)
                        $div.innerHTML += lines[i] + '\n';
                }
                document.getElementById("preview").append($div);
            }
        })(fr);

        fr.readAsText(f);
    }

    // Code for unpacking single docx files
    function handleDocFile(f) {
        var $fileContent = $("<div id='output'> </div>");
        var $rowContent = $("<div id='row' class='row'></div>");
        $fileContent.append($rowContent);
        $result.append($fileContent);

        fr.onload = (function(reader) {
            return function() {
                var arrayBuffer = reader.result;
                var $filecol = $("<div>", {
                    "id": f.name,
                    "class": "column",
                    text: f.name
                });
                mammoth.convertToHtml({arrayBuffer: arrayBuffer})
                    .then(function(result) {
                        var html = result.value; // The generated HTML
                        var $div = document.createElement("div");
                        $div.setAttribute('class', 'previewcontainer');
                        var preview = document.getElementById("preview");
                        while (preview.firstChild) {
                            preview.removeChild(preview.firstChild);
                        }
                        $div.innerHTML += html;
                        document.getElementById("preview").append($div);
                    })
                    .done();
            }
        })(fr);

        fr.readAsArrayBuffer(f);


    }

    // Code for unpacking single picture files
    function handlePicFile(f) {
        var $fileContent = $("<div id='output'> </div>");
        var $rowContent = $("<div id='row' class='row'></div>");
        $fileContent.append($rowContent);
        $result.append($fileContent);

        fr.onload = (function(reader) {
            return function() {
                var content = reader.result;
                var dateBefore = new Date();
                var dateAfter = new Date();
                var $filecol = $("<div>", {
                    "id": f.name,
                    "class": "column",
                    "value": content,
                    text: f.name
                });
                var $img = document.createElement("img");
                $img.src = content;
                $img.setAttribute('class', 'previewcontainer');
                var preview = document.getElementById("preview");
                while (preview.firstChild) {
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
    if (extension == 'zip' || extension == 'ZIP') {
        for (var i = 0; i < files.length; i++) {
            handleZipFile(files[i]);
        }
    }
    else if (extension == 'txt' || extension == 'svg' || extension == 'TXT' || extension == 'SVG') {
        handleTxtFile(files[0]);
    }
    else if (extension == 'gif' || extension == 'GIF' || extension == 'png' || extension == 'PNG' || extension == 'jpg' || extension == 'JPG') {
        handlePicFile(files[0]);
    }
    else if (extension == 'docx' || extension == 'DOCX') {
        handleDocFile(files[0]);
    }
});







