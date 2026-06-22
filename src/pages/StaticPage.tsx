import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Mail, MessageSquare, HelpCircle, Shield, FileText, Lock, Users, Zap, Globe } from 'lucide-react';

const AboutPage = () => (
  <div className="space-y-24">
    <Helmet>
      <title>About Us | SmarTools - Empowering Creators</title>
      <meta name="description" content="SmarTools is a leading platform providing 200+ free online tools for developers, designers, and creators. Learn about our privacy-first mission." />
    </Helmet>
    <section className="text-center max-w-4xl mx-auto pt-12">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-text-primary mb-6 tracking-tight leading-tight">Empowering creators with <br/><span className="text-text-muted">premium tools, for free.</span></h1>
      <p className="text-xl text-text-muted leading-relaxed max-w-2xl mx-auto">
        SmarTools started with a simple mission: to build the most beautiful, reliable, and privacy-focused utility platform on the internet.
      </p>
    </section>

    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-card border border-border p-8 rounded-3xl shadow-sm text-center">
        <div className="w-16 h-16 bg-surface border border-border rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Shield className="w-8 h-8 text-text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-text-primary mb-3">Privacy First</h3>
        <p className="text-text-muted leading-relaxed">Most of our tools run entirely in your browser using WebAssembly. Your files never leave your device.</p>
      </div>
      <div className="bg-card border border-border p-8 rounded-3xl shadow-sm text-center">
        <div className="w-16 h-16 bg-surface border border-border rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Zap className="w-8 h-8 text-text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-text-primary mb-3">Blazing Fast</h3>
        <p className="text-text-muted leading-relaxed">No waiting in server queues or dealing with upload limits. Instant processing, every single time.</p>
      </div>
      <div className="bg-card border border-border p-8 rounded-3xl shadow-sm text-center">
        <div className="w-16 h-16 bg-surface border border-border rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Globe className="w-8 h-8 text-text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-text-primary mb-3">100% Free</h3>
        <p className="text-text-muted leading-relaxed">Enterprise-grade tools without the enterprise price tag. No paywalls, no subscriptions.</p>
      </div>
    </section>

    <section className="bg-card border border-border rounded-3xl p-12 shadow-sm text-center">
      <h2 className="text-4xl font-extrabold text-text-primary mb-6">Ready to streamline your workflow?</h2>
      <Link to="/tools">
        <button className="px-8 py-4 bg-button-primary text-button-primary-text font-bold rounded-full hover:opacity-90 transition-opacity text-lg">
          Explore the Directory
        </button>
      </Link>
    </section>
  </div>
);

const ContactPage = () => (
  <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 pt-12">
    <Helmet>
      <title>Contact Us | Support & Community | SmarTools</title>
      <meta name="description" content="Get in touch with the SmarTools team. For support, bug reports, or feature requests, contact us via email or join our community Discord server." />
    </Helmet>
    <div className="lg:w-1/2">
      <h1 className="text-5xl lg:text-6xl font-extrabold text-text-primary mb-6 tracking-tight">Get in touch</h1>
      <p className="text-xl text-text-muted leading-relaxed mb-12">
        Have a question, feature request, or found a bug? We're here to help. Reach out to our team.
      </p>

      <div className="space-y-6">
        <div className="flex items-start gap-4 p-6 bg-card border border-border rounded-3xl shadow-sm">
          <div className="p-4 bg-surface rounded-2xl border border-border shrink-0">
            <Mail className="w-6 h-6 text-text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Email Support</h3>
            <p className="text-text-muted mb-2">Our team typically responds within 24 hours.</p>
            <a href="mailto:support@smartools.pages.dev" className="font-bold text-text-primary hover:underline">support@smartools.pages.dev</a>
          </div>
        </div>
        
        <div className="flex items-start gap-4 p-6 bg-card border border-border rounded-3xl shadow-sm">
          <div className="p-4 bg-surface rounded-2xl border border-border shrink-0">
            <MessageSquare className="w-6 h-6 text-text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Community Discord</h3>
            <p className="text-text-muted mb-2">Join our community to ask questions and share feedback.</p>
            <a href="#" className="font-bold text-text-primary hover:underline">Join Server &rarr;</a>
          </div>
        </div>
      </div>
    </div>

    <div className="lg:w-1/2">
      <div className="bg-card border border-border p-8 sm:p-12 rounded-3xl shadow-sm">
        <h3 className="text-2xl font-bold text-text-primary mb-8">Send a message</h3>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">First Name</label>
              <input type="text" className="w-full bg-surface border border-border text-text-primary px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-text-primary" placeholder="Jane" />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">Last Name</label>
              <input type="text" className="w-full bg-surface border border-border text-text-primary px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-text-primary" placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-text-primary mb-2">Email Address</label>
            <input type="email" className="w-full bg-surface border border-border text-text-primary px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-text-primary" placeholder="jane@example.com" />
          </div>
          <div>
            <label className="block text-sm font-bold text-text-primary mb-2">Message</label>
            <textarea className="w-full bg-surface border border-border text-text-primary px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-text-primary h-32 resize-none" placeholder="How can we help?"></textarea>
          </div>
          <button className="w-full py-4 bg-button-primary text-button-primary-text font-bold rounded-xl hover:opacity-90 transition-opacity text-lg">
            Send Message
          </button>
        </form>
      </div>
    </div>
  </div>
);

