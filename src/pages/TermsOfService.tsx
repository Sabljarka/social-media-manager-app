import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Terms of Service</h1>

      <h2>User Responsibilities</h2>
      <p>By using our service, you agree to:</p>
      <ul>
        <li>Provide accurate and complete information</li>
        <li>Maintain the security of your account</li>
        <li>Use the service in compliance with all applicable laws</li>
      </ul>

      <h2>Service Usage</h2>
      <p>Our service is provided "as is" and we make no warranties regarding:</p>
      <ul>
        <li>The availability of the service</li>
        <li>The accuracy of the information provided</li>
        <li>The security of your data</li>
      </ul>

      <h2>Limitations of Liability</h2>
      <p>We are not liable for:</p>
      <ul>
        <li>Any indirect or consequential damages</li>
        <li>Loss of data or profits</li>
        <li>Service interruptions or failures</li>
      </ul>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export default TermsOfService; 