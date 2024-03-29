var fr = new FileReader();
var filecount = 0;
var rowcount = 0;
var $result = $("#result");
var fileP;


// Code for outputting file content
function previewZipFile(value, name) {
    var extensionf = name.substr(name.lastIndexOf('.') + 1);
    var extension = extensionf.toLowerCase();
    if (extension == 'txt') {
        var $div = document.createElement("div");
        $div.setAttribute('class', 'previewcontainer');
        var preview = document.getElementById("filedisplayarea");
        while (preview.firstChild) {
            preview.removeChild(preview.firstChild);
        }
        if (value.length > 1) {
            $div.innerHTML = value[0] + '\n';
            for (var i = 1; i < value.length; i++)
                $div.innerHTML += value[i] + '\n';
        }
        else {
            $div.innerHTML += value;
        }
        document.getElementById("filedisplayarea").append($div);
    }
    else if (extension == 'gif' || extension == 'png' || extension == 'jpg') {
        var $img = document.createElement("img");
        $img.src = value;
        $img.setAttribute('class', 'emptypreview');
        var preview = document.getElementById("filedisplayarea");
        while (preview.firstChild) {
            preview.removeChild(preview.firstChild);
        }
        document.getElementById("filedisplayarea").append($img);
    }
    else if (extension == 'svg') {
        var $img = document.createElement("div");
        $img.setAttribute('class', 'emptypreview');
        $img.innerHTML = value;
        var preview = document.getElementById("filedisplayarea");
        while (preview.firstChild) {
            preview.removeChild(preview.firstChild);
        }
        document.getElementById("filedisplayarea").append($img);
    }
    else if (extension == 'docx') {
        var arrayBuffer = value;
        var $div = document.createElement("div");
        $div.setAttribute('class', 'previewcontainer');
        var preview = document.getElementById("filedisplayarea");
        while (preview.firstChild) {
            preview.removeChild(preview.firstChild);
        }
        mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
            .then(function (result) {
                var html = result.value; // The generated HTML
                var $div = document.createElement("div");
                $div.setAttribute('class', 'previewcontainer');
                var preview = document.getElementById("filedisplayarea");
                while (preview.firstChild) {
                    preview.removeChild(preview.firstChild);
                }
                $div.innerHTML += html;
                document.getElementById("filedisplayarea").append($div);
            })
            .done();
        document.getElementById("filedisplayarea").append($div);
    }
}


