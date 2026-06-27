// ============================================================
// DogParentGuide - Legal Pages (Privacy, Terms, etc.)
// ============================================================

import { useParams } from 'react-router-dom';
import { SEOHead } from '../components/layout/SEOHead';
import { formatDate } from '../utils/helpers';

interface LegalContent {
  title: string;
  lastUpdated: string;
  content: string;
}

const legalPages: Record<string, LegalContent> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    lastUpdated: '2024-01-01',
    content: `
      <h2>1. Information We Collect</h2>
      <p>DogParentGuide ("we," "us," or "our") collects information you provide directly to us, such as when you subscribe to our newsletter, contact us, or interact with our website. This may include:</p>
      <ul>
        <li>Name and email address (newsletter subscriptions)</li>
        <li>Contact form submissions</li>
        <li>Comments and feedback</li>
        <li>Technical data (IP address, browser type, pages visited)</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Send you our newsletter and updates (with your consent)</li>
        <li>Respond to your inquiries and requests</li>
        <li>Improve our website and content</li>
        <li>Analyze website traffic and usage patterns</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2>3. Cookies</h2>
      <p>We use cookies and similar tracking technologies to enhance your browsing experience. These include:</p>
      <ul>
        <li><strong>Essential cookies:</strong> Required for the website to function</li>
        <li><strong>Analytics cookies:</strong> Help us understand how visitors use our site</li>
        <li><strong>Advertising cookies:</strong> Used by our advertising partners</li>
      </ul>
      <p>You can control cookies through your browser settings. See our Cookie Policy for more details.</p>

      <h2>4. Third-Party Services</h2>
      <p>Our website may use third-party services including Google Analytics, advertising networks, and newsletter providers. These services have their own privacy policies governing their use of information.</p>

      <h2>5. Data Security</h2>
      <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

      <h2>6. Your Rights</h2>
      <p>Depending on your location, you may have the right to:</p>
      <ul>
        <li>Access the personal information we hold about you</li>
        <li>Request correction of inaccurate information</li>
        <li>Request deletion of your information</li>
        <li>Opt out of marketing communications</li>
        <li>Lodge a complaint with your local data protection authority</li>
      </ul>

      <h2>7. Contact Us</h2>
      <p>If you have questions about this Privacy Policy or our data practices, please contact us at <a href="mailto:privacy@dogparentguide.com">privacy@dogparentguide.com</a>.</p>
    `,
  },
  'terms': {
    title: 'Terms of Service',
    lastUpdated: '2024-01-01',
    content: `
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using DogParentGuide ("the Website"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.</p>

      <h2>2. Use of Content</h2>
      <p>All content on DogParentGuide is for informational purposes only. The information provided is not a substitute for professional veterinary advice, diagnosis, or treatment.</p>

      <h2>3. Intellectual Property</h2>
      <p>All content on this website, including text, images, graphics, and other materials, is owned by or licensed to DogParentGuide and is protected by copyright law. You may not reproduce, distribute, or create derivative works without our written permission.</p>

      <h2>4. User Conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the website for any unlawful purpose</li>
        <li>Submit false or misleading information</li>
        <li>Attempt to gain unauthorized access to our systems</li>
        <li>Interfere with the proper functioning of the website</li>
      </ul>

      <h2>5. Disclaimer of Warranties</h2>
      <p>The website is provided "as is" without warranties of any kind. We do not warrant that the website will be error-free or uninterrupted.</p>

      <h2>6. Limitation of Liability</h2>
      <p>DogParentGuide shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the website or the information contained herein.</p>

      <h2>7. Changes to Terms</h2>
      <p>We reserve the right to modify these terms at any time. Your continued use of the website after changes constitutes acceptance of the new terms.</p>
    `,
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    lastUpdated: '2024-01-01',
    content: `
      <h2>What Are Cookies?</h2>
      <p>Cookies are small text files stored on your device when you visit websites. They help websites remember your preferences and understand how you interact with the site.</p>

      <h2>How We Use Cookies</h2>
      <h3>Essential Cookies</h3>
      <p>These cookies are necessary for the website to function properly. They cannot be disabled without affecting core functionality.</p>

      <h3>Analytics Cookies</h3>
      <p>We use Google Analytics to understand how visitors interact with our website. This data helps us improve our content and user experience. These cookies collect anonymous information about page views, time on site, and traffic sources.</p>

      <h3>Advertising Cookies</h3>
      <p>We work with advertising partners who may place cookies to deliver relevant ads. These cookies may track your browsing behavior across websites.</p>

      <h2>Managing Cookies</h2>
      <p>You can control cookies through your browser settings:</p>
      <ul>
        <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
        <li><strong>Firefox:</strong> Options → Privacy & Security</li>
        <li><strong>Safari:</strong> Preferences → Privacy</li>
        <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
      </ul>
      <p>Note that disabling cookies may affect some website functionality.</p>

      <h2>Third-Party Cookies</h2>
      <p>Some features of our website may be provided by third parties (Google, Facebook, etc.) who may also set their own cookies. Please refer to those companies' privacy policies for more information.</p>
    `,
  },
  'disclaimer': {
    title: 'Disclaimer',
    lastUpdated: '2024-01-01',
    content: `
      <h2>Medical Disclaimer</h2>
      <p>The content on DogParentGuide is provided for informational and educational purposes only. It is not intended to be a substitute for professional veterinary advice, diagnosis, or treatment.</p>
      <p><strong>Always seek the advice of your veterinarian</strong> or other qualified animal health provider with any questions you may have regarding a medical condition. Never disregard professional veterinary advice or delay seeking it because of something you have read on this website.</p>

      <h2>Accuracy of Information</h2>
      <p>While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind about the completeness, accuracy, reliability, or suitability of the information contained on this website.</p>

      <h2>External Links</h2>
      <p>Our website may contain links to external websites. We are not responsible for the content, accuracy, or practices of those sites.</p>

      <h2>Results Not Guaranteed</h2>
      <p>Individual results may vary. Training techniques, nutritional advice, and health recommendations may not be appropriate for all dogs. Always consult with professionals who can assess your specific dog's needs.</p>

      <h2>Emergency Situations</h2>
      <p>If your dog is experiencing a medical emergency, please contact your veterinarian or an emergency veterinary clinic immediately. Do not rely on this website for emergency medical guidance.</p>
    `,
  },
  'affiliate-disclosure': {
    title: 'Affiliate Disclosure',
    lastUpdated: '2024-01-01',
    content: `
      <h2>FTC Disclosure</h2>
      <p>DogParentGuide participates in affiliate marketing programs. This means we may earn a commission when you click on certain links and make a purchase, at no additional cost to you.</p>

      <h2>Our Affiliate Relationships</h2>
      <p>We participate in affiliate programs including, but not limited to:</p>
      <ul>
        <li>Amazon Associates</li>
        <li>Chewy Affiliate Program</li>
        <li>Various pet product brands and retailers</li>
      </ul>

      <h2>Our Commitment to You</h2>
      <p>Our affiliate relationships never influence our editorial content or product recommendations. We only recommend products and services we believe provide genuine value to dog parents. Our reviews and recommendations are based on honest assessment, not commercial relationships.</p>

      <h2>How to Identify Affiliate Links</h2>
      <p>Affiliate links may be identified by a disclaimer at the top of relevant articles or pages. We strive to be transparent about our commercial relationships.</p>

      <h2>Contact</h2>
      <p>If you have questions about our affiliate relationships, please contact us at <a href="mailto:hello@dogparentguide.com">hello@dogparentguide.com</a>.</p>
    `,
  },
  'editorial-policy': {
    title: 'Editorial Policy',
    lastUpdated: '2024-01-01',
    content: `
      <h2>Our Editorial Mission</h2>
      <p>DogParentGuide is committed to providing accurate, helpful, and evidence-based information to dog parents. Our editorial team upholds the highest standards of journalistic integrity.</p>

      <h2>Content Creation Process</h2>
      <h3>Research</h3>
      <p>Our writers research topics thoroughly using peer-reviewed veterinary literature, guidelines from recognized animal health organizations, and interviews with licensed professionals.</p>

      <h3>Writing</h3>
      <p>Content is written by specialists in their relevant fields, including veterinarians, certified trainers, and experienced dog care professionals.</p>

      <h3>Expert Review</h3>
      <p>All health and medical content is reviewed by at least one licensed veterinarian before publication. Training content is reviewed by certified professional dog trainers.</p>

      <h3>Fact-Checking</h3>
      <p>Our editorial team fact-checks all claims against authoritative sources, including veterinary textbooks, AVMA guidelines, and peer-reviewed journals.</p>

      <h2>Editorial Independence</h2>
      <p>Our editorial decisions are completely independent of our advertising and commercial relationships. Advertisers and sponsors do not influence our content, ratings, or recommendations.</p>

      <h2>Corrections Policy</h2>
      <p>If we discover an error in our content, we will correct it promptly and note the correction at the bottom of the article. We take accuracy seriously and appreciate readers who point out errors.</p>

      <h2>Update Policy</h2>
      <p>We regularly review and update our content to ensure it reflects current veterinary guidelines and research. The "last updated" date on articles reflects when significant changes were made.</p>
    `,
  },
  'dmca': {
    title: 'DMCA Policy',
    lastUpdated: '2024-01-01',
    content: `
      <h2>Digital Millennium Copyright Act (DMCA) Policy</h2>
      <p>DogParentGuide respects the intellectual property rights of others and expects users of our website to do the same.</p>

      <h2>Reporting Copyright Infringement</h2>
      <p>If you believe that content on our website infringes your copyright, please submit a DMCA takedown notice to our designated copyright agent with the following information:</p>
      <ol>
        <li>A description of the copyrighted work you claim has been infringed</li>
        <li>The URL or location on our website where the allegedly infringing content appears</li>
        <li>Your contact information (name, address, phone number, email)</li>
        <li>A statement that you have a good faith belief that the use is not authorized</li>
        <li>A statement that the information in your notice is accurate</li>
        <li>Your physical or electronic signature</li>
      </ol>

      <h2>Designated Copyright Agent</h2>
      <p>Send DMCA notices to: <a href="mailto:dmca@dogparentguide.com">dmca@dogparentguide.com</a></p>

      <h2>Counter-Notice</h2>
      <p>If you believe content was removed in error, you may submit a counter-notice with the required information under 17 U.S.C. § 512(g).</p>

      <h2>Repeat Infringers</h2>
      <p>We reserve the right to terminate accounts of users who repeatedly infringe copyright in accordance with our Terms of Service.</p>
    `,
  },
};

export function LegalPage() {
  const { page } = useParams<{ page: string }>();
  const pageKey = page || 'privacy-policy';
  const content = legalPages[pageKey];

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Page not found</p>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${content.title} | DogParentGuide`}
        description={`DogParentGuide's ${content.title} - last updated ${formatDate(content.lastUpdated)}.`}
        url={`/${pageKey}`}
        noindex
      />

      <main>
        <div className="bg-gray-50 py-10 border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl font-black text-gray-900">{content.title}</h1>
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {formatDate(content.lastUpdated)}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
              prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-ul:list-disc prose-ul:pl-6
              prose-ol:list-decimal prose-ol:pl-6
              prose-li:text-gray-700 prose-li:mb-1
              prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900
            "
            dangerouslySetInnerHTML={{ __html: content.content }}
          />

          <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-sm text-gray-600">
              If you have questions about this {content.title}, please{' '}
              <a href="/contact" className="text-green-600 font-semibold hover:underline">contact us</a>.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
