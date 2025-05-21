import { useState, useMemo } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const faqCategories = {
    firmware: {
      title: "Firmware Updates",
      icon: "🔄"
    },
    installation: {
      title: "Installation & Setup",
      icon: "⚙️"
    },
    troubleshooting: {
      title: "Troubleshooting",
      icon: "🔧"
    },
    security: {
      title: "Security & Privacy",
      icon: "🔒"
    }
  };

  const faqData = [
    {
      category: "firmware",
      question: "How do I update my device's firmware?",
      answer: "To update your device's firmware, follow these steps:\n\n1. Download the appropriate firmware file for your model from our firmware manager\n2. Back up your device data\n3. Install our Universal Installation Toolkit\n4. Connect your device to your computer\n5. Run the toolkit and follow the on-screen instructions\n6. Wait for the update to complete\n\nImportant: Do not disconnect your device during the update process."
    },
    {
      category: "installation",
      question: "Where can I find the Universal Installation Toolkit?",
      answer: "The Universal Installation Toolkit can be downloaded from:\n\n1. Our firmware manager page\n2. The downloads section of your account dashboard\n3. Direct download link in your purchase confirmation email\n\nThe toolkit is compatible with all CIRO and LESIYA devices and is required for firmware installation."
    },
    {
      category: "troubleshooting",
      question: "What should I do if the firmware update fails?",
      answer: "If your firmware update fails, follow these troubleshooting steps:\n\n1. Check your device model and firmware version compatibility\n2. Ensure your device has sufficient battery (at least 50%)\n3. Try restarting both your device and computer\n4. Verify your USB connection is secure\n5. Disable any antivirus software temporarily\n6. Try a different USB port or cable\n\nIf the issue persists, contact our support team with your device details and error message."
    },
    {
      category: "firmware",
      question: "How often should I update my device's firmware?",
      answer: "We recommend the following update schedule:\n\n• Check for updates monthly\n• Install security updates immediately\n• Major version updates: backup data first\n• Enable automatic update notifications\n\nPro tip: Register your device to receive email notifications for critical updates."
    },
    {
      category: "security",
      question: "Is it safe to update firmware over public Wi-Fi?",
      answer: "No, we strongly recommend against updating firmware over public Wi-Fi networks. Here's why:\n\n• Risk of corrupted downloads\n• Potential security vulnerabilities\n• Unstable connection issues\n\nAlways use a secure, private network connection when updating your device firmware."
    },
    {
      category: "troubleshooting",
      question: "Can I downgrade to a previous firmware version?",
      answer: "While possible, downgrading firmware is not recommended because:\n\n• May cause compatibility issues\n• Could create security vulnerabilities\n• Might affect device functionality\n• May void warranty in some cases\n\nIf you need to downgrade, please contact our support team for guided assistance."
    },
    {
      category: "security",
      question: "How secure are firmware updates?",
      answer: "Our firmware updates incorporate multiple security measures:\n\n• Digital signatures for authenticity\n• End-to-end encryption\n• Checksum verification\n• Secure download servers\n• Automatic backup creation\n\nWe follow industry best practices to ensure the security of all updates."
    }
  ];

  const filteredFAQs = useMemo(() => {
    return faqData.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <header className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about our products and services</p>
        
        <div className="faq-search">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filters">
          <button
            className={`category-button ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Questions
          </button>
          {Object.entries(faqCategories).map(([key, { title, icon }]) => (
            <button
              key={key}
              className={`category-button ${activeCategory === key ? 'active' : ''}`}
              onClick={() => setActiveCategory(key)}
            >
              <span className="category-icon">{icon}</span>
              {title}
            </button>
          ))}
        </div>
      </header>

      <div className="faq-list">
        {filteredFAQs.length === 0 ? (
          <div className="no-results">
            <p>No matching questions found. Try adjusting your search.</p>
          </div>
        ) : (
          filteredFAQs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            >
              <button 
                className="faq-question"
                onClick={() => toggleAccordion(index)}
                aria-expanded={activeIndex === index}
              >
                <div className="question-content">
                  <span className="category-icon">
                    {faqCategories[faq.category].icon}
                  </span>
                  {faq.question}
                </div>
                <span className="faq-icon"></span>
              </button>
              <div className="faq-answer">
                <div className="faq-answer-content">
                  {faq.answer.split('\n\n').map((paragraph, i) => (
                    <p key={i}>
                      {paragraph.split('\n').map((line, j) => (
                        <span key={j}>
                          {line}
                          {j < paragraph.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="faq-footer">
        <h2>Still have questions?</h2>
        <p>Our support team is here to help you with any questions or concerns.</p>
        <div className="support-options">
          <a href="/contact" className="contact-button primary">
            <span className="button-icon">📧</span>
            Contact Support
          </a>
          <a href="/live-chat" className="contact-button secondary">
            <span className="button-icon">💬</span>
            Live Chat
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 