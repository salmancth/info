document.getElementById('downloadPdf').addEventListener('click', function () {
    const pdfPath = 'path/to/yourfile.pdf';  // Replace with your PDF file path
    const a = document.createElement('a');
    a.href = pdfPath;
    a.download = 'yourfile.pdf';  // Set the download filename
    a.click();
});
