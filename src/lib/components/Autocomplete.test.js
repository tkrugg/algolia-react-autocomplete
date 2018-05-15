import React from 'react';
import Hits from './Hits';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Autocomplete from './Autocomplete';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('./SelectionManager', () => jest.fn());
jest.mock('./Hits', () => 'Hints');

describe('Autocomplete', () => {
  let hits;
  beforeEach(() => {
    hits = [
      {
        objectID: 'p0',
        name: 'player 0',
      },
      {
        objectID: 'p1',
        name: 'player 1',
      },
      {
        objectID: 'p2',
        name: 'player 2',
      },
    ];
  });

  it('should initialize with state value', () => {
    const indexes = [
      {
        source: {
          search: jest.fn(),
          indexName: 'players',
        },
        displayKey: 'name',
      },
      {
        source: {
          search: jest.fn(),
          indexName: 'teams',
        },
        displayKey: 'name',
      },
    ];
    const wrapper = shallow(
      <Autocomplete indexes={indexes} onSelectionChange={jest.fn()}>
        <input type="search" key="input"/>
      </Autocomplete>,
    );

    wrapper.find('input[type="search"]').simulate('change', { target: { value: 'some query' } })
    expect(wrapper.state('query')).toEqual('some query');
    expect(wrapper.state('value')).toEqual('some query');
  });


  describe('should react to key down', () => {
    let wrapper, event, onSelectionChange;
    beforeEach(() => {
      const indexes = [
        {
          source: {
            search: jest.fn(),
            indexName: 'players',
          },
          displayKey: 'name',
        },
        {
          source: {
            search: jest.fn(),
            indexName: 'teams',
          },
          displayKey: 'name',
        },
      ];
      onSelectionChange = jest.fn();
      wrapper = shallow(
        <Autocomplete indexes={indexes} onSelectionChange={onSelectionChange}>
          <input type="search" key="input"/>
        </Autocomplete>,
      );

      wrapper.instance().onSuggestions(hits, 'players');
      wrapper.instance().suggestions = {
        next: jest.fn(() => 'next'),
        prev: jest.fn(() => 'prev'),
        nextCategory: jest.fn(() => 'nextCategory'),
        prevCategory: jest.fn(() => 'prevCategory'),
        current: {
          name: 'player 0',
          category: 'players',
        },
      };
      event = {
        preventDefault: jest.fn(),
      };
    });

    it('should call .next when ArrowDown', () => {
      wrapper.find('input[type="search"]').simulate('keydown', { key: 'ArrowDown', ...event });
      expect(wrapper.instance().suggestions.next).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(wrapper.state('selected')).toEqual('next')
    });
    it('should call .prev when ArrowUp', () => {
      wrapper.find('input[type="search"]').simulate('keydown', { key: 'ArrowUp', ...event });
      expect(wrapper.instance().suggestions.prev).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(wrapper.state('selected')).toEqual('prev')
    });
    it('should call .nextCategory when ArrowRight', () => {
      wrapper.find('input[type="search"]').simulate('keydown', { key: 'ArrowRight', ...event });
      expect(wrapper.instance().suggestions.nextCategory).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(wrapper.state('selected')).toEqual('nextCategory')
    });
    it('should call .prevCategory when ArrowLeft', () => {
      wrapper.find('input[type="search"]').simulate('keydown', { key: 'ArrowLeft', ...event });
      expect(wrapper.instance().suggestions.prevCategory).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(wrapper.state('selected')).toEqual('prevCategory')
    });
    it('should call close the autocompelete on Escape', () => {
      expect(wrapper.state('open')).toEqual(true);
      wrapper.find('input[type="search"]').simulate('keydown', { key: 'Escape', ...event });
      expect(event.preventDefault).toHaveBeenCalled();
      expect(wrapper.state('selected')).toEqual(null);
      expect(wrapper.state('open')).toEqual(false);
    });
    it('should call this.props.onSelectionChange, set value and close autotocomplete on Enter', () => {
      expect(wrapper.state('open')).toEqual(true);
      wrapper.find('input[type="search"]').simulate('keydown', { key: 'Enter', ...event });
      expect(event.preventDefault).toHaveBeenCalled();
      expect(onSelectionChange).toHaveBeenCalledWith({ 'category': 'players', 'name': 'player 0' }, 'players');
      expect(wrapper.state('open')).toEqual(false);
      expect(wrapper.state('value')).toEqual('player 0');
    });
    it('should hide Hits when open == false', () => {
      wrapper.setState({ 'open': false });
      expect(wrapper.find('.aa-dropdown-menus').prop('style')).toEqual({ display: 'none' });
    });
    it('should show Hits when open == true', () => {
      wrapper.setState({ 'open': true });
      expect(wrapper.find('.aa-dropdown-menus').prop('style')).toEqual({});
    });
  });
});
