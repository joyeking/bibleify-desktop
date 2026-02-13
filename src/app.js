import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import Toolbar from './components/toolbar';
import Sidebar from './components/sidebar';
import Content from './components/content';
import Player from './components/player';
import Search from './components/search';

@connect(state => ({ bible: state.bible, ui: state.ui }), dispatch => ({ dispatch }))
export default class App extends PureComponent {
  componentDidMount() {
    this.props.dispatch.bible.fetchVerses(this.props.bible);
    this.props.dispatch.annotations.init();

    // Keep theme in sync with OS preference while in auto mode.
    if (window.matchMedia) {
      this.themeListener = window.matchMedia('(prefers-color-scheme: dark)');
      this.onThemeChange = () => this.props.dispatch.ui.refreshAutoTheme();
      if (this.themeListener.addEventListener) {
        this.themeListener.addEventListener('change', this.onThemeChange);
      } else {
        this.themeListener.addListener(this.onThemeChange);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { activeChapter, activeBook, activeVersion } = nextProps.bible;
    if (
      activeBook != this.props.bible.activeBook ||
      activeChapter != this.props.bible.activeChapter ||
      activeVersion != this.props.bible.activeVersion
    ) {
      this.props.dispatch.bible.fetchVerses(nextProps.bible);
    }
  }

  componentWillUnmount() {
    if (this.themeListener) {
      if (this.themeListener.removeEventListener) {
        this.themeListener.removeEventListener('change', this.onThemeChange);
      } else {
        this.themeListener.removeListener(this.onThemeChange);
      }
    }
  }

  render() {
    const mergeStyle = Object.assign;
    return (
      <div
        style={mergeStyle({}, styles.flex, styles.column, styles.fullHeight)}
        className={`root-wrapper theme-${this.props.ui.theme}`}
      >
        <div style={mergeStyle({}, styles.flex, styles.row)}>
          <Sidebar />
          <div style={mergeStyle({}, styles.flex, styles.hidden)} className='content'>
            <Toolbar />
            <div style={mergeStyle({}, styles.flex)}>
              <Content />
              <Search />
            </div>
          </div>
        </div>
        <Player />
      </div>
    );
  }
}

const styles = {
  fullHeight: {
    height: '100vh',
  },
  flex: {
    flex: 1,
    display: 'flex',
  },
  column: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
};
