import React from 'react';
import Hits from './Hits';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Hits', () => {
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

  describe('Hits', () => {
    it('should trigger a call to search on query change and eventually populate state', async () => {
      const search = jest.fn(() => Promise.resolve({ hits }));
      const wrapper = mount(
        <Hits
          index={{
            source: {
              indexName: 'players',
              search,
            },
            displayKey: 'name',
          }}
          onSuggestions={jest.fn()}
          onClick={jest.fn()}
        />,
      );

      wrapper.setProps({ query: 'new-query' });
      expect(search).toHaveBeenCalledWith('new-query', {});
      await wrapper.instance()._promise;
      wrapper.instance().forceUpdate();
      expect(wrapper.state('hits')).toEqual(hits);
    });
    it('should populate state with empty array if search failed', async () => {
      const search = jest.fn(() => Promise.reject());
      const wrapper = mount(
        <Hits
          index={{
            source: {
              indexName: 'players',
              search,
            },
            displayKey: 'name',
          }}
          onSuggestions={jest.fn()}
          onClick={jest.fn()}
        />,
      );

      wrapper.setProps({ query: 'new-query' });
      expect(search).toHaveBeenCalledWith('new-query', {});
      try {
        await wrapper.instance()._promise;
        expect(true).toEqual(false); // should throw an error
      } catch (e) {
        expect(wrapper.state('hits')).toEqual([]);
      }
    });
    it('should display hits stored in the state', async () => {
      const search = jest.fn(() => Promise.resolve());
      const wrapper = mount(
        <Hits
          index={{
            source: {
              indexName: 'players',
              search,
            },
            displayKey: 'name',

          }}
          onSuggestions={jest.fn()}
          onClick={jest.fn()}
        />,
      );

      wrapper.setState({ hits });
      expect(wrapper.find('.aa-suggestion').length).toBe(hits.length);
      expect(wrapper.find('.aa-suggestion').map(e => e.text())).toEqual(
        hits.map(h => h.name),
      );
    });
    it('should call onClick when suggestion is clicked', async () => {
      const onClick = jest.fn();
      const wrapper = mount(
        <Hits
          index={{
            source: {
              indexName: 'players',
              search: jest.fn(() => Promise.resolve()),
            },
            displayKey: 'name',

          }}
          onSuggestions={jest.fn()}
          onClick={onClick}
        />,
      );

      wrapper.setState({ hits });
      wrapper.find('.aa-suggestion').at(1).simulate('click');
      expect(onClick).toHaveBeenCalledWith({ 'name': 'player 1', 'objectID': 'p1' }, 'players');
    });

    it('should use template when passed', async () => {
      const onClick = jest.fn();
      const wrapper = mount(
        <Hits
          index={{
            source: {
              indexName: 'players',
              search: jest.fn(() => Promise.resolve()),
            },
            displayKey: 'name',
            templates: {
              header: () => <h4 data-header>The Players</h4>,
              suggestion: (props, isSelected) => <div data-suggestion> {props.objectID} </div>,
            },

          }}
          onSuggestions={jest.fn()}
          onClick={onClick}
        />,
      );

      wrapper.setState({ hits });
      expect(wrapper.find('.aa-suggestion [data-suggestion]').length).toBe(3);
      expect(wrapper.find('[data-header]').text()).toBe('The Players');
    });

    it('should highlight selected objectID if found', async () => {
      const onClick = jest.fn();
      const wrapper = mount(
        <Hits
          index={{
            source: {
              indexName: 'players',
              search: jest.fn(() => Promise.resolve()),
            },
            displayKey: 'name',
          }}
          onSuggestions={jest.fn()}
          onClick={onClick}
          selected="p0"
        />,
      );

      wrapper.setState({ hits });
      expect(wrapper.find('.aa-suggestion [aria-selected=true]').length).toBe(1);
      expect(wrapper.find('.aa-suggestion [aria-selected=false]').length).toBe(2);

      expect(wrapper.find('.aa-suggestion [aria-selected=true]').text()).toBe('player 0');
    });


    it('should not highlight selected objectID if found', async () => {
      const onClick = jest.fn();
      const wrapper = mount(
        <Hits
          index={{
            source: {
              indexName: 'players',
              search: jest.fn(() => Promise.resolve()),
            },
            displayKey: 'name',
          }}
          onSuggestions={jest.fn()}
          onClick={onClick}
          selected="xxxx"
        />,
      );

      wrapper.setState({ hits });
      expect(wrapper.find('.aa-suggestion [aria-selected=true]').length).toBe(0);
      expect(wrapper.find('.aa-suggestion [aria-selected=false]').length).toBe(3);
    });
  });
});