// CODE FOR OPENING A FILE -- READING
$("#file").on("change", function (evt) {
    // Remove content
    $result.html("");
    // Be sure to show the results
    $("#result_block").removeClass("hidden").addClass("show");
    // Closure to capture the file information.
    function handleZipFile(f) {
        var $fileContent = $("<div id='output'> </div>");
        var $rowContent = $("<div id='row' class='row'></div>");
        filecount = 0;
        // $fileContent.append($rowContent);
        $result.append($fileContent);
        JSZip.loadAsync(f)                                   // 1) read the Blob
            .then(function (zip) {
                zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
                    if (zipEntry.dir != true) {
                        if (filecount % 4 == 0 && filecount != 0) {
                            filecount = 0;
                            rowcount++;
                            var $newrow = $("<div id='row" + rowcount + "' class='row'></div>");
                            $result.append($newrow);
                        }
                        var filedirectory = zipEntry.name;
                        var filename = filedirectory.substr(filedirectory.lastIndexOf('/') + 1);
                        var extensionz = filedirectory.substr(filedirectory.lastIndexOf('.') + 1);
                        var extensionzip = extensionz.toLowerCase();
                        if (extensionzip == 'txt' || extensionzip == 'svg') {
                            zip.file(zipEntry.name).async('string').then(function (fileData) {
                                // fileData is a string of the contents
                                var content = fileData.split("\n");
                                content = content.slice(0, content.length - 1);
                                var $filecol = $("<div>", {
                                    "id": filename,
                                    "class": "column"
                                });
                                var $filecard = $("<div>", {
                                    "class": "filecard"
                                });
                                $filecard.click(function () {
                                    previewZipFile(content, zipEntry.name);
                                });
                                var $filecolcontainer = $("<div>", {
                                    "class": "filecontainer",
                                    text: filename
                                });
                                $filecard.append($filecolcontainer);
                                $filecol.append($filecard);
                                if (filecount % 4 == 0) {
                                    filecount = 0;
                                    rowcount++;
                                    var $newrow = $("<div id='row" + rowcount + "' class='row'></div>");
                                    $result.append($newrow);
                                    $rowContent = $newrow;
                                }
                                $rowContent.append($filecol);
                                filecount++;
                            });

                        }
                        else if (extensionzip == 'gif' || extensionzip == 'png' || extensionzip == 'jpg') {
                            zip.file(zipEntry.name).async('base64').then(function (fileData) {
                                // fileData is a string of the contents
                                var content = "data:blob;base64," + fileData;
                                var $filecol = $("<div>", {
                                    "id": filename,
                                    "class": "column"
                                });
                                var $filecard = $("<div>", {
                                    "class": "filecard"
                                });
                                $filecard.click(function () {
                                    previewZipFile(content, zipEntry.name);
                                });
                                var $filecolcontainer = $("<div>", {
                                    "class": "filecontainer",
                                    text: filename
                                });
                                $filecard.append($filecolcontainer);
                                $filecol.append($filecard);
                                if (filecount % 4 == 0) {
                                    filecount = 0;
                                    rowcount++;
                                    var $newrow = $("<div id='row" + rowcount + "' class='row'></div>");
                                    $result.append($newrow);
                                    $rowContent = $newrow;
                                }
                                $rowContent.append($filecol);
                                filecount++;
                            });

                        }
                        else if (extensionzip == 'docx') {
                            zip.file(zipEntry.name).async('arraybuffer').then(function (fileData) {
                                // fileData is an arraybuffer of the contents
                                var content = fileData;
                                var $filecol = $("<div>", {
                                    "id": filename,
                                    "class": "column"
                                });
                                var $filecard = $("<div>", {
                                    "class": "filecard"
                                });
                                $filecard.click(function () {
                                    previewZipFile(content, zipEntry.name);
                                });
                                var $filecolcontainer = $("<div>", {
                                    "class": "filecontainer",
                                    text: filename
                                });

                                $filecard.append($filecolcontainer);
                                $filecol.append($filecard);
                                if (filecount % 4 == 0) {
                                    filecount = 0;
                                    rowcount++;
                                    var $newrow = $("<div id='row" + rowcount + "' class='row'></div>");
                                    $result.append($newrow);
                                    $rowContent = $newrow;
                                }
                                $rowContent.append($filecol);
                                filecount++;
                            });

                        }
                    }
                });


            }, function (e) {
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

        fr.onload = (function (reader) {
            return function () {

                var content = reader.result;
                var lines = content.split('\n');
                var $filecol = $("<div>", {
                    "id": f.name,
                    "class": "column",
                    "value": content,
                    text: f.name
                });
                var $div = document.createElement("div");
                $div.setAttribute('class', 'previewcontainer');
                var preview = document.getElementById("filedisplayarea");
                while (preview.firstChild) {
                    preview.removeChild(preview.firstChild);
                }
                if (lines.length > 1) {
                    $div.innerHTML = lines[0] + '\n';
                    for (var i = 1; i < lines.length; i++)
                        $div.innerHTML += lines[i] + '\n';
                }
                document.getElementById("filedisplayarea").append($div);
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

        fr.onload = (function (reader) {
            return function () {
                var arrayBuffer = reader.result;
                var $filecol = $("<div>", {
                    "id": f.name,
                    "class": "column",
                    text: f.name
                });
                mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
                    .then(function (result) {
                        var html = result.value; // The generated HTML
                        var $div = document.createElement("div");
                        $div.setAttribute('class', 'previewcontainer');
                        var preview = document.getElementById("filedisplayarea");
                        while (preview.firstChild) {
                            preview.removeChild(preview.firstChild);
                        }
                        $div.innerHTML += html;
                        document.getElementById("filedisplayarea").append($div);
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
        fr.onload = (function (reader) {
            return function () {
                var content = reader.result;
                var $filecol = $("<div>", {
                    "id": f.name,
                    "class": "column",
                    "value": content,
                    text: f.name
                });
                var $img = document.createElement("img");
                $img.src = content;
                $img.setAttribute('class', 'previewcontainer');
                var preview = document.getElementById("filedisplayarea");
                while (preview.firstChild) {
                    preview.removeChild(preview.firstChild);
                }
                document.getElementById("filedisplayarea").append($img);

            }
        })(fr);

        fr.readAsDataURL(f);
    }

    var files = evt.target.files;
    fileP = files;
    var filename = files[0].name;
    var extensioncon = filename.substr(filename.lastIndexOf('.') + 1);
    var extension = extensioncon.toLowerCase();
    if (extension == 'zip') {
        handleZipFile(files[0]);
    }
    else if (extension == 'txt' || extension == 'svg') {
        handleTxtFile(files[0]);
    }
    else if (extension == 'gif' || extension == 'png' || extension == 'jpg') {
        handlePicFile(files[0]);
    }
    else if (extension == 'docx') {
        handleDocFile(files[0]);
    }
});
