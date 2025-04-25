// Business Dashboard JavaScript

// Sample data for customer reports
const sampleReports = [
    {
        id: 'R-1001',
        customer: 'John Smith',
        type: 'Feedback',
        date: '2023-04-15',
        status: 'Resolved'
    },
    {
        id: 'R-1002',
        customer: 'Sarah Johnson',
        type: 'Complaint',
        date: '2023-04-18',
        status: 'Open'
    },
    {
        id: 'R-1003',
        customer: 'Michael Brown',
        type: 'Inquiry',
        date: '2023-04-20',
        status: 'Pending'
    },
    {
        id: 'R-1004',
        customer: 'Emily Davis',
        type: 'Support',
        date: '2023-04-22',
        status: 'Open'
    },
    {
        id: 'R-1005',
        customer: 'Robert Wilson',
        type: 'Feedback',
        date: '2023-04-23',
        status: 'Resolved'
    }
];

// DOM Elements
const reportsTable = document.getElementById('reports-table');
const reportModal = document.getElementById('report-modal');
const newReportBtn = document.getElementById('new-report-btn');
const closeModalBtn = document.querySelector('.close');
const cancelReportBtn = document.getElementById('cancel-report');
const reportForm = document.getElementById('report-form');

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Populate reports table
    populateReportsTable();
    
    // Set up event listeners
    setupEventListeners();
});

// Populate the reports table with data
function populateReportsTable() {
    const tbody = reportsTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    sampleReports.forEach(report => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${report.id}</td>
            <td>${report.customer}</td>
            <td>${report.type}</td>
            <td>${report.date}</td>
            <td><span class="status ${report.status.toLowerCase()}">${report.status}</span></td>
            <td>
                <button class="action-btn view-btn" data-id="${report.id}">View</button>
                <button class="action-btn edit-btn" data-id="${report.id}">Edit</button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    const editButtons = document.querySelectorAll('.edit-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const reportId = this.getAttribute('data-id');
            viewReport(reportId);
        });
    });
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const reportId = this.getAttribute('data-id');
            editReport(reportId);
        });
    });
}

// Set up event listeners
function setupEventListeners() {
    // Open modal when "New Report" button is clicked
    newReportBtn.addEventListener('click', function() {
        reportModal.style.display = 'block';
    });
    
    // Close modal when "X" is clicked
    closeModalBtn.addEventListener('click', function() {
        reportModal.style.display = 'none';
    });
    
    // Close modal when "Cancel" button is clicked
    cancelReportBtn.addEventListener('click', function() {
        reportModal.style.display = 'none';
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === reportModal) {
            reportModal.style.display = 'none';
        }
    });
    
    // Handle form submission
    reportForm.addEventListener('submit', function(event) {
        event.preventDefault();
        submitReport();
    });
}

// Submit a new report
function submitReport() {
    const customerName = document.getElementById('customer-name').value;
    const reportType = document.getElementById('report-type').value;
    const reportDetails = document.getElementById('report-details').value;
    
    // Create a new report object
    const newReport = {
        id: `R-${1006 + sampleReports.length}`,
        customer: customerName,
        type: reportType,
        date: new Date().toISOString().split('T')[0],
        status: 'Open'
    };
    
    // Add the new report to the sample data
    sampleReports.unshift(newReport);
    
    // Update the table
    populateReportsTable();
    
    // Close the modal
    reportModal.style.display = 'none';
    
    // Reset the form
    reportForm.reset();
    
    // Show success message
    showNotification('Report submitted successfully!');
}

// View a report
function viewReport(reportId) {
    const report = sampleReports.find(r => r.id === reportId);
    
    if (report) {
        alert(`
            Report Details:
            ID: ${report.id}
            Customer: ${report.customer}
            Type: ${report.type}
            Date: ${report.date}
            Status: ${report.status}
        `);
    }
}

// Edit a report
function editReport(reportId) {
    const report = sampleReports.find(r => r.id === reportId);
    
    if (report) {
        // In a real application, you would populate a form with the report data
        // For this example, we'll just toggle the status
        
        if (report.status === 'Open') {
            report.status = 'Pending';
        } else if (report.status === 'Pending') {
            report.status = 'Resolved';
        } else {
            report.status = 'Open';
        }
        
        // Update the table
        populateReportsTable();
        
        // Show success message
        showNotification(`Report ${reportId} status updated to ${report.status}`);
    }
}

// Show a notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--primary-color)';
    notification.style.color = 'white';
    notification.style.padding = '1rem';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    notification.style.zIndex = '1001';
    
    // Add to the document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}
