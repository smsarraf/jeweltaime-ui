const express = require('express');
const router = express.Router();

// In-memory policy content (HTML) — aligned with ERP Legal Policies API
// Slug format follows LegalPolicy schema enum: UPPER_SNAKE_CASE
// Response field: contentHtml (matches ERP API contract)
// In production, replace with a CMS or database
const policies = {
  TERMS_AND_CONDITIONS: {
    title: 'Terms & Conditions',
    slug: 'TERMS_AND_CONDITIONS',
    legacySlug: 'terms-and-conditions',
    contentHtml: `
      <h1>Terms & Conditions</h1>
      <p><em>Last updated: June 2025</em></p>

      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using the JewelT'Aime website (the "Site"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our Site.</p>

      <h2>2. General Conditions</h2>
      <p>We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information) may be transferred unencrypted. Products are available exclusively online through our website.</p>

      <h2>3. Accuracy of Information</h2>
      <p>We are not responsible if information on this Site is not accurate, complete, or current. The material is provided for general information only and should not be relied upon as the sole basis for making decisions. Any reliance on the material on this Site is at your own risk.</p>

      <h2>4. Products and Pricing</h2>
      <p>Prices for products are subject to change without notice. We reserve the right to modify or discontinue any product at any time. We shall not be liable to you or any third-party for any modification, price change, suspension, or discontinuance of a product.</p>

      <h2>5. Purchases</h2>
      <p>We reserve the right to limit the quantities of any products or services that we offer. All descriptions of products and pricing are subject to change at any time without notice, at our sole discretion. We reserve the right to discontinue any product at any time.</p>

      <h2>6. Personal Information</h2>
      <p>Your submission of personal information through the Site is governed by our Privacy Policy. Please review our Privacy Policy for more details.</p>

      <h2>7. Prohibited Uses</h2>
      <p>You may not use the Site for any unlawful purpose or to solicit others to perform unlawful acts. You may not violate any local, state, national, or international law or regulation.</p>

      <h2>8. Limitation of Liability</h2>
      <p>In no event shall JewelT'Aime be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Site.</p>

      <h2>9. Governing Law</h2>
      <p>These Terms shall be governed by and construed in accordance with applicable laws, and any disputes shall be subject to the exclusive jurisdiction of the courts.</p>

      <h2>10. Changes to Terms</h2>
      <p>We reserve the right to update or change these Terms at any time. Your continued use of the Site following the posting of any changes constitutes acceptance of those changes.</p>
    `
  },

  PRIVACY_POLICY: {
    title: 'Privacy Policy',
    slug: 'PRIVACY_POLICY',
    legacySlug: 'privacy-policy',
    contentHtml: `
      <h1>Privacy Policy</h1>
      <p><em>Last updated: June 2025</em></p>

      <h2>1. Information We Collect</h2>
      <p>We collect information you provide directly to us when you create an account, make a purchase, or contact us. This may include your name, email address, phone number, shipping address, payment information, and any other information you choose to provide.</p>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Process and fulfill your orders</li>
        <li>Send order confirmations and updates</li>
        <li>Respond to your comments, questions, and customer service requests</li>
        <li>Send marketing communications (with your consent)</li>
        <li>Improve and personalise your experience on our Site</li>
        <li>Detect, prevent, and address technical issues and fraud</li>
      </ul>

      <h2>3. Information Sharing</h2>
      <p>We do not sell or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.</p>

      <h2>4. Cookies</h2>
      <p>We use cookies and similar tracking technologies to track activity on our Site and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>

      <h2>5. Data Security</h2>
      <p>We implement appropriate technical and organisational security measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction.</p>

      <h2>6. Data Retention</h2>
      <p>We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.</p>

      <h2>7. Your Rights</h2>
      <p>You have the right to access, correct, or delete your personal information. You may also object to or restrict the processing of your data. To exercise these rights, please contact us at privacy@jeweltaime.com.</p>

      <h2>8. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
    `
  },

  SHIPPING_POLICY: {
    title: 'Shipping Policy',
    slug: 'SHIPPING_POLICY',
    legacySlug: 'shipping-policy',
    contentHtml: `
      <h1>Shipping Policy</h1>
      <p><em>Last updated: June 2025</em></p>

      <h2>1. Processing Time</h2>
      <p>All orders are processed within 1–2 business days. Orders are not shipped or delivered on weekends or holidays. If we experience a high volume of orders, shipments may be delayed by a few days. We will contact you if there is a significant delay.</p>

      <h2>2. Shipping Rates & Delivery Times</h2>
      <p>Shipping charges for your order will be calculated and displayed at checkout. Delivery times vary depending on your location:</p>
      <ul>
        <li><strong>UK Standard:</strong> 3–5 business days</li>
        <li><strong>UK Express:</strong> 1–2 business days</li>
        <li><strong>International Standard:</strong> 7–14 business days</li>
        <li><strong>International Express:</strong> 3–5 business days</li>
      </ul>

      <h2>3. Free Shipping</h2>
      <p>We offer free standard shipping on all UK orders over £75. International free shipping may be available on orders over £150 — check at checkout.</p>

      <h2>4. Order Tracking</h2>
      <p>You will receive a shipping confirmation email containing your tracking number once your order has been shipped. The tracking number will be active within 24 hours.</p>

      <h2>5. International Shipping</h2>
      <p>International orders may be subject to customs duties, import taxes, or fees imposed by the destination country. JewelT'Aime is not responsible for these additional charges. Please check with your local customs office for more information.</p>

      <h2>6. Incorrect Address</h2>
      <p>Please ensure your shipping address is correct when placing your order. JewelT'Aime is not responsible for orders shipped to an incorrect address provided by the customer.</p>

      <h2>7. Lost or Damaged Packages</h2>
      <p>If your package is lost or arrives damaged, please contact us within 7 days of the estimated delivery date so we can investigate and arrange a replacement or refund.</p>
    `
  },

  REFUND_AND_RETURN_POLICY: {
    title: 'Refund & Return Policy',
    slug: 'REFUND_AND_RETURN_POLICY',
    legacySlug: 'refund-and-return-policy',
    contentHtml: `
      <h1>Refund & Return Policy</h1>
      <p><em>Last updated: June 2025</em></p>

      <h2>1. Returns</h2>
      <p>We accept returns within 30 days of delivery. To be eligible for a return, your item must be unused and in the same condition you received it, with all original packaging and tags intact.</p>

      <h2>2. Non-Returnable Items</h2>
      <p>The following items cannot be returned:</p>
      <ul>
        <li>Gift cards</li>
        <li>Personalised or custom-made items</li>
        <li>Items marked as "Final Sale"</li>
        <li>Items that have been worn, damaged, or altered by the customer</li>
      </ul>

      <h2>3. Refund Process</h2>
      <p>Once we receive and inspect your return, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed within 5–7 business days, and a credit will automatically be applied to your original method of payment.</p>

      <h2>4. Exchanges</h2>
      <p>We only replace items if they are defective or damaged. If you need to exchange an item for the same product, send us an email at returns@jeweltaime.com with your order number and details.</p>

      <h2>5. Late or Missing Refunds</h2>
      <p>If you haven't received your refund within 10 business days, please check your bank account again, then contact your credit card company or bank. If you've done all of this and still haven't received your refund, please contact us at returns@jeweltaime.com.</p>

      <h2>6. Return Shipping</h2>
      <p>Return shipping costs are the responsibility of the customer unless the item is defective or incorrect. We recommend using a trackable shipping service for returns.</p>

      <h2>7. How to Start a Return</h2>
      <p>To initiate a return, please contact us at returns@jeweltaime.com with your order number and the reason for your return. We will provide you with return instructions and a return shipping address.</p>
    `
  },

  COOKIE_POLICY: {
    title: 'Cookie Policy',
    slug: 'COOKIE_POLICY',
    legacySlug: 'cookie-policy',
    contentHtml: `
      <h1>Cookie Policy</h1>
      <p><em>Last updated: June 2025</em></p>

      <h2>1. What Are Cookies</h2>
      <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to site owners.</p>

      <h2>2. How We Use Cookies</h2>
      <p>We use cookies for the following purposes:</p>
      <ul>
        <li><strong>Essential Cookies:</strong> Required for the Site to function properly (e.g., shopping cart, authentication)</li>
        <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our Site by collecting anonymous data</li>
        <li><strong>Marketing Cookies:</strong> Used to track visitors across websites to display relevant advertisements</li>
        <li><strong>Preference Cookies:</strong> Allow the Site to remember choices you make (e.g., language, region)</li>
      </ul>

      <h2>3. Types of Cookies We Use</h2>
      <ul>
        <li><strong>Session Cookies:</strong> Temporary cookies that are deleted when you close your browser</li>
        <li><strong>Persistent Cookies:</strong> Remain on your device until you delete them or they expire</li>
        <li><strong>Third-Party Cookies:</strong> Set by third-party services integrated into our Site (e.g., Google Analytics, payment processors)</li>
      </ul>

      <h2>4. Managing Cookies</h2>
      <p>You can control and manage cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our Site.</p>
      <ul>
        <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
        <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies</li>
        <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
        <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
      </ul>

      <h2>5. Third-Party Services</h2>
      <p>We may use third-party services that set cookies on your device, including:</p>
      <ul>
        <li>Google Analytics — for website analytics</li>
        <li>Airwallex — for payment processing</li>
        <li>Social media platforms — for sharing functionality</li>
      </ul>

      <h2>6. Updates to This Policy</h2>
      <p>We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated "Last updated" date.</p>
    `
  },

  ACCESSIBILITY_POLICY: {
    title: 'Accessibility Policy',
    slug: 'ACCESSIBILITY_POLICY',
    legacySlug: 'accessibility-policy',
    contentHtml: `
      <h1>Accessibility Policy</h1>
      <p><em>Last updated: June 2025</em></p>

      <h2>1. Our Commitment</h2>
      <p>JewelT'Aime is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to ensure we provide equal access to all users.</p>

      <h2>2. Standards</h2>
      <p>We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone.</p>

      <h2>3. Measures Taken</h2>
      <p>We have taken the following measures to ensure accessibility:</p>
      <ul>
        <li>Semantic HTML markup for proper page structure</li>
        <li>Keyboard navigation support for all interactive elements</li>
        <li>Alt text for all images</li>
        <li>Adequate colour contrast ratios for text and background</li>
        <li>Responsive design for various screen sizes and assistive technologies</li>
        <li>ARIA labels and roles where appropriate</li>
        <li>Regular accessibility testing and audits</li>
      </ul>

      <h2>4. Known Limitations</h2>
      <p>Despite our best efforts, some content may not yet be fully accessible. We are actively working to address any accessibility barriers and improve our compliance over time.</p>

      <h2>5. Third-Party Content</h2>
      <p>Some content on our Site may be provided by third-party services (e.g., payment processors, social media embeds). We are not responsible for the accessibility of third-party content but encourage our partners to provide accessible experiences.</p>

      <h2>6. Feedback</h2>
      <p>We welcome your feedback on the accessibility of our website. If you encounter any accessibility barriers or have suggestions for improvement, please contact us at accessibility@jeweltaime.com.</p>

      <h2>7. Enforcement</h2>
      <p>This Accessibility Policy is reviewed periodically and updated as needed. All employees are trained on accessibility best practices and our commitment to inclusive design.</p>
    `
  },

  CONTACT_US: {
    title: 'Contact Us',
    slug: 'CONTACT_US',
    legacySlug: 'contact-us',
    contentHtml: `
      <h1>Contact Us</h1>
      <p><em>Last updated: June 2025</em></p>

      <h2>Get in Touch</h2>
      <p>We'd love to hear from you. Whether you have a question about our products, your order, or just want to say hello — we're here to help.</p>

      <h2>Customer Service</h2>
      <ul>
        <li><strong>Email:</strong> support@jeweltaime.com</li>
        <li><strong>Phone:</strong> (+800) 1234 5678</li>
        <li><strong>Hours:</strong> Monday - Sunday, 09:00 am - 20:00 pm</li>
      </ul>

      <h2>Mailing Address</h2>
      <p>JewelT'Aime Ltd.<br>7021 Washington Sq.<br>South New York, NY 10012</p>

      <h2>Social Media</h2>
      <p>Follow us on social media for the latest updates, promotions, and jewellery inspiration.</p>

      <h2>Response Time</h2>
      <p>We aim to respond to all inquiries within 24 business hours. During peak seasons, response times may be slightly longer.</p>
    `
  },

  AUTHENTICITY_AND_WARRANTY_POLICY: {
    title: 'Authenticity & Warranty Policy',
    slug: 'AUTHENTICITY_AND_WARRANTY_POLICY',
    legacySlug: null,
    contentHtml: `
      <h1>Authenticity & Warranty Policy</h1>
      <p><em>Last updated: June 2025</em></p>

      <h2>1. Authenticity Guarantee</h2>
      <p>JewelT'Aime guarantees that all jewellery purchased from our Site is authentic and crafted from the materials described. Every piece undergoes rigorous quality control before being shipped to you.</p>

      <h2>2. Certification</h2>
      <p>Our fine jewellery comes with a Certificate of Authenticity detailing the materials, gemstone specifications, and craftsmanship of your piece. For diamond items, an independent gemological grading report is included where applicable.</p>

      <h2>3. Warranty Coverage</h2>
      <p>We offer a 2-year warranty on all jewellery against manufacturing defects. This warranty covers:</p>
      <ul>
        <li>Defective clasps, links, and findings</li>
        <li>Stone setting issues</li>
        <li>Manufacturing flaws in materials or workmanship</li>
      </ul>

      <h2>4. Warranty Exclusions</h2>
      <p>The warranty does not cover:</p>
      <ul>
        <li>Damage caused by accident, misuse, or neglect</li>
        <li>Normal wear and tear, including scratches and dents</li>
        <li>Loss of gemstones not due to setting defects</li>
        <li>Damage from third-party repairs or alterations</li>
        <li>Loss or theft of the item</li>
      </ul>

      <h2>5. Making a Warranty Claim</h2>
      <p>To make a warranty claim, contact our customer service team with your order number, a description of the issue, and photographs. We will assess your claim and provide return shipping instructions if approved.</p>

      <h2>6. Lifetime Care</h2>
      <p>We offer complimentary cleaning and inspection for the lifetime of your jewellery. Visit us in-store or contact customer service to arrange this service.</p>
    `
  },

  ANTI_MONEY_LAUNDERING_POLICY: {
    title: 'Anti-Money Laundering Policy',
    slug: 'ANTI_MONEY_LAUNDERING_POLICY',
    legacySlug: null,
    contentHtml: `
      <h1>Anti-Money Laundering Policy</h1>
      <p><em>Last updated: June 2025</em></p>

      <h2>1. Policy Statement</h2>
      <p>JewelT'Aime is committed to preventing money laundering and terrorist financing through its business operations. We comply with all applicable anti-money laundering (AML) laws and regulations.</p>

      <h2>2. Customer Due Diligence</h2>
      <p>We verify the identity of our customers through appropriate documentation and maintain records of these verifications. For large transactions, enhanced due diligence measures may be applied.</p>

      <h2>3. Transaction Monitoring</h2>
      <p>We monitor transactions for unusual patterns or suspicious activity. This includes transactions involving large sums, unusual payment methods, or atypical purchase behaviour.</p>

      <h2>4. Reporting Obligations</h2>
      <p>Where we identify suspicious activity, we are obligated to report it to the relevant financial intelligence authority. We will keep such reports confidential.</p>

      <h2>5. Record Keeping</h2>
      <p>We maintain transaction records and customer identification documents for the period required by applicable law. These records are securely stored and accessible only to authorised personnel.</p>

      <h2>6. Staff Training</h2>
      <p>Our employees receive regular training on AML compliance, recognising suspicious activity, and following proper reporting procedures.</p>
    `
  },

  ETHICAL_SOURCING_POLICY: {
    title: 'Ethical Sourcing Policy',
    slug: 'ETHICAL_SOURCING_POLICY',
    legacySlug: null,
    contentHtml: `
      <h1>Ethical Sourcing Policy</h1>
      <p><em>Last updated: June 2025</em></p>

      <h2>1. Our Commitment</h2>
      <p>JewelT'Aime is dedicated to sourcing materials and products in an ethical, responsible, and sustainable manner. We believe that luxury should never come at the expense of human dignity or environmental harm.</p>

      <h2>2. Conflict-Free Diamonds</h2>
      <p>All diamonds in our jewellery are sourced from conflict-free zones and comply with the Kimberley Process Certification Scheme. We require our suppliers to provide written guarantees that their diamonds are conflict-free.</p>

      <h2>3. Responsible Gold Sourcing</h2>
      <p>We source our gold from suppliers who adhere to responsible mining practices, including fair labour standards, environmental stewardship, and community engagement. Where possible, we use recycled gold in our collections.</p>

      <h2>4. Supplier Code of Conduct</h2>
      <p>All suppliers must agree to our Supplier Code of Conduct, which requires:</p>
      <ul>
        <li>Compliance with all applicable labour laws and regulations</li>
        <li>Prohibition of child labour and forced labour</li>
        <li>Fair wages and safe working conditions</li>
        <li>Environmental compliance and sustainable practices</li>
        <li>Transparency in their supply chain</li>
      </ul>

      <h2>5. Environmental Responsibility</h2>
      <p>We strive to minimise our environmental footprint through responsible packaging, waste reduction, and energy-efficient operations. Our packaging is fully recyclable and we are continually working to improve our sustainability practices.</p>

      <h2>6. Ongoing Monitoring</h2>
      <p>We regularly audit our supply chain to ensure compliance with this policy. Suppliers found to be in violation will face corrective action, up to and including termination of the business relationship.</p>
    `
  },

  ACCESSIBILITY_STATEMENT: {
    title: 'Accessibility Statement',
    slug: 'ACCESSIBILITY_STATEMENT',
    legacySlug: null,
    contentHtml: `
      <h1>Accessibility Statement</h1>
      <p><em>Last updated: June 2025</em></p>

      <h2>Our Commitment to Accessibility</h2>
      <p>JewelT'Aime is committed to making our website accessible to everyone, including individuals with disabilities. We continuously work to improve the accessibility of our digital experiences.</p>

      <h2>Conformance Status</h2>
      <p>Our website strives to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. We engage in regular accessibility reviews and testing to maintain compliance.</p>

      <h2>Accessibility Features</h2>
      <ul>
        <li>Keyboard navigation support throughout the site</li>
        <li>Descriptive alt text for meaningful images</li>
        <li>High contrast colour scheme for readability</li>
        <li>Consistent and predictable navigation structure</li>
        <li>Scalable text that supports browser zoom</li>
        <li>Accessible forms with proper labels and error messaging</li>
        <li>Screen reader compatibility tested with NVDA, JAWS, and VoiceOver</li>
      </ul>

      <h2>Ongoing Efforts</h2>
      <p>We regularly test our website using automated tools and manual reviews. Our development team follows accessibility best practices when building new features and updating existing ones.</p>

      <h2>Feedback & Support</h2>
      <p>If you experience any difficulty accessing our website or have suggestions for improvement, please contact us:</p>
      <ul>
        <li><strong>Email:</strong> accessibility@jeweltaime.com</li>
        <li><strong>Phone:</strong> (+800) 1234 5678</li>
      </ul>
      <p>We aim to respond to accessibility feedback within 2 business days.</p>

      <h2>Enforcement Procedure</h2>
      <p>If you are not satisfied with our response to an accessibility issue, you may escalate your concern to our Customer Service Director who will review and address the matter within 14 business days.</p>
    `
  }
};

