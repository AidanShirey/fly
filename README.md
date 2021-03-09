# Fly - The Online Zip File Previewer
Want to glance at the content of a zip file? Don't want to clutter your computer with unzipping software? Maybe you just don't trust the person who gave you the file in the first place. Fly solves these problems by extracting the content from zip files and allows the user to preview files without having to extract them to their computer.

# Libraries Used
**JSZip:** Used to unpack the locally uploaded files.

Link to JSZip: https://github.com/Stuk/jszip

**JQuery:** Used for more easy and concise html element creation for post unzip webpage manipulation.

Link to JQuery: https://github.com/jquery/jquery

**Mammoth.js:** Used for reading docx files.

Link to mammoth.js: https://github.com/mwilliamson/mammoth.js/

# Link to Github Page
https://aidanshirey.github.io/fly/

# Q & A
**Why are some types of files not showing up after uploading a zip file?**

This service does not currently show files that it doesn't know how to handle preview-wise. This approach is chosen for mainly two reasons. One, this keeps the file preview selection UI from being inflated with files you wouldn't normally want to preview anyway, such as a .dll file. Two, this prevents the service from timing out from consuming too many resources in Chrome trying to find a solution to a problem it doesn't know how to answer.

**What file types are supported?**

As of the most recent iteration, Fly supports .txt, .docx, .svg, .png, .jpg, and .gif files.

**Why does my supported file not open?**

The zip file extraction features this service uses are dependent on the libraries listed above.
