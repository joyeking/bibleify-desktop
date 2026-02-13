import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import keydown from 'react-keydown';
import { getAnnotationKey } from '../models/annotations';

const colors = ['#fff59d', '#a5d6a7', '#90caf9', '#f48fb1'];

@keydown
@connect(state => ({ bible: state.bible, annotations: state.annotations, ui: state.ui }), dispatch => ({ dispatch }))
export default class Content extends PureComponent {
  constructor(props) {
    super(props);
    this.verseRefs = {};
  }

  scrollToTop() {
    this._scroll.scrollTop = 0;
  }

  onPrevChapter() {
    this.props.dispatch.bible.prevChapter();
    this.scrollToTop();
  }

  onNextChapter() {
    this.props.dispatch.bible.nextChapter();
    this.scrollToTop();
  }

  onAddNote(verse) {
    const verseKey = getAnnotationKey(this.props.bible, verse.verse);
    const current = this.props.annotations.notes[verseKey] || '';
    const nextNote = window.prompt(`Add note for verse ${verse.verse}`, current);
    if (nextNote !== null) {
      this.props.dispatch.annotations.setVerseNote({ verse: verse.verse, note: nextNote.trim() });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.bible.activeVerse != nextProps.bible.activeVerse) {
      if (nextProps.bible.activeVerse == 0) {
        this.scrollToTop();
      } else if (this.verseRefs[nextProps.bible.activeVerse]) {
        this._scroll.scrollTop = this.verseRefs[nextProps.bible.activeVerse].offsetTop - 15;
      }
    }
    if (nextProps.keydown.event) {
      if (nextProps.keydown.event.code == 'ArrowRight') {
        this.onNextChapter();
      }
      if (nextProps.keydown.event.code == 'ArrowLeft') {
        this.onPrevChapter();
      }
    }
  }

  render() {
    const { verses, loading, error } = this.props.bible;
    return (
      <div className='verse-container' style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div
          className='verse-scroll'
          ref={scroll => (this._scroll = scroll)}
          style={{ flex: 1, display: 'flex', overflow: 'auto' }}
        >
          <div className='container'>
            {loading ? <div className='status-banner'>Loading chapter...</div> : null}
            {error ? <div className='status-banner status-banner-error'>{error}</div> : null}
            {verses.map((verse, i) => {
              const isTitle = verse.type == 't';
              if (isTitle) {
                return (
                  <h1 key={i} className='title'>
                    {verse.content}{' '}
                  </h1>
                );
              }

              const verseKey = getAnnotationKey(this.props.bible, verse.verse);
              const note = this.props.annotations.notes[verseKey];
              const highlight = this.props.annotations.highlights[verseKey];

              return (
                <div
                  key={i}
                  ref={verseRef => (this.verseRefs[verse.verse] = verseRef)}
                  className='verse'
                  style={{ background: highlight || 'transparent', fontSize: this.props.ui.fontSize }}
                >
                  {verse.verse != 0 ? <span className='verse-number'>{verse.verse}</span> : null}
                  {verse.content}
                  <div className='verse-actions'>
                    {colors.map(color => (
                      <button
                        key={`${verse.verse}-${color}`}
                        className='highlight-dot'
                        style={{ background: color }}
                        onClick={() => this.props.dispatch.annotations.setVerseHighlight({ verse: verse.verse, color })}
                      />
                    ))}
                    <button
                      className='btn btn-sm btn-outline-secondary note-btn'
                      onClick={() => this.onAddNote(verse)}
                      title='Add/Edit note'
                    >
                      📝
                    </button>
                  </div>
                  {note ? <div className='verse-note'>{note}</div> : null}
                </div>
              );
            })}
          </div>
        </div>
        <button
          key='button-left'
          onClick={() => this.onPrevChapter()}
          className={'btn btn-outline-secondary btn-circle btn-nav btn-nav-left'}
        >
          <i className='ion ion-ios-arrow-back' />
        </button>
        <button
          key='button-right'
          onClick={() => this.onNextChapter()}
          className={'btn btn-outline-secondary btn-circle btn-nav btn-nav-right'}
        >
          <i className='ion ion-ios-arrow-forward' />
        </button>
      </div>
    );
  }
}