// Build lookup maps for both ERP-style slugs (UPPER_SNAKE_CASE) and legacy slugs (kebab-case)
const slugToKey = {};
const legacySlugToKey = {};

Object.keys(policies).forEach(key => {
  const policy = policies[key];
  slugToKey[policy.slug] = key;
  if (policy.legacySlug) {
    legacySlugToKey[policy.legacySlug] = key;
  }
});

/**
 * GET /api/policies
 * List all available policies (titles and slugs — ERP enum format)
 */
router.get('/', (req, res) => {
  const list = Object.keys(policies).map(key => ({
    slug: policies[key].slug,
    title: policies[key].title
  }));
  res.json({ success: true, data: list });
});

/**
 * GET /api/policies/:slug
 * Get a single policy by slug. Supports both ERP-style slugs (TERMS_AND_CONDITIONS)
 * and legacy kebab-case slugs (terms-and-conditions) for backward compatibility.
 * Response format aligned with ERP Legal Policy schema: { slug, title, contentHtml }
 */
router.get('/:slug', (req, res) => {
  const { slug } = req.params;

  // Try exact UPPER_SNAKE_CASE match first, then legacy kebab-case fallback
  const key = slugToKey[slug] || legacySlugToKey[slug];

  if (!key || !policies[key]) {
    return res.status(404).json({
      success: false,
      error: 'Policy not found'
    });
  }

  res.json({
    success: true,
    data: {
      slug: policies[key].slug,
      title: policies[key].title,
      contentHtml: policies[key].contentHtml
    }
  });
});

module.exports = router;