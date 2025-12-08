// Dark Mode Toggle
const API_URL = 'https://contact-form-api-1013646791608.asia-southeast1.run.app/api/contact';

const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Check for saved dark mode preference
const darkMode = localStorage.getItem('darkMode');
if (darkMode === 'enabled') {
    body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️ Light Mode';
}

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        darkModeToggle.textContent = '☀️ Light Mode';
    } else {
        localStorage.setItem('darkMode', 'disabled');
        darkModeToggle.textContent = '🌙 Dark Mode';
    }
});

const contactForm = document.getElementById('contactForm');

const sendBtn = document.getElementById('send-Btn');

const originalText = sendBtn.textContent;
const originalColor = sendBtn.style.backgroundColor;

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable button during submission
        const originalText = sendBtn.textContent;
        sendBtn.disabled = true;
        sendBtn.textContent = 'Sending...';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: document.getElementById('name').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    company: document.getElementById('company').value.trim(),
                    message: document.getElementById('message').value.trim()
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Success
                sendBtn.style.backgroundColor = 'green';
                sendBtn.textContent = '✓ Sent!';
                contactForm.reset();

                setTimeout(() => {
                    sendBtn.style.backgroundColor = '';
                    sendBtn.textContent = originalText;
                    sendBtn.disabled = false;
                }, 3000);
            } else {
                throw new Error(data.error || 'Failed to send message');
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            sendBtn.style.backgroundColor = 'red';
            sendBtn.textContent = 'Error - Please try again';

            setTimeout(() => {
                sendBtn.style.backgroundColor = '';
                sendBtn.textContent = originalText;
                sendBtn.disabled = false;
            }, 3000);
        }
    });
}