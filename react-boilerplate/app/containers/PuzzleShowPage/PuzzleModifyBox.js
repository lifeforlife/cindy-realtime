import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { text2md } from 'common';
import { nAlert } from 'containers/Notifier/actions';
import { Tabs, Flex, Box } from 'rebass';
import Constrained from 'components/Constrained';
import dialogueMessages from 'containers/Dialogue/messages';
import PreviewEdit from 'components/PreviewEdit';

import { graphql } from 'react-apollo';
import createHintMutation from 'graphql/CreateHintMutation';
import puzzleUpdateMutation from 'graphql/UpdatePuzzleMutation';

import tick from 'images/tick.svg';
import cross from 'images/cross.svg';
import {
  DatePicker,
  ImgXs,
  Input,
  PuzzleFrame,
  EditButton,
  Switch,
  Textarea,
} from 'style-store';
import { getMaxDazedDays } from 'settings';
import messages from './messages';

const StyledTabItem = styled.button`
  color: #006388;
  padding: 5px;
  border-bottom: ${({ active }) => (active ? '3px solid #2075c7' : 'none')};
  cursor: pointer;
  &:hover {
    color: #6c71c4;
  }
`;

const StyledTabs = styled(Tabs)`
  border-color: #006388;
  margin-bottom: 5px;
`;

class PuzzleModifyBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: props.puzzle.status === 0 ? 0 : 1,
      solutionEditMode: false,
      memoEditMode: props.puzzle.memo === '',
      solve: props.puzzle.status === 3,
      yami: props.puzzle.yami,
      hidden: props.puzzle.status === 3,
      grotesque: props.puzzle.grotesque,
      hint: '',
    };
    this.changeTab = (t) => {
      this.setState({ activeTab: t });
    };
    this.toggleSolutionEditMode = () => {
      this.setState((p) => ({ solutionEditMode: !p.solutionEditMode }));
    };
    this.toggleMemoEditMode = () => {
      this.setState((p) => ({ memoEditMode: !p.memoEditMode }));
    };
    this.handleHintChange = (e) => {
      this.setState({ hint: e.target.value });
    };
    this.handleSolveChange = () => {
      this.setState((p) => ({
        solve: !p.solve,
        hidden: p.solve ? false : p.hidden,
      }));
    };
    this.handleYamiChange = () => {
      this.setState((p) => ({ yami: p.yami === 0 ? 1 : 0 }));
    };
    this.handleHiddenChange = () => {
      this.setState((p) => ({ hidden: !p.hidden }));
    };
    this.handleGrotesqueChange = () => {
      this.setState((p) => ({ grotesque: !p.grotesque }));
    };
    this.handleSaveSolution = this.handleSaveSolution.bind(this);
    this.handleSaveMemo = this.handleSaveMemo.bind(this);
    this.handleSaveControl = this.handleSaveControl.bind(this);
    this.handleCreateHint = this.handleCreateHint.bind(this);
    this.updateDazedOnDate = this.updateDazedOnDate.bind(this);
  }

  componentDidMount() {
    if (this.props.puzzle.status === 0) {
      const currentDazedDate = moment(this.props.puzzle.dazedOn);
      const nextDazedDate = moment().add(
        getMaxDazedDays(this.props.puzzle),
        'days',
      );
      if (currentDazedDate.format('MM-DD') !== nextDazedDate.format('MM-DD')) {
        this.updateDazedOnDate(nextDazedDate);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const newState = {
      solutionEditMode: false,
      memoEditMode: false,
    };

    if (this.props.puzzle.memo !== nextProps.puzzle.memo && this.memoTextarea) {
      this.memoTextarea.setContent(nextProps.puzzle.memo);
    }

    if (
      this.props.puzzle.solution !== nextProps.puzzle.solution &&
      this.solutionTextarea
    ) {
      this.solutionTextarea.setContent(nextProps.puzzle.solution);
    }

    if (newState.solutionEditMode || newState.memoEditMode) {
      this.setState({
        solutionEditMode: false,
        memoEditMode: false,
      });
    }
  }

  updateDazedOnDate(date) {
    this.props
      .mutatePuzzleUpdate({
        variables: {
          input: {
            puzzleId: this.props.puzzleId,
            dazedOn: date.format('YYYY-MM-DD'),
          },
        },
      })
      .then(() => {
        this.props.alert('Save Succeed!');
      })
      .catch((error) => {
        this.props.alert(error.message);
      });
  }

  handleSaveSolution() {
    this.toggleSolutionEditMode();
    const solution =
      this.solutionTextarea && this.solutionTextarea.getContent();
    if (!solution || solution === this.props.puzzle.solution) return;
    this.props
      .mutatePuzzleUpdate({
        variables: {
          input: {
            puzzleId: this.props.puzzleId,
            solution,
          },
        },
      })
      .then(() => {
        this.props.alert('Save Succeed!');
      })
      .catch((error) => {
        this.props.alert(error.message);
      });
  }

  handleSaveMemo() {
    this.toggleMemoEditMode();
    const memo = this.memoTextarea && this.memoTextarea.getContent();
    if (!memo || memo === this.props.puzzle.memo) return;
    this.props
      .mutatePuzzleUpdate({
        variables: {
          input: {
            puzzleId: this.props.puzzleId,
            memo,
          },
        },
      })
      .then(() => {})
      .catch((error) => {
        this.props.alert(error.message);
      });
  }

  handleSaveControl() {
    let status;
    if (this.state.solve) status = 1;
    if (this.state.hidden) status = 3;
    this.props
      .mutatePuzzleUpdate({
        variables: {
          input: {
            puzzleId: this.props.puzzleId,
            yami: this.state.yami,
            status,
            grotesque: this.state.grotesque,
          },
        },
      })
      .then(() => {
        this.props.alert('Save Succeed!');
      })
      .catch((error) => {
        this.props.alert(error.message);
      });
  }

  handleCreateHint() {
    if (this.state.hint === '') return;
    this.props
      .mutateHintCreate({
        variables: {
          input: {
            puzzleId: this.props.puzzleId,
            content: this.state.hint,
          },
        },
      })
      .then(() => {
        this.setState({ hint: '' });
      })
      .catch((error) => {
        this.props.alert(error.message);
      });
  }

  render() {
    return (
      <Constrained level={3}>
        <PuzzleFrame>
          <StyledTabs>
            {this.props.puzzle.status === 0 && (
              <StyledTabItem
                active={this.state.activeTab === 0}
                onClick={() => this.changeTab(0)}
              >
                <FormattedMessage {...messages.solution} />
              </StyledTabItem>
            )}
            <StyledTabItem
              active={this.state.activeTab === 1}
              onClick={() => this.changeTab(1)}
            >
              <FormattedMessage {...messages.memo} />
            </StyledTabItem>
            {this.props.puzzle.status === 0 && (
              <StyledTabItem
                active={this.state.activeTab === 2}
                onClick={() => this.changeTab(2)}
              >
                <FormattedMessage {...messages.hint} />
              </StyledTabItem>
            )}
            <StyledTabItem
              active={this.state.activeTab === 3}
              onClick={() => this.changeTab(3)}
            >
              <FormattedMessage {...messages.controlPanel} />
            </StyledTabItem>
          </StyledTabs>
          {this.state.activeTab === 0 && (
            <div>
              <div hidden={this.state.solutionEditMode}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: text2md(this.props.puzzle.solution),
                  }}
                />
                {this.props.puzzle.yami !== 2 && (
                  <EditButton onClick={this.toggleSolutionEditMode}>
                    <FormattedMessage {...dialogueMessages.edit} />
                  </EditButton>
                )}
              </div>
              {this.props.puzzle.yami !== 2 && (
                <div hidden={!this.state.solutionEditMode}>
                  <PreviewEdit
                    content={this.props.puzzle.solution}
                    ref={(ref) => {
                      this.solutionTextarea = ref;
                    }}
                    safe={this.props.puzzle.contentSafe}
                  />
                  <Flex>
                    <EditButton
                      onClick={this.handleSaveSolution}
                      style={{ width: '100%' }}
                    >
                      <ImgXs src={tick} />
                    </EditButton>
                    <EditButton
                      onClick={this.toggleSolutionEditMode}
                      style={{ width: '100%' }}
                    >
                      <ImgXs src={cross} />
                    </EditButton>
                  </Flex>
                </div>
              )}
            </div>
          )}
          {this.state.activeTab === 1 && (
            <div>
              <div hidden={this.state.memoEditMode}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: text2md(this.props.puzzle.memo),
                  }}
                />
                <EditButton onClick={this.toggleMemoEditMode}>
                  <FormattedMessage {...dialogueMessages.edit} />
                </EditButton>
              </div>
              <div hidden={!this.state.memoEditMode}>
                <PreviewEdit
                  content={this.props.puzzle.memo}
                  ref={(ref) => {
                    this.memoTextarea = ref;
                  }}
                />
                <Flex>
                  <EditButton
                    onClick={this.handleSaveMemo}
                    style={{ width: '100%' }}
                  >
                    <ImgXs src={tick} />
                  </EditButton>
                  <EditButton
                    onClick={this.toggleMemoEditMode}
                    style={{ width: '100%' }}
                  >
                    <ImgXs src={cross} />
                  </EditButton>
                </Flex>
              </div>
            </div>
          )}
          {this.state.activeTab === 2 && (
            <div>
              <Flex mx={1}>
                <Box w={(1, 5 / 6, 7 / 8)}>
                  <Textarea
                    value={this.state.hint}
                    onChange={this.handleHintChange}
                  />
                </Box>
                <Box w={(1, 1 / 6, 1 / 8)}>
                  <EditButton
                    onClick={this.handleCreateHint}
                    style={{ width: '100%' }}
                  >
                    <ImgXs src={tick} />
                  </EditButton>
                </Box>
              </Flex>
            </div>
          )}
          {this.state.activeTab === 3 && (
            <div>
              <Flex flexWrap="wrap" mx={1}>
                {this.props.puzzle.status === 0 && (
                  <Flex w={1} my={1}>
                    <Box>
                      <FormattedMessage {...messages.dazedDate} />
                    </Box>
                    <Input
                      w={1}
                      p={1}
                      value={moment(this.props.puzzle.dazedOn).format('ll')}
                      disabled
                    />
                  </Flex>
                )}
                <Box w={[1 / 3, 1 / 5]} hidden={this.props.puzzle.status !== 0}>
                  <FormattedMessage {...messages.putSolution} />
                  <Switch
                    checked={this.state.solve}
                    onClick={this.handleSolveChange}
                  />
                </Box>
                <Box w={[1 / 3, 1 / 5]}>
                  <FormattedMessage {...messages.grotesque} />
                  <Switch
                    checked={this.state.grotesque}
                    onClick={this.handleGrotesqueChange}
                  />
                </Box>
                <Box
                  w={[1 / 3, 1 / 5]}
                  hidden={
                    this.props.puzzle.status !== 1 &&
                    this.props.puzzle.status !== 3 &&
                    (this.props.puzzle.status === 0 &&
                      this.state.solve === false)
                  }
                >
                  <FormattedMessage {...messages.toggleHidden} />
                  <Switch
                    checked={this.state.hidden}
                    onClick={this.handleHiddenChange}
                  />
                </Box>
                {this.props.puzzle.yami < 2 && (
                  <Box w={[1 / 3, 1 / 5]}>
                    <FormattedMessage {...messages.toggleYami} />
                    <Switch
                      checked={this.state.yami}
                      onClick={this.handleYamiChange}
                    />
                  </Box>
                )}
                <Box ml="auto" w={[1, 1 / 5]}>
                  <EditButton
                    onClick={this.handleSaveControl}
                    style={{ width: '100%' }}
                  >
                    <ImgXs src={tick} />
                  </EditButton>
                </Box>
              </Flex>
            </div>
          )}
        </PuzzleFrame>
      </Constrained>
    );
  }
}

PuzzleModifyBox.propTypes = {
  puzzle: PropTypes.object.isRequired,
  puzzleId: PropTypes.number.isRequired,
  mutatePuzzleUpdate: PropTypes.func.isRequired,
  mutateHintCreate: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  alert: (message) => dispatch(nAlert(message)),
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

const withPuzzleUpdateMutation = graphql(puzzleUpdateMutation, {
  name: 'mutatePuzzleUpdate',
});

const withHintCreateMutation = graphql(createHintMutation, {
  name: 'mutateHintCreate',
});

export default compose(
  withPuzzleUpdateMutation,
  withHintCreateMutation,
  withConnect,
)(PuzzleModifyBox);
