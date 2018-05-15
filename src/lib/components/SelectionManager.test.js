import SelectionManager from './SelectionManager';

describe('SelectionManager', () => {
  let selection;
  beforeEach(() => {
    selection = SelectionManager(['players', 'teams'], {
      players: [
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
      ],
      teams: [
        {
          objectID: 't0',
          name: 'team 0',
        },
      ],
    });
  });

  describe('next', () => {
    it('on init should return first item of first category', () => {
      expect(selection.next()).toEqual('p0');
    });
    it('it should cycle over values as it\'s being called', () => {
      expect(selection.next()).toEqual('p0');
      expect(selection.next()).toEqual('p1');
      expect(selection.next()).toEqual('p2');
      expect(selection.next()).toEqual('t0');
      expect(selection.next()).toEqual('p0');
    });
    it('it should return null if no results', () => {
      const _selection = SelectionManager(['player', 'teams'], []);
      expect(_selection.next()).toEqual(null);
    });
  });
  describe('prev', () => {
    it('on init should return last item of last category', () => {
      expect(selection.prev()).toEqual('t0');
    });
    it('it should cycle over values as it\'s being called', () => {
      expect(selection.next()).toEqual('p0');
      expect(selection.next()).toEqual('p1');
      expect(selection.prev()).toEqual('p0');
    });
    it('it should return null if no results', () => {
      const _selection = SelectionManager(['player', 'teams'], []);
      expect(_selection.next()).toEqual(null);
    });
  });
  describe('nextCategory', () => {
    it('should return first item for next category', () => {
      expect(selection.next()).toEqual('p0');
      expect(selection.next()).toEqual('p1');
      expect(selection.nextCategory()).toEqual('t0');
    });
    it('should not change selection if reached last category', () => {
      expect(selection.next()).toEqual('p0');
      expect(selection.nextCategory()).toEqual('t0');
      expect(selection.nextCategory()).toEqual(null);
    });
    it('it should return null if no results', () => {
      const _selection = SelectionManager(['player', 'teams'], []);
      expect(_selection.next()).toEqual(null);
    });
  });
  describe('prevCategory', () => {
    it('should return first item for previous category', () => {
      expect(selection.next()).toEqual('p0');
      expect(selection.next()).toEqual('p1');
      expect(selection.nextCategory()).toEqual('t0');
      expect(selection.prevCategory()).toEqual('p0');
    });
    it('should not change selection if reached first category', () => {
      expect(selection.next()).toEqual('p0');
      expect(selection.next()).toEqual('p1');
      expect(selection.nextCategory()).toEqual('t0');
      expect(selection.prevCategory()).toEqual('p0');
      expect(selection.prevCategory()).toEqual(null);
    });
    it('it should return null if no results', () => {
      const _selection = SelectionManager(['player', 'teams'], []);
      expect(_selection.next()).toEqual(null);
    });
  });
});
