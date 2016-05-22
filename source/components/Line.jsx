import _ from 'lodash';
import React from 'react';

export default class Line extends React.Component {

  static propTypes = {
    values: React.PropTypes.any.isRequired,
    delimiter: React.PropTypes.string,
    fill: React.PropTypes.string,
    height: React.PropTypes.number,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    stroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.number,
    width: React.PropTypes.number,
  }

  static defaultProps = {
    delimiter: ",",
    fill: "#c6d9fd",
    height: 16,
    min: 0,
    max: -Infinity,
    stroke: "#4d89f9",
    strokeWidth: 1,
    width: 32,
  }

  values = () => {
    return typeof this.props.values === 'string'
      ? _.split(this.props.values, this.props.delimiter).map(v => (Number(v)))
      : _.flatten([this.props.values]);
  }

  renderFill = (coords) => {
    if (!this.props.fill) return null;
    return <polygon fill={ this.props.fill } points={ _.join(coords, ' ') }></polygon>;
  }

  renderStroke = (coords) => {
    if (!this.props.stroke || this.props.strokeWidth === 0) return null;
    return <polyline fill="none" points={ _.join(_.slice(coords, 1, coords.length - 1), ' ') } stroke={ this.props.stroke } strokeWidth={ this.props.strokeWidth } strokeLinecap="square"></polyline>
  }

  render() {
    const values = this.values();
    const max = _.max([_.max(values), Number(this.props.max)]);
    const min = _.min(values);
    const { strokeWidth, width } = this.props;
    const height = this.props.height - strokeWidth;
    const diff = max - min;

    const xScale = input => {
      return input * (width / (values.length - 1))
    }

    const yScale = input => {
      let y = height;

      if (diff) {
        y -= ((input - min) / diff) * height;
      }

      return y + strokeWidth / 2;
    }

    const zero = yScale(Math.max(min, 0));
    const coords = _.concat(
      [[0, zero]],
      Object.keys(values).map(i => [xScale(i), yScale(values[i])]),
      [[width, zero]],
    );

    return (<svg className="peity peity-line" height={ this.props.height } width={ this.props.width }>
      { this.renderFill(coords) }
      { this.renderStroke(coords) }
    </svg>);
  }
}