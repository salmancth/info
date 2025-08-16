// List of available certificates
const certificates = [
    '../certificates/HIL_Scratch.jpg',
    '../certificates/certificate2.jpg',
    '../certificates/certificate3.jpg'
];

let currentCertIndex = 0;
const pdfViewer = document.getElementById('pdfViewer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Function to update the displayed certificate
function updateCertificate() {
    pdfViewer.src = certificates[currentCertIndex];
    
    // Update button states
    prevBtn.disabled = currentCertIndex === 0;
    nextBtn.disabled = currentCertIndex === certificates.length - 1;
}

// Previous button event listener
prevBtn.addEventListener('click', function () {
    if (currentCertIndex > 0) {
        currentCertIndex--;
        updateCertificate();
    }
});

// Next button event listener
nextBtn.addEventListener('click', function () {
    if (currentCertIndex < certificates.length - 1) {
        currentCertIndex++;
        updateCertificate();
    }
});

// Download button event listener
document.getElementById('downloadPdf').addEventListener('click', function () {
    const a = document.createElement('a');
    a.href = certificates[currentCertIndex];
    a.download = certificates[currentCertIndex].split('/').pop(); // Use the filename as download name
    a.click();
});

// Initialize the viewer
document.addEventListener('DOMContentLoaded', function() {
    // Check which certificates actually exist
    const validCertificates = [];
    
    // For now, we know HIL_Scratch.jpg exists
    validCertificates.push('../certificates/HIL_Scratch.jpg');
    
    // In a real implementation, you would check for actual file existence
    // For this demo, we'll just use the one certificate we know exists
    if (validCertificates.length > 0) {
        // Update the certificates array with only valid ones
        certificates.length = 0;
        validCertificates.forEach(cert => certificates.push(cert));
        
        updateCertificate();
    } else {
        // Fallback if no certificates are found
        pdfViewer.src = '../assets/img/profile.jpg';
    }
});
