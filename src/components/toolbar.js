import React, { PureComponent } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { connect } from 'react-redux';
import Versions from '../constants/Versions';
import Books from '../constants/Books';

@connect(
  state => ({ bible: state.bible, search: state.search, player: state.player, ui: state.ui }),
  dispatch => ({ dispatch }),
)
export default class Toolbar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSearchFocused: false,
    };
  }

  onSelectChapter(chapter) {
    this.props.dispatch.bible.setActiveChapter(chapter);
  }

  onSelectBook(book) {
    this.props.dispatch.bible.setActiveBook(book);
    this.props.dispatch.bible.setActiveChapter(1);
  }

  onSelectVersion(version) {
    this.props.dispatch.bible.setActiveVersion(version);
  }

  onSearchFocus() {
    this.setState({ isSearchFocused: true });
  }

  onSearchBlur() {
    this.setState({ isSearchFocused: false });
  }

  onSearch() {
    this.props.dispatch.search.fetchSearch();
  }

  onPlayChapter() {
    this.props.dispatch.player.playCurrentChapter();
  }

  render() {
    const { activeBook, activeChapter, activeVersion } = this.props.bible;
    const { text } = this.props.search;
    const { isSearchFocused } = this.state;
    const { fontSize, themeMode } = this.props.ui;
    let chapters = [];
    for (var i = 1; i <= activeBook.total; i++) {
      chapters.push(i);
    }

    return (
      <nav className='navbar navbar-expand-md navbar-inverse fixed-top bg-inverse'>
        <div className='version-box'>
          <UncontrolledDropdown>
            <DropdownToggle caret className='btn-outline-secondary btn-version'>
              <i className='ion ion-ios-book icon-margin' />
              {activeVersion.value.toUpperCase()}
            </DropdownToggle>
            <DropdownMenu>
              {Versions.map((version, i) => {
                return (
                  <DropdownItem
                    className={version.value == activeVersion.value ? 'active' : ''}
                    key={i}
                    onClick={() => this.onSelectVersion(version)}
                  >
                    {version.name}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>

        <div className='title-box'>
          <UncontrolledDropdown>
            <DropdownToggle caret className='btn-outline-secondary btn-version'>
              {activeVersion.lang == 'en' ? activeBook.name : activeBook.name_id}
            </DropdownToggle>
            <DropdownMenu>
              {Books.map(book => (
                <DropdownItem key={book.value} onClick={() => this.onSelectBook(book)}>
                  {activeVersion.lang == 'en' ? book.name : book.name_id}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>

          <UncontrolledDropdown>
            <DropdownToggle caret className='btn-outline-secondary btn-version'>
              {activeChapter}
            </DropdownToggle>
            <DropdownMenu>
              {chapters.map(chapter => {
                return (
                  <DropdownItem
                    key={chapter}
                    className={chapter == activeChapter ? 'active' : ''}
                    onClick={() => this.onSelectChapter(chapter)}
                  >
                    {chapter}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </UncontrolledDropdown>
          <button className='btn btn-secondary btn-headset' onClick={() => this.onPlayChapter()}>
            <i className='ion ion-ios-headset' />
          </button>
        </div>

        <div className='toolbar-controls'>
          <select
            className='form-control control-select'
            value={themeMode}
            onChange={e => this.props.dispatch.ui.setThemeMode(e.target.value)}
          >
            <option value='auto'>Auto</option>
            <option value='light'>Light</option>
            <option value='dark'>Dark</option>
          </select>
          <input
            type='range'
            min='14'
            max='30'
            value={fontSize}
            className='font-slider'
            onChange={e => this.props.dispatch.ui.setFontSize(parseInt(e.target.value, 10))}
          />
        </div>

        <div className={`input-group mb-3 search-box ${isSearchFocused ? 'search-focused' : ''}`}>
          <input
            type='text'
            className='form-control input-outline-secondary'
            placeholder='Search'
            onFocus={() => this.onSearchFocus()}
            onBlur={() => this.onSearchBlur()}
            aria-label=''
            aria-describedby='basic-addon1'
            onChange={e => this.props.dispatch.search.setText(e.target.value)}
            onKeyPress={target => target.charCode == 13 && this.onSearch()}
            value={text}
          />
          <div className='input-group-append'>
            <button className='btn btn-outline-secondary' type='button' onClick={() => this.onSearch()}>
              <i className='ion ion-ios-search' />
            </button>
          </div>
        </div>
      </nav>
    );
  }
}
