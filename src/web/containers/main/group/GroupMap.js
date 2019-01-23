const React = require('react');
const { connect } = require('react-redux');
const ReactTooltip = require('react-tooltip');

require('./GroupMap.scss');

class GroupMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: -1,
      y: -1,
      tileSize: 10,
      selectedBlocks: [],
      map: {
        size: {
          x: 10,
          y: 10,
        },
        blocks: [
          {
            name: '树',
            icon: '树',
            position: [10, 10],
          },
          {
            name: '树',
            icon: '树',
            position: [10, 10],
          },
        ],
      },
    };
  }

  _handleClickMapPoint(x, y, blocks) {
    this.setState({
      x: x,
      y: y,
      selectedBlocks: blocks || [],
    });
  }

  getMap() {
    let map = this.state.map;
    let tileSize = this.state.tileSize;

    let blocks = {};
    for (let item of map.blocks) {
      let key = `(${item.position[0]},${item.position[1]})`;
      if (blocks[key]) {
        blocks[key].push(item);
      } else {
        blocks[key] = [item];
      }
    }

    let underLayer = [];
    for (let y = 0; y < map.size.y; y++) {
      let row = [];
      for (let x = 0; x < map.size.x; x++) {
        let isSelected =
          this.state.x === x + 1 && this.state.y === y + 1 ? true : false;
        let _blocks = blocks[`(${x + 1},${y + 1})`];
        let normalColor = '#eeeeee';
        if (_blocks && _blocks.length === 1) {
          normalColor = '#cccccc';
        }
        if (_blocks && _blocks.length >= 2) {
          normalColor = '#999999';
        }
        row.push(
          <rect
            key={`map#${x},${y}`}
            width={tileSize}
            height={tileSize}
            fill={isSelected ? '#726155' : normalColor}
            x={x * (tileSize + 2)}
            y={y * (tileSize + 2)}
            data-tip={`${x + 1},${y + 1}`}
            data-for="map"
            onClick={() => this._handleClickMapPoint(x + 1, y + 1, _blocks)}
          />
        );
      }
      underLayer.push(<g key={'map#row#' + y}>{row}</g>);
    }

    return (
      <svg
        width={map.size.y * (this.state.tileSize + 2)}
        height={map.size.y * (this.state.tileSize + 2)}
      >
        <g transform="translate(0, 0)">{underLayer}</g>
      </svg>
    );
  }

  render() {
    let blocks = this.state.selectedBlocks;

    return (
      <div className="group-map">
        <ReactTooltip
          id="map"
          effect="solid"
          offset={{ right: this.state.tileSize / 2 }}
        />
        <div className="map">{this.getMap()}</div>
        <div className="map-info">
          <p>
            坐标: {this.state.x},{this.state.y}
          </p>
          <p>
            物品:{' '}
            {blocks.map((item, index) => {
              return <span key={'map-info#' + index}>{item.name}</span>;
            })}
          </p>
        </div>
      </div>
    );
  }
}

module.exports = connect()(GroupMap);
