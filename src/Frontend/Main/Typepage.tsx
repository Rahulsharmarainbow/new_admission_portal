import React from 'react';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import { useParams } from 'react-router';

const TypePage = () => {
  const { pageType } = useParams();

  // Static page data
  const pageData = {
    about: {
      title: 'About Us',
      content: `
        <p><strong>[Your Organization Name]</strong> is dedicated to conducting fair and transparent examinations for students and candidates across various academic and competitive sectors.</p>

        <h3>Our Mission:</h3>
        <ul>
          <li>To create a seamless and user-friendly platform for exam registration, hall ticket generation, and result publication.</li>
          <li>To maintain integrity, security, and reliability in all exam processes.</li>
        </ul>

        <h3>Why Choose Us?</h3>
        <ul>
          <li>We provide accurate, real-time updates for exam schedules and results.</li>
          <li>Our team ensures the highest standards of data security and transparency.</li>
        </ul>

        <p>For more details or assistance, reach out to us at [Support Email/Phone].</p>
      `
    },
    'privacy-policy': {
      title: 'Privacy Policy',
      content: `
        <p>At <strong>[Your Organization Name]</strong>, we value your privacy and are committed to protecting your personal information.</p>

        <h3>Information We Collect:</h3>
        <ul>
          <li>Name, email address, contact number, and other personal details submitted during registration.</li>
          <li>Technical information such as IP address, browser type, and device information.</li>
        </ul>

        <h3>How We Use Your Information:</h3>
        <ul>
          <li>To provide and manage exam-related services.</li>
          <li>To send updates, notifications, and results.</li>
          <li>To improve our website and services.</li>
        </ul>

        <h3>Data Security:</h3>
        <p>We implement strict security measures to protect your data from unauthorized access or misuse.</p>

        <h3>Third-Party Sharing:</h3>
        <p>We do not share your personal information with third parties except as required by law or for providing essential services (e.g., payment gateways).</p>

        <h3>Your Consent:</h3>
        <p>By using our services, you consent to our privacy policy.</p>

        <p>For any queries, contact us at [Support Email/Phone].</p>
      `
    },
    disclaimer: {
      title: 'Disclaimer',
      content: `
        <p>The information provided on this website is for general informational purposes only.</p>
        <p>While we make every effort to ensure that the content is accurate and up-to-date, we do not guarantee the accuracy, reliability, or completeness of any information.</p>

        <h3>Key Points:</h3>
        <ol>
          <li><strong>[Your Organization Name]</strong> will not be held responsible for any technical errors, inaccuracies, or delays in the content provided.</li>
          <li>Users are advised to verify all details related to exam dates, hall tickets, and results from official communications or notifications.</li>
          <li>Any unauthorized use of this website or its content is strictly prohibited and may result in legal action.</li>
          <li>We are not responsible for any losses or damages incurred due to technical issues, network failures, or misuse of the website.</li>
        </ol>

        <p>By using this website, you agree to this disclaimer and accept that <strong>[Your Organization Name]</strong> shall not be liable for any consequences arising from the use of the information provided here.</p>
      `
    },
    'cancellation-policy': {
      title: 'Cancellation Policy',
      content: `
        <p>At <strong>[Your Organization Name]</strong>, we strive to provide seamless registration and payment services for our exams.</p>
        <p>Please read our cancellation and refund policy carefully:</p>

        <h3>Cancellation Policy:</h3>
        <ol>
          <li>Once the registration for the exam is completed and the payment is made, it cannot be canceled.</li>
          <li>No changes or cancellations will be entertained after the final submission of the application form.</li>
        </ol>

        <h3>Refund Policy:</h3>
        <ol>
          <li>Exam fees once paid are <strong>non-refundable and non-transferable</strong> under any circumstances.</li>
          <li>Refunds will only be considered in exceptional cases, such as duplicate payment due to technical errors, subject to verification.</li>
          <li>In case of a technical issue where payment is deducted but the registration is not successful, the amount will be refunded automatically within 7-10 working days.</li>
        </ol>

        <h3>Contact Us:</h3>
        <p>For payment-related issues, email us at [Support Email] with the transaction details.</p>
      `
    }
  };

  // Get page data based on route parameter or show not found
  const currentPage = pageData[pageType] || {
    title: 'Page Not Found',
    content: '<p class="text-gray-600">The requested page does not exist.</p>'
  };

  return (
    <div>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-blue-200 pb-4">
              {currentPage.title}
            </h1>
            
            <div
              dangerouslySetInnerHTML={{ __html: currentPage.content }}
              className="content-container prose prose-lg max-w-none"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TypePage;