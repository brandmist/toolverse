import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar, Share2, Twitter, Linkedin, Facebook } from 'lucide-react'

export function BlogDetail() {
  const { slug } = useParams()
  
  // Dummy static data since there's no CMS defined yet
  const post = {
    title: '10 New AI Tools Added to the Platform',
    date: 'Oct 24, 2023',
    readTime: '5 min read',
    author: {
      name: 'Sarah Chen',
      role: 'Head of Product',
      avatar: 'SC'
    },
    category: 'Product Updates',
    content: `
      <p>We are thrilled to announce the launch of 10 brand new AI-powered tools on ToolVerse. These additions mark a significant milestone in our mission to bring enterprise-grade utilities to everyone, for free.</p>
      
      <h2>The Future is AI</h2>
      <p>As the landscape of digital work evolves, so do the needs of our users. You've asked for more intelligent, automated ways to process images, generate content, and analyze data. We've listened.</p>
      
      <h3>What's New?</h3>
      <ul>
        <li><strong>AI Background Remover:</strong> Instantly separate subjects from their backgrounds with pixel-perfect precision.</li>
        <li><strong>Image Upscaler:</strong> Breathe new life into low-resolution images without losing clarity.</li>
        <li><strong>Smart Text Extraction:</strong> Pull text from any image or document in seconds.</li>
      </ul>

      <blockquote>
        "Our goal has always been to democratize access to premium tools. With these new AI capabilities, we're taking that promise to the next level." 
        <br/><br/>— Sarah Chen
      </blockquote>

      <h2>Privacy First, Always</h2>
      <p>Just like our traditional tools, we've built these AI utilities with your privacy in mind. Files processed by our AI servers are encrypted in transit and immediately permanently deleted the moment the processing is complete. We do not use your data to train our models.</p>

      <h2>Try Them Today</h2>
      <p>All 10 new tools are live on the platform right now. Head over to the <a href="/categories">Categories</a> page to explore the new "AI Tools" section.</p>
    `
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center text-sm font-semibold text-text-muted hover:text-text-primary transition-colors mb-12 bg-card border border-border px-4 py-2 rounded-full shadow-sm hover:shadow-md">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <article>
          <header className="mb-12">
            <span className="text-button-primary font-bold text-sm tracking-widest uppercase mb-4 block">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary mb-6 tracking-tight leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-text-muted text-sm border-b border-border pb-8 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center font-bold text-text-primary shadow-sm">
                  {post.author.avatar}
                </div>
                <div>
                  <p className="font-bold text-text-primary">{post.author.name}</p>
                  <p className="text-xs">{post.author.role}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-border hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {post.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </div>
            </div>
          </header>

          <div 
            className="prose prose-lg max-w-none text-text-muted prose-headings:font-extrabold prose-headings:text-text-primary prose-headings:tracking-tight prose-a:text-button-primary prose-a:font-bold hover:prose-a:underline prose-strong:text-text-primary prose-blockquote:border-l-4 prose-blockquote:border-text-primary prose-blockquote:bg-card prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-text-primary prose-blockquote:shadow-sm"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <footer className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="font-bold text-text-primary">Share this article:</span>
              <div className="flex gap-2">
                <button className="p-3 bg-card border border-border rounded-full hover:bg-surface text-text-primary transition-colors shadow-sm">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="p-3 bg-card border border-border rounded-full hover:bg-surface text-text-primary transition-colors shadow-sm">
                  <Linkedin className="w-5 h-5" />
                </button>
                <button className="p-3 bg-card border border-border rounded-full hover:bg-surface text-text-primary transition-colors shadow-sm">
                  <Facebook className="w-5 h-5" />
                </button>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  )
}
