/**
*
* StarLabel
*
*/

import React from "react";
import PropTypes from "prop-types";
import styled from 'styled-components';

const PuzzleScore = styled.span`
  font-size: 0.8em;
  background-color: darkviolet;
  font-family: monaco;
  font-weight: bold;
  color: #fcf4dc;
  border: 2px solid darkviolet;
  border-radius: 10px;
`;

function StarLabel(props) {
  const scale_one = num => Math.floor(num * 10) / 10;
  const stars = props.starSet.edges;
  var starCount = 0,
    starSum = 0;
  stars.forEach(s => {
    starCount += 1;
    starSum += s.node.value;
  });
  if (starCount > 0) {
    return (
      <PuzzleScore>
        <span className="glyphicon glyphicon-star" />
        <span>{starSum + "(" + starCount + ")"}</span>
      </PuzzleScore>
    );
  } else {
    return null;
  }
}

StarLabel.propTypes = {
  starSet: PropTypes.shape({
    edges: PropTypes.array.isRequired
  })
};

export default StarLabel;
