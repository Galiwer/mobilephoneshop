import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      <h1 className="about-heading">Repair City</h1>

      <p className="about-text">
        Welcome to <strong>Repair City</strong> – your trusted mobile phone repair and sales partner in Kaduwela.
      </p>

      <p className="about-text">
        Founded by <strong>Panagodage Hemal Ranjana Perera</strong>, Repair City is committed to providing high-quality phone repairs,
        genuine mobile accessories, and the latest mobile phones at competitive prices. With years of hands-on experience and a passion
        for technology, we ensure every customer receives fast, reliable, and honest service.
      </p>

      <p className="about-text">
        Located at <strong>No 452/6, Thisara Building, Avissawella Road, Kaduwela</strong>, our shop is equipped to handle everything
        from screen replacements to advanced repairs, always using trusted parts and tools.
      </p>

      <p className="about-text">
        We take pride in our customer-first approach and aim to build lasting relationships through excellent service and aftercare.
      </p>

      <div className="contact-section">
        <h2>Contact Us</h2>
        <p>📞 <strong>071 448 7329</strong></p>
        <p>📧 <strong>hemal.rx8@gmail.com</strong></p>
      </div>
    </div>
  );
};

export default AboutUs;
