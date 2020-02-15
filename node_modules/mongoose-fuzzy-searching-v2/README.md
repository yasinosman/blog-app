# Mongoose Fuzzy Searching

mongoose-fuzzy-searching-v2 is simple and lightweight plugin that enables fuzzy searching in documents in MongoDB.
This code is based on [this article](https://medium.com/xeneta/fuzzy-search-with-mongodb-and-python-57103928ee5d).

[![Build Status](https://travis-ci.com/VassilisPallas/mongoose-fuzzy-searching-v2.svg?token=iwmbqGL1Zp9rkA7hmQ6P&branch=master)](https://travis-ci.com/VassilisPallas/mongoose-fuzzy-searching-v2)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FVassilisPallas%2Fmongoose-fuzzy-searching-v2.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FVassilisPallas%2Fmongoose-fuzzy-searching-v2?ref=badge_shield)

## Features

- [Add **fuzzySearch** method on model](#simple-usage)
- [Work with pre-existing data](#work-with-pre-existing-data)

## Installation

Install using [npm](https://npmjs.org)

```
npm i mongoose-fuzzy-searching-v2
```

## Usage

### Simple usage

In the below example, we have a `User` collection and we want to make fuzzy searching in `firstName` and `lastName`.

```javascript
var mongoose_fuzzy_searching = require("mongoose-fuzzy-searching-v2");

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  age: Number
});

UserSchema.plugin(mongoose_fuzzy_searching, {
  fields: ["firstName", "lastName"]
});

var User = mongoose.model("User", UserSchema);

var user = new User({
  firstName: "Joe",
  lastName: "Doe",
  email: "joe.doe@mail.com",
  age: 30
});

user.save(function() {
  // mongodb: { ..., firstName_fuzzy: [String], lastName_fuzzy: [String] }

  User.fuzzySearch("jo", function(err, users) {
    console.error(err);
    console.log(users);
    // each user object will not contain the fuzzy keys:
    // Eg.
    // {
    //   "firstName": "Joe",
    //   "lastName": "Doe",
    //   "email": "joe.doe@mail.com",
    //   "age": 30,
    //   "confidenceScore": 34.3 ($text meta score)
    // }
  });
});
```

The results are sorted by the `confidenceScore` key. You can override this option.

```javascript
User.fuzzySearch("jo")
  .sort({ age: -1 })
  .exec(function(err, users) {
    console.error(err);
    console.log(users);
  });
```

### Plugin Options

Options must have a `fields` key, which is an Array of `Strings` or an Array of `Objects`.

```javascript
var mongoose_fuzzy_searching = require("mongoose-fuzzy-searching-v2");

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String
});

UserSchema.plugin(mongoose_fuzzy_searching, {
  fields: ["firstName", "lastName"]
});
```

#### Object keys

The below table contains the expected keys for an object

Example:

```javascript
var mongoose_fuzzy_searching = require("mongoose-fuzzy-searching-v2");

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  text: [
    {
      title: String,
      description: String,
      language: String
    }
  ]
});
```

### fuzzySearch parameters

`fuzzySearch` method can accept up to three parameters. The first one is the query, which can either be either a `String` or an `Object`. This parameter is **required**.
The second parameter can either be eiter an `Object` with other queries, for example `age: { $gt: 18 }`, or a callback function.
If the second parameter is the options, then the third parameter is the callback function. If you don't set a callback function, the results will be returned inside a Promise.

Example:

```javascript
/* Without options and callback */
Model.fuzzySearch("jo")
  .then(console.log)
  .catch(console.error);
// or
Model.fuzzySearch({ query: "jo" })
  .then(console.log)
  .catch(console.error);
// with prefixOnly and minSize
Model.fuzzySearch({ query: "jo", prefixOnly: true, minSize: 4 })
  .then(console.log)
  .catch(console.error);

/* With options and without callback */
Model.fuzzySearch("jo", { age: { $gt: 18 } })
  .then(console.log)
  .catch(console.error);

/* With callback */
Model.fuzzySearch("jo", function(err, doc) {
  if (err) {
    console.error(err);
  } else {
    console.log(doc);
  }
});

/* With options and callback */
Model.fuzzySearch("jo", { age: { $gt: 18 } }, function(err, doc) {
  if (err) {
    console.error(err);
  } else {
    console.log(doc);
  }
});
```

## Work with pre-existing data

The plugin creates indexes for the selected fields. In the below example the new indexes will be `firstName_fuzzy` and `lastName_fuzzy`. Also, each document will have the fields `firstName_fuzzy`[String] and `lastName_fuzzy`[String]. These arrays will contain the anagrams for the selected fields.

```javascript
var mongoose_fuzzy_searching = require("mongoose-fuzzy-searching-v2");

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  age: Number
});

UserSchema.plugin(mongoose_fuzzy_searching, {
  fields: ["firstName", "lastName"]
});
```

## License

MIT License

Copyright (c) 2019 Vassilis Pallas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FVassilisPallas%2Fmongoose-fuzzy-searching-v2.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FVassilisPallas%2Fmongoose-fuzzy-searching-v2?ref=badge_large)
