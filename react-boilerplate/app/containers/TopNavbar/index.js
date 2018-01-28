/**
 *
 * TopNavbar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector, createSelector } from 'reselect';

import { Box, ButtonTransparent } from 'rebass';
import { Navbar, ImgSm } from 'style-store';
import MenuNavbar from 'components/MenuNavbar';
import UserNavbar from 'containers/UserNavbar';
import styled from 'styled-components';
import chatImg from 'images/chat.svg';
import memoImg from 'images/memo.svg';
import loginImg from 'images/login.svg';
import menuImg from 'images/menu.svg';

import { toggleChat, toggleMemo } from 'containers/Chat/actions';
import { selectPuzzleShowPageDomain } from 'containers/PuzzleShowPage/selectors';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

const NavbarBtn = styled(ButtonTransparent)`
  max-height: 50px;
  width: 100%;
  padding: 10px;
  margin: 0;
`;

const NavbarBtnMsg = styled.span`
  max-height: 30px;
  padding: 10px;
  font-size: 1.5em;

  @media (max-width: 768px) {
    display: none !important;
  }
`;

class TopNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subnav: null,
    };

    this.toggleSubNav = this.toggleSubNav.bind(this);
  }

  toggleSubNav(navName, set = false) {
    if (set === false) {
      this.setState((prevState) => ({
        subnav: prevState.subnav === navName ? null : navName,
      }));
      return;
    }
    this.setState({
      subnav: navName,
    });
  }

  render() {
    return (
      <Navbar mx={-2}>
        <Box w={1 / 3} m="auto">
          <NavbarBtn onClick={() => this.toggleSubNav('menu')}>
            <ImgSm src={menuImg} alt="menu" />
            <NavbarBtnMsg>
              <FormattedMessage {...messages.menu} />
            </NavbarBtnMsg>
          </NavbarBtn>
          <MenuNavbar open={this.state.subnav === 'menu'} />
        </Box>
        <Box w={1 / 3} m="auto">
          <NavbarBtn onClick={() => this.props.dispatch(toggleChat())}>
            <ImgSm src={chatImg} alt="chat" />
            <NavbarBtnMsg>
              <FormattedMessage {...messages.chat} />
            </NavbarBtnMsg>
          </NavbarBtn>
        </Box>
        {this.props.puzzle &&
          this.props.puzzle.memo && (
            <Box w={1 / 3} m="auto">
              <NavbarBtn onClick={() => this.props.dispatch(toggleMemo())}>
                <ImgSm src={memoImg} alt="memo" />
                <NavbarBtnMsg>
                  <FormattedMessage {...messages.memo} />
                </NavbarBtnMsg>
              </NavbarBtn>
            </Box>
          )}
        <Box w={1 / 3} m="auto">
          <NavbarBtn onClick={() => this.toggleSubNav('user')}>
            <ImgSm src={loginImg} alt="profile" />
            <NavbarBtnMsg>
              <FormattedMessage {...messages.profile} />
            </NavbarBtnMsg>
          </NavbarBtn>
          <UserNavbar open={this.state.subnav === 'user'} />
        </Box>
      </Navbar>
    );
  }
}

TopNavbar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  puzzle: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  puzzle: createSelector(selectPuzzleShowPageDomain, (substate) =>
    substate.get('puzzle')
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(TopNavbar);