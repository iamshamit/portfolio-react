import React, { useState } from 'react';
import { PORTFOLIO } from '../data/config';

export default function JournalPage({ openArticle }) {
  const [activeTag, setActiveTag] = useState(null);

  const tags = [...new Set(PORTFOLIO.journal.map(p => p.tag))];
  const posts = activeTag
    ? PORTFOLIO.journal.filter(p => p.tag === activeTag)
    : PORTFOLIO.journal;

  return (
    <div className="ji-wrap">
      <div className="ji-page">
        {/* Full reload back to portfolio so GSAP/Lenis re-initialises */}
        <a href="/" className="ji-back"><span>←</span> Shamit</a>

        <header className="ji-header">
          <div className="ji-eyebrow">Journal</div>
          <h1 className="ji-title">All writing.</h1>
          <p className="ji-sub">{PORTFOLIO.journal.length} entries</p>
        </header>

        <div className="filters">
          <button
            className={`filter-tag${activeTag === null ? ' active' : ''}`}
            onClick={() => setActiveTag(null)}
          >All</button>
          {tags.map(tag => (
            <button
              key={tag}
              className={`filter-tag${activeTag === tag ? ' active' : ''}`}
              onClick={() => setActiveTag(tag)}
            >{tag}</button>
          ))}
        </div>

        <div className="journal">
          {posts.map(post => {
            const realIndex = PORTFOLIO.journal.indexOf(post);
            return (
              <button
                key={post.num}
                className="jrow"
                data-cursor="view"
                onClick={() => openArticle(realIndex)}
              >
                <div className="jnum">{post.num}</div>
                <div className="jmain">
                  <div className="jtitle">{post.title}</div>
                  <div className="jexcerpt">{post.excerpt}</div>
                </div>
                <div className="jmeta">
                  <span className="jtag">{post.tag}</span>
                  <span className="jdate">{post.date} · {post.read}</span>
                </div>
                <span className="jarrow">→</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
