import _ from 'lodash';
import React from 'react';

export default class Bar extends React.Component {

  static propTypes = {
    values: React.PropTypes.any.isRequired,
    delimiter: React.PropTypes.string,
    fill: React.PropTypes.arrayOf(React.PropTypes.string),
    height: React.PropTypes.number,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    padding: React.PropTypes.number,
    width: React.PropTypes.number,
  }

  static defaultProps = {
    delimiter: ",",
    fill: ["#4D89F9"],
    height: 16,
    min: 0,
    max: -Infinity,
    padding: 0.1,
    width: 32,
  }

  values = () => {
    return typeof this.props.values === 'string'
      ? _.split(this.props.values, this.props.delimiter).map(v => (Number(v)))
      : _.flatten([this.props.values]);
  }

  fill = (i) => {
    return this.props.fill[i % this.props.fill.length];
  }

  render() {
    const values = this.values();
    const max = _.max([_.max(values), Number(this.props.max)]);
    const min = _.min(values);
    const { width, height, padding } = this.props;
    const diff = max - min;

    const xScale = input => {
      return input * (width / (values.length))
    }

    const yScale = input => {
      return height - (
        diff
          ? ((input - min) / diff) * height
          : 1
      )
    }

    return (<svg className="peity peity-bar" height={ this.props.height } width={ this.props.width }>
      { Object.keys(values).map(i => {
        const x = xScale(Number(i) + padding)
        const w = xScale(Number(i) + 1 - padding) - x
        const value = values[i]
        const valueY = yScale(value)
        let y1 = valueY
        let y2 = valueY
        let h = 0

        if (!diff) {
          h = 1
        } else if (value < 0) {
          y1 = yScale(Math.min(max, 0))
        } else {
          y2 = yScale(Math.max(min, 0))
        }

        h = y2 - y1

        if (h === 0) {
          h = 1
          if (max > 0 && diff) y1--
        }

        return (<rect key={ i } fill={ this.fill(i) } x={ x } y={ y1 } width={ w } height={ h }></rect>);
      }) }
    </svg>);
  }
}
