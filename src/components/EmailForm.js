import React, { useState } from 'react';
//import emailjs from 'emailjs-com';

function EmailForm({ onSendEmail }) {
  const [email, setEmail] = useState('');

  const handleSendEmail = () => {

    fetch('/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
        .then((response) => {
          if (response.status === 200) {
            alert('Email sent successfully');
          } else {
            alert('Failed to send the email');
          }
        })
        .catch((error) => {
          console.error('Error sending email:', error);
          alert('Failed to send the email');
        });
    };
  
    // You can perform email sending logic here.
    // For this example, we will just alert the entered email.
    alert(`Email will be sent to: ${email}`);
  

  return (
    <div className="email-form">
      <label htmlFor="email">Enter your email: </label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSendEmail}>Send Email</button>
    </div>
  );
}

export default EmailForm;
