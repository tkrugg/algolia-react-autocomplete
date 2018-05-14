import React from "react";
import PropTypes from "prop-types";
import SelectionManager from "./SelectionManager";
import Hits from "./Hits";
import "./styles.css";

class Autocomplete extends React.PureComponent {
  static propTypes = {
    indexes: PropTypes.arrayOf(
      PropTypes.shape({
        source: PropTypes.shape({
          indexName: PropTypes.string.isRequired
        }).isRequired
      })
    ),
    onSelectionChange: PropTypes.func
  };
  static defaultProps = {
    indexes: []
  };

  state = {
    query: null,
    open: false,
    selected: null
  };

  _suggestions = {};
  onSuggestions = (suggestions, indexName) => {
    this._suggestions[indexName] = suggestions;

    this.suggestions = SelectionManager(
      this.props.indexes.map(index => index.source.indexName),
      this._suggestions
    );
    this.setState({
      open: true
    });
  };

  onSuggestionClick = (hit, indexName) => {
    this.props.onSelectionChange &&
      this.props.onSelectionChange(hit, indexName);
  };

  onKeyDown = event => {
    let selected = this.state.selected;
    switch (event.key) {
      case "ArrowDown":
        selected = this.suggestions.next();
        event.preventDefault();
        break;
      case "ArrowUp":
        selected = this.suggestions.prev();
        event.preventDefault();
        break;
      case "ArrowRight":
        selected = this.suggestions.nextCategory() || selected;
        event.preventDefault();
        break;
      case "ArrowLeft":
        selected = this.suggestions.prevCategory() || selected;
        event.preventDefault();
        break;
      case "Escape":
        this.setState({
          open: false
        });
        event.preventDefault();
        break;
      case "Enter":
        this.onSuggestionClick(
          this.suggestions.current,
          this.suggestions.current.category
        );
        this.setState({
          open: false
        });
        event.preventDefault();
        break;
      default:
        return;
    }

    this.setState({
      selected
    });
  };

  updateQuery = event => this.setState({ query: event.target.value });

  renderChildren() {
    return React.Children.map(this.props.children, child => {
      if (child.key === "input") {
        return React.cloneElement(child, {
          onKeyDown: this.onKeyDown,
          onChange: this.updateQuery
        });
      }
    });
  }

  render() {
    const style = {};
    if (!this.state.open) {
      style.display = "none";
    }
    return (
      <div className="algolia-react-autocomplete">
        <div className="aa-input-container">{this.renderChildren()}</div>
        <div className="aa-dropdown-menus" style={style}>
          {this.props.indexes.map(index => (
            <Hits
              key={index.source.indexName}
              indexName={index.source.indexName}
              query={this.state.query}
              index={index}
              selected={this.state.selected}
              onSuggestions={this.onSuggestions}
              onClick={this.onSuggestionClick}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Autocomplete;
