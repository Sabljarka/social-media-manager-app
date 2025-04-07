import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Privacy Policy</h1>

      <h2>Facebook User Data Deletion</h2>
      <p>If you wish to delete your data from Facebook through our app, please follow these steps:</p>
      <ol>
        <li>Log in to our app using your credentials</li>
        <li>Navigate to the Facebook section</li>
        <li>Click on the "Delete My Data" button</li>
        <li>Confirm your decision in the popup window</li>
      </ol>

      <h2>Data Collection and Usage</h2>
      <p>We collect and process your data in accordance with applicable data protection laws. This includes:</p>
      <ul>
        <li>Basic account information (email, name)</li>
        <li>Social media account access tokens</li>
        <li>Usage statistics and analytics</li>
      </ul>

      <h2>Data Protection</h2>
      <p>We implement appropriate security measures to protect your data, including:</p>
      <ul>
        <li>Encryption of sensitive data</li>
        <li>Regular security audits</li>
        <li>Access controls and authentication</li>
      </ul>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 