type LegalPageType = 'privacy' | 'terms' | 'cookie' | 'gdpr' | 'accessibility';

const LegalPage = ({ type }: { type: LegalPageType }) => {
  const getPageConfig = (type: LegalPageType) => {
    switch (type) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          description: 'Read our Privacy Policy to understand how SmarTools handles your data securely.',
          date: 'October 2023',
          content: (
            <>
              <p>At SmarTools, your privacy is our top priority. We've built our tools to run entirely in your browser whenever possible. This means your data remains strictly on your device.</p>
              <h2>1. Information We Collect</h2>
              <p>We do not collect, store, or process your files on our servers for any tool that operates client-side. For AI tools that require server processing, files are immediately and permanently deleted post-processing. We collect minimal analytics to understand traffic patterns.</p>
              <h2>2. Local Storage Usage</h2>
              <p>We use local storage (like Zustand persist) to save your theme preferences and recently used tools locally on your device. We do not use third-party tracking cookies.</p>
              <h2>3. Third-Party Services</h2>
              <p>We use privacy-friendly analytics (plausible.io) to track aggregate page views. This does not track individual user behavior or IP addresses. Some AI features may use third-party APIs (like OpenAI), but we ensure data sent is anonymized and not used for training.</p>
              <h2>4. Your Privacy Rights</h2>
              <p>Because we do not store your personal data or user accounts, there is no personal data to delete on our end. You can clear your local preferences at any time by clearing your browser's local storage.</p>
            </>
          )
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          description: 'Read the SmarTools Terms of Service to understand your rights and responsibilities when using our platform.',
          date: 'October 2023',
          content: (
            <>
              <p>Welcome to SmarTools. By accessing our platform, you agree to these Terms of Service.</p>
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing or using our tools, you confirm your acceptance of these Terms. If you do not agree to these Terms, you may not use our services.</p>
              <h2>2. Use of Tools</h2>
              <p>Our tools are provided "as is" without warranty of any kind. While we strive for accuracy, we cannot guarantee perfection in automated conversions or AI generations. You are entirely responsible for verifying the output before using it in production environments.</p>
              <h2>3. Prohibited Conduct</h2>
              <p>You may not use our platform for illegal activities, automated scraping of our tool endpoints, attempting to breach our security systems, or reverse engineering our proprietary code. You may not use our tools to process illegal, explicit, or copyright-infringing material.</p>
              <h2>4. Intellectual Property</h2>
              <p>The design, code, and branding of SmarTools are owned by us. The content you generate or process using our tools remains your property. We claim no ownership over your inputs or outputs.</p>
              <h2>5. Limitation of Liability</h2>
              <p>SmarTools shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our tools.</p>
            </>
          )
        };
      case 'cookie':
        return {
          title: 'Cookie Policy',
          description: 'Learn about how SmarTools uses cookies and local storage to improve your experience.',
          date: 'October 2023',
          content: (
            <>
              <p>This Cookie Policy explains how SmarTools uses cookies and similar technologies to recognize you when you visit our website.</p>
              <h2>1. What are Cookies?</h2>
              <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide reporting information.</p>
              <h2>2. How We Use Local Storage</h2>
              <p>SmarTools primarily uses HTML5 Local Storage instead of traditional cookies. We use local storage to:
                <ul>
                  <li>Remember your dark/light theme preference.</li>
                  <li>Store your recently used tools for quick access.</li>
                  <li>Maintain your favorite tools list locally.</li>
                </ul>
              </p>
              <h2>3. Analytics Cookies</h2>
              <p>We use Plausible Analytics, which is a privacy-first analytics tool. It does not use cookies and does not collect any personal data. We do not use intrusive tracking cookies from third-party advertising networks.</p>
              <h2>4. Managing Your Preferences</h2>
              <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your web browser controls to accept or refuse cookies. Since we use Local Storage, you can clear site data in your browser settings to reset your preferences.</p>
            </>
          )
        };
      case 'gdpr':
        return {
          title: 'GDPR Compliance',
          description: 'Learn how SmarTools complies with the General Data Protection Regulation (GDPR).',
          date: 'October 2023',
          content: (
            <>
              <p>SmarTools is committed to protecting your privacy and complying with the General Data Protection Regulation (GDPR).</p>
              <h2>1. Data Minimization</h2>
              <p>The core principle of SmarTools is data minimization. By processing your files locally in your browser using WebAssembly, we avoid collecting personal data entirely. What we do not collect, we do not have to protect or process.</p>
              <h2>2. Lawful Basis for Processing</h2>
              <p>For the limited server-side processing we do (e.g., API requests for AI tools), our lawful basis is the provision of the requested service (contractual necessity). All server-side files are ephemeral and deleted immediately after processing.</p>
              <h2>3. Your GDPR Rights</h2>
              <p>Under GDPR, you have the right to access, rectify, port, and erase your data. Since SmarTools does not require user accounts or store personal data, these requests are typically not applicable to our platform. However, if you believe we hold any personal data about you, please contact us at privacy@smartools.pages.dev.</p>
              <h2>4. Data Transfers</h2>
              <p>If you are accessing SmarTools from the European Economic Area (EEA), please note that server-side requests (if any) may be processed in the United States. We ensure appropriate safeguards are in place for any such transfers.</p>
            </>
          )
        };
      case 'accessibility':
        return {
          title: 'Accessibility Statement',
          description: 'SmarTools is committed to digital accessibility for people with disabilities.',
          date: 'October 2023',
          content: (
            <>
              <p>SmarTools is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>
              <h2>1. Conformance Status</h2>
              <p>We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 level AA. These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone.</p>
              <h2>2. Accessibility Features</h2>
              <p>Our platform includes the following accessibility features:
                <ul>
                  <li>High contrast color schemes available in both Light and Dark modes.</li>
                  <li>Keyboard-navigable interfaces, including tools, menus, and forms.</li>
                  <li>ARIA labels and semantic HTML5 structuring for screen readers.</li>
                  <li>Clear focus indicators for keyboard users.</li>
                </ul>
              </p>
              <h2>3. Feedback</h2>
              <p>We welcome your feedback on the accessibility of SmarTools. If you encounter any accessibility barriers on our platform, please contact our support team. We try to respond to feedback within 2 business days.</p>
              <h2>4. Ongoing Efforts</h2>
              <p>Accessibility is an ongoing effort. We actively test our platform using automated tools and manual keyboard/screen-reader testing to identify and resolve issues.</p>
            </>
          )
        };
    }
  };

  const config = getPageConfig(type);

  return (
    <div className="flex flex-col md:flex-row gap-12 pt-12">
      <Helmet>
        <title>{config.title} | SmarTools</title>
        <meta name="description" content={config.description} />
      </Helmet>
      <div className="md:w-1/4 shrink-0">
        <div className="sticky top-32 space-y-2">
          <Link to="/privacy" className={`block px-4 py-3 rounded-xl font-bold transition-colors ${type === 'privacy' ? 'bg-button-primary text-button-primary-text' : 'text-text-muted hover:text-text-primary hover:bg-card border border-transparent hover:border-border'}`}>
            Privacy Policy
          </Link>
          <Link to="/terms" className={`block px-4 py-3 rounded-xl font-bold transition-colors ${type === 'terms' ? 'bg-button-primary text-button-primary-text' : 'text-text-muted hover:text-text-primary hover:bg-card border border-transparent hover:border-border'}`}>
            Terms of Service
          </Link>
          <Link to="/cookie" className={`block px-4 py-3 rounded-xl font-bold transition-colors ${type === 'cookie' ? 'bg-button-primary text-button-primary-text' : 'text-text-muted hover:text-text-primary hover:bg-card border border-transparent hover:border-border'}`}>
            Cookie Policy
          </Link>
          <Link to="/gdpr" className={`block px-4 py-3 rounded-xl font-bold transition-colors ${type === 'gdpr' ? 'bg-button-primary text-button-primary-text' : 'text-text-muted hover:text-text-primary hover:bg-card border border-transparent hover:border-border'}`}>
            GDPR Compliance
          </Link>
          <Link to="/accessibility" className={`block px-4 py-3 rounded-xl font-bold transition-colors ${type === 'accessibility' ? 'bg-button-primary text-button-primary-text' : 'text-text-muted hover:text-text-primary hover:bg-card border border-transparent hover:border-border'}`}>
            Accessibility
          </Link>
        </div>
      </div>
      <div className="md:w-3/4">
        <div className="bg-card border border-border rounded-3xl p-8 md:p-16 shadow-sm">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4 tracking-tight">
            {config.title}
          </h1>
          <p className="text-text-muted mb-12 font-medium">Last updated: {config.date}</p>
          
          <div className="prose prose-lg max-w-none text-text-muted prose-headings:font-extrabold prose-headings:text-text-primary prose-headings:tracking-tight prose-p:leading-relaxed prose-li:leading-relaxed prose-ul:my-4">
            {config.content}
          </div>
        </div>
      </div>
    </div>
  );
};

