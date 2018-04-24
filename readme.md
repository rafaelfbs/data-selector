
# Rule Tree
[![Build Status](https://travis-ci.org/rafaelfbs/data-selector.svg?branch=master)](https://travis-ci.org/rafaelfbs/data-selector)
[![codecov](https://codecov.io/gh/rafaelfbs/data-selector/branch/master/graph/badge.svg)](https://codecov.io/gh/rafaelfbs/data-selector)

A simpler query selector for javascript objects

### Usage

```javascript
import { createSelector } from 'rule-tree';

const getAuthorFriendsNames = createSelector('.author.friends[].name[]')

const myPost = {
    id: 1,
    title: 'My Post',
    content: 'Lorem Ipsum',
    author: {
        id: 1,
        name: 'Author',
        friends: [
            {
                id: 2,
                name: 'Friend 1',
            },
            {
                id: 3,
                name: 'Friend 2',
            },
        ]
    }
};

const authorFriendsNames = getAuthorFriendsNames.from(myPost);
/**
* Returns:
*   ['Friend 1', 'Friend 2']
*/
```
