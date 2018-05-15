import flatten from 'lodash.flatten';

const SelectionManager = (categories, suggestions) => {
  return {
    list: flatten(
      categories.map(category =>
        (suggestions[category] || [])
          .map(suggestion => ({
            ...suggestion,
            category,
          })),
      ),
    ),
    currentIndex: -1,
    get current() {
      return this.list[this.currentIndex];
    },
    next: function () {
      if (!this.list.length) return null;
      this.currentIndex = (this.currentIndex + 1) % this.list.length;
      return this.list[this.currentIndex].objectID;
    },
    prev: function () {
      if (!this.list.length) return null;
      if (this.currentIndex < 1) {
        this.currentIndex = this.list.length;
      }
      this.currentIndex = this.currentIndex - 1;
      return this.list[this.currentIndex].objectID;
    },
    nextCategory: function () {
      if (!this.list[this.currentIndex]) return null;
      const currentCategory = this.list[this.currentIndex].category;
      const nextCategoryIndex =
        categories.findIndex(category => category === currentCategory) + 1;
      if (nextCategoryIndex > categories.length - 1) return null;
      const nextCategory = categories[nextCategoryIndex];
      const nextIndex = this.list.findIndex(
        suggestion => suggestion.category === nextCategory,
      );
      if (nextIndex === -1) return null;
      this.currentIndex = nextIndex;
      return this.list[this.currentIndex].objectID;
    },
    prevCategory: function () {
      if (!this.list[this.currentIndex]) return null;
      const currentCategory = this.list[this.currentIndex].category;
      const prevCategoryIndex =
        categories.findIndex(category => category === currentCategory) - 1;
      if (prevCategoryIndex < 0) return null;
      const prevCategory = categories[prevCategoryIndex];
      const prevIndex = this.list.findIndex(
        suggestion => suggestion.category === prevCategory,
      );
      if (prevIndex === -1) return null;
      this.currentIndex = prevIndex;
      return this.list[this.currentIndex].objectID;
    },
  };
};

export default SelectionManager;