const BlogList = () => (
  <div className="pt-12">
    <Helmet>
      <title>Blog & Insights | SmarTools</title>
      <meta name="description" content="Stay updated with the latest news, tool updates, and tutorials from the SmarTools team." />
    </Helmet>
    <div className="mb-16 text-center max-w-4xl mx-auto">
      <h1 className="text-5xl lg:text-7xl font-extrabold text-text-primary mb-6 tracking-tight leading-tight">The SmarTools Blog</h1>
      <p className="text-xl text-text-muted leading-relaxed">
        Updates, tutorials, and insights from our team.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        { title: '10 New AI Tools Added to the Platform', cat: 'Product Updates', desc: 'We\'ve just expanded our AI toolkit with incredible new utilities for image generation.', slug: '10-new-ai-tools' },
        { title: 'How to Build a Design System', cat: 'Engineering', desc: 'A deep dive into how we constructed the Apple-like design system for SmarTools.', slug: 'building-design-system' },
        { title: 'Why Client-Side Processing is the Future', cat: 'Privacy', desc: 'An exploration of WebAssembly and why processing files locally is better for security.', slug: 'client-side-processing' },
        { title: 'Introducing the New PDF Suite', cat: 'Product Updates', desc: 'Merge, split, compress, and organize your PDFs without ever uploading them to a server.', slug: 'new-pdf-suite' },
      ].map((post, i) => (
        <Link to={`/blog/${post.slug}`} key={i} className="group flex flex-col h-full bg-card border border-border rounded-3xl overflow-hidden hover:shadow-md hover:border-text-primary transition-all duration-300">
          <div className="h-48 bg-surface border-b border-border w-full flex items-center justify-center">
             {/* Placeholder for cover image */}
             <FileText className="w-12 h-12 text-border group-hover:text-text-muted transition-colors" />
          </div>
          <div className="p-8 flex flex-col flex-grow">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">{post.cat}</span>
            <h3 className="text-2xl font-bold text-text-primary mb-3 leading-tight">{post.title}</h3>
            <p className="text-text-muted mb-6 flex-grow">{post.desc}</p>
            <div className="flex items-center text-sm font-bold text-text-primary group-hover:underline mt-auto">
              Read article <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

const CareersPage = () => (
  <div className="pt-12 max-w-4xl mx-auto">
    <Helmet>
      <title>Careers | Join the SmarTools Team</title>
      <meta name="description" content="We're hiring! Explore job opportunities at SmarTools and help us build the next generation of web tools." />
    </Helmet>
    <div className="text-center mb-16">
      <h1 className="text-5xl lg:text-7xl font-extrabold text-text-primary mb-6 tracking-tight">Join Our Team</h1>
      <p className="text-xl text-text-muted leading-relaxed">
        Help us build the most beautiful, reliable, and privacy-focused utility platform on the internet.
      </p>
    </div>
    
    <div className="space-y-6">
      {[
        { role: 'Senior Frontend Engineer', type: 'Full-time', location: 'Remote (US/EU)', dept: 'Engineering' },
        { role: 'Product Designer', type: 'Full-time', location: 'Remote', dept: 'Design' },
        { role: 'Developer Advocate', type: 'Full-time', location: 'Remote', dept: 'Marketing' }
      ].map((job, idx) => (
        <div key={idx} className="bg-card border border-border rounded-3xl p-8 hover:shadow-md hover:border-text-primary transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-text-primary mb-2">{job.role}</h3>
            <div className="flex gap-4 text-text-muted text-sm font-medium">
              <span>{job.dept}</span>
              <span>•</span>
              <span>{job.location}</span>
              <span>•</span>
              <span>{job.type}</span>
            </div>
          </div>
          <button className="shrink-0 px-6 py-3 bg-button-primary text-button-primary-text font-bold rounded-xl hover:opacity-90">
            Apply Now
          </button>
        </div>
      ))}
    </div>
  </div>
);

const PartnersPage = () => (
  <div className="pt-12 max-w-5xl mx-auto">
    <Helmet>
      <title>Partners | SmarTools Ecosystem</title>
      <meta name="description" content="Partner with SmarTools to integrate our premium web tools into your platform. Let's build together." />
    </Helmet>
    <div className="text-center mb-16">
      <h1 className="text-5xl lg:text-7xl font-extrabold text-text-primary mb-6 tracking-tight">Partner with Us</h1>
      <p className="text-xl text-text-muted leading-relaxed">
        Integrate our powerful, privacy-first tools directly into your ecosystem.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      <div className="bg-card border border-border p-8 rounded-3xl">
        <Users className="w-10 h-10 text-text-primary mb-6" />
        <h3 className="text-2xl font-bold text-text-primary mb-4">API Integration</h3>
        <p className="text-text-muted mb-6">Access our suite of tools programmatically. Build custom workflows and integrate our tools seamlessly into your product.</p>
        <button className="font-bold text-text-primary hover:underline flex items-center">
          Read API Docs <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      <div className="bg-card border border-border p-8 rounded-3xl">
        <Globe className="w-10 h-10 text-text-primary mb-6" />
        <h3 className="text-2xl font-bold text-text-primary mb-4">White-label Solutions</h3>
        <p className="text-text-muted mb-6">Deploy our toolset under your own domain with your branding. Perfect for enterprise teams and educational institutions.</p>
        <button className="font-bold text-text-primary hover:underline flex items-center">
          Contact Sales <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  </div>
);

export function StaticPage() {
  const { pageId } = useParams();
  
  const renderContent = () => {
    switch (pageId) {
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      case 'privacy': return <LegalPage type="privacy" />;
      case 'cookie': return <LegalPage type="cookie" />;
      case 'gdpr': return <LegalPage type="gdpr" />;
      case 'terms': return <LegalPage type="terms" />;
      case 'accessibility': return <LegalPage type="accessibility" />;
      case 'blog': return <BlogList />;
      case 'careers': return <CareersPage />;
      case 'partners': return <PartnersPage />;
      default:
        return (
          <div className="py-32 text-center bg-card border border-border rounded-3xl mt-12">
            <h1 className="text-4xl font-extrabold text-text-primary mb-4">Page Not Found</h1>
            <p className="text-xl text-text-muted mb-8">The requested static page does not exist.</p>
            <Link to="/">
              <button className="px-6 py-3 bg-button-primary text-button-primary-text font-bold rounded-full hover:opacity-90">Back to Home</button>
            </Link>
          </div>
        );
    }
  };

  // We are mostly overriding the <Helmet> in individual components, but keep the fallback
  const getTitle = () => {
    switch (pageId) {
      case 'about': return 'About Us';
      case 'contact': return 'Contact Us';
      case 'privacy': return 'Privacy Policy';
      case 'terms': return 'Terms of Service';
      case 'cookie': return 'Cookie Policy';
      case 'gdpr': return 'GDPR Compliance';
      case 'accessibility': return 'Accessibility';
      case 'blog': return 'Blog';
      case 'careers': return 'Careers';
      case 'partners': return 'Partners';
      default: return 'Page Not Found';
    }
  }

  return (
    <>
      <Helmet>
        <title>{getTitle()} | SmarTools</title>
        <meta name="description" content={`${getTitle()} on SmarTools.`} />
      </Helmet>
      
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen bg-surface">
        {renderContent()}
      </div>
    </>
  );
}
