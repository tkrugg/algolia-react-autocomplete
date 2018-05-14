import React from "react";
import Hits from "./Hits";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("Hits", () => {
  let hits;
  beforeEach(() => {
    hits = [
      {
        objectID: "p0",
        name: "player 0"
      },
      {
        objectID: "p1",
        name: "player 1"
      },
      {
        objectID: "p2",
        name: "player 2"
      }
    ];
  });

  describe("Hits", () => {
    it("should trigger a call to search on query change and eventually populate state", async () => {
      const search = jest.fn(() => Promise.resolve({ hits }));
      const wrapper = shallow(
        <Hits
          index={{
            source: {
              indexName: "players",
              search
            }
          }}
          onSuggestions={jest.fn()}
          onClick={jest.fn()}
        />
      );

      wrapper.setProps({ query: "new-query" });
      expect(search).toHaveBeenCalledWith("new-query", {});
      await wrapper.instance()._promise;
      wrapper.instance().forceUpdate();
      expect(wrapper.state("hits")).toEqual(hits);
    });
    it("should populate state with empty array if search failed", async () => {
      const search = jest.fn(() => Promise.reject());
      const wrapper = shallow(
        <Hits
          index={{
            source: {
              indexName: "players",
              search
            }
          }}
          onSuggestions={jest.fn()}
          onClick={jest.fn()}
        />
      );

      wrapper.setProps({ query: "new-query" });
      expect(search).toHaveBeenCalledWith("new-query", {});
      try {
        await wrapper.instance()._promise;
        expect(true).toEqual(false); // should throw an error
      } catch (e) {
        expect(wrapper.state("hits")).toEqual([]);
      }
    });
    it("should display hits stored in the state", async () => {
      const search = jest.fn(() => Promise.resolve());
      const wrapper = shallow(
        <Hits
          index={{
            source: {
              indexName: "players",
              search
            }
          }}
          onSuggestions={jest.fn()}
          onClick={jest.fn()}
        />
      );

      wrapper.setState({ hits });
      expect(wrapper.find(".aa-suggestion").length).toBe(hits.length);
      expect(wrapper.find(".aa-suggestion").map(e => e.text())).toEqual(
        hits.map(h => h.name)
      );
    });
  });
});
