

## Usage

```sh
$ npm i algoliasearch algolia-react-autocomplete"
```

```js
import algoliasearch from "algoliasearch";

import Autocomplete from "algolia-react-autocomplete";
import "algolia-react-autocomplete/build/css/index.css";


// init algoliasearch sdk and indexes
const client = algoliasearch('myApplicationID', 'myApiKey');
const indexes = [
      {
        source: this.client.initIndex("players"),
        displayKey: 'name',
        templates: {
          header: () => <h2 className="aa-suggestions-category"> Players</h2>
          suggestion: (suggestion, isSelected) => <div data-selected={isSelected}> {suggestion.name} </div>
        }
      },
]


// in your render method
<Autocomplete indexes={indexes} onSelectionChange={selectedSuggestion => console.log(selectedSuggestion)>
    <input key="input" type="search" className="aa-input-search" autocomplete="off" />
</Autocomplete>
```

## Run demo
```sh
$ git clone https://github.com/tkrugg/algolia-react-autocomplete.git
$ cd algolia-react-autocomplete
$ npm i
$ npm start
```

## FAQ

### It doesn't work
Okay.
Don't forget to throw in an `<input key="input" />` as a direct child.

### why do I have to install algoliasearch myself, can't I just pass in my credentials inside the component
You're right. This component makes assumptions on the algolia sdk it's being passed, embedding the lib is safer.
But I'm suspecting the user might be using this same sdk as a data source for other components. This is more flexible.

### CSS is for dummies, why not inline styles?
CSS classes are easier and faster to override. With inline styles we'd have to expose every style attribute under that piece of DOM.
Plus, I just hate inline styles :troll:. Please try to change my mind, don't give up on me.


## Credits
This component was started off this boilerplate: https://github.com/DimiMikadze/create-react-library