import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CancelablePromise from 'cancelable-promise';

const cancelable = promise =>
  new CancelablePromise((resolve, reject) => {
    promise.then(resolve).catch(reject);
  });

class Hit extends React.PureComponent {
  static propTypes = {
    hit: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired,
    indexName: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node,
  };

  // this callback here is the only reason I've made a separate Hit component here
  onClick = () => this.props.onClick(this.props.hit, this.props.indexName);

  render() {
    const { hit, isSelected } = this.props;
    return (
      <div
        className={classnames({ 'aa-suggestion': true, selected: isSelected })}
        role="option"
        key={hit.objectID}
        id={hit.objectID}
        onClick={this.onClick}
        aria-selected={isSelected}
      >
        {this.props.children}
      </div>
    )
  }
}

class Hits extends React.PureComponent {
  static propTypes = {
    index: PropTypes.shape({
      source: PropTypes.shape({
        indexName: PropTypes.string.isRequired,
      }).isRequired,
      displayKey: PropTypes.string.isRequired,
      template: PropTypes.shape({
        header: PropTypes.func,
        suggestion: PropTypes.func, // TODO: check props inside
      }),
    }).isRequired,
    selected: PropTypes.string,
    onSuggestions: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  state = {
    hits: [],
  };

  componentWillReceiveProps({ query }) {
    if (this.props.query !== query) {
      this.onQueryChange(query);
    }
  }

  onQueryChange = query => {
    if (this._promise) {
      this._promise.cancel();
    }
    this._promise = cancelable(this.props.index.source.search(query, {}))
      .then(({ hits }) => {
        this.setState({ hits });
        this.props.onSuggestions(hits, this.props.indexName);
      })
      .catch(error => this.setState({ hits: [] }));
  };

  renderHeader() {
    const { index: { source, templates } } = this.props;
    if (templates && templates.header) {
      return templates.header();
    }
    return <div className="aa-suggestions-category">{source.indexName}</div>;
  }

  renderHit = hit => {
    const { index: { source, templates, displayKey } } = this.props;
    const isSelected = this.props.selected === hit.objectID;
    let children = <Fragment>{hit[displayKey]}</Fragment>
    if (templates && templates.suggestion) {
      children = templates.suggestion(hit, isSelected)
    }

    return (
      <Hit key={hit.objectID} hit={hit} onClick={this.props.onClick} isSelected={isSelected}
           indexName={source.indexName}>
        {children}
      </Hit>
    );
  };

  render() {
    return (
      <span className="aa-dropdown-menu" role="listbox">
        {this.renderHeader()}
        <div className="aa-suggestions">
          {this.state.hits.map(this.renderHit)}
        </div>
      </span>
    );
  }
}

export default Hits;
