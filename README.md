# vui-custom-values-with-synonyms

npm package that provides ability to add custom VUI type with synonym functionality to any javascript object.

# Repository
This module as well as related vui modules can be found here:
https://github.com/RationalAnimal

# Installation

```shell
	npm install vui-custom-values-with-synonyms --save
```
or, if you don't want to run unit tests on it:

```shell
	npm install vui-custom-values-with-synonyms --save --production
```

# Summary

This project provides npm package to add custom VUI type with synonym functionality to any javascript object.
Once this functionality is added then the custom types and their associated values can be added.
Then you can generate custom type values directly from code for import into, for example, Amazon Alexa console.
Furthermore, the use of these values is further improved because mapping functions between equivalent custom type values are automatically generated and added to the object.
While the primary purpose is to add this functionality to other VUI related objects, this is NOT necessary and is purely driven by usefulness.
These functions can be added to ANY object and they don't require that the target class has anything to do with VUI.

# Examples

```javascript
var synonyms = require("<path to vui-custom-values-with-synonyms>");
var app = {};
synonyms.addSynonymsToApp(app);

app.addCustomSlotType("vegetable",
  {
    mappingFunctionName: "mapDeliciousVegetable",
    values: [
    {
      text: "carrot"
    },
    {
      text: "russell",
      mapTo: "potato"
    },
    {
      text: "potato"
    }
  ]}
);

```
# Dumping custom type values

One of the advantages of using this module is that you can generate the custom type (type) values directly from the code:

```javascript
console.log(app.getCustomSlotTypeValues("vegetable"));
```

will print out all the type values for the "vegetable" custom type:

```shell
carrot
russell
potato
```

# Synonyms and Mapping Functions

Frequently in a VUI app you will design your interactions so that your app will accept multiple versions of the same answer.
For example, an ingredients question might ask for vegetables and will treat "scallion" and "green onion" values as completely equivalent.
Rather than have ad hoc logic, you can simply treat them as synonyms and map them to the same value.
And this module will automatically generate of mapping function whenever you add a custom type.
So, after adding "vegetable" custom type such as this:

```javascript
app.addCustomSlotType("vegetable",
  {
    mappingFunctionName: "mapDeliciousVegetable",
    values: [
    {
      text: "potato"
    },
    {
      text: "green onion",
      mapTo: "scallion"
    },
    {
      text: "scallion"
    }
  ]}
);
```

the following code

```javascript
var vegetables = app.getCustomSlotTypeValues("vegetable");
console.log(app.mapDeliciousVegetable(vegetables[0]));
console.log(app.mapDeliciousVegetable(vegetables[1]));
console.log(app.mapDeliciousVegetable(vegetables[2]));
```

will print the mapped type values for the "vegetable" custom type:

```shell
potato
scallion
scallion
```
# Prompts

In VUI programming there is often a need to prompt the user for selecting amongst
several options. When these answers are accepted they are usually treated as a
custom type - this way only a single intent is needed.  With vui-custom-values-with-synonyms
you can add the prompts as part of the custom type definition.

Imagine you would like to ask a user what type of movie he'd like to watch.  You may
define a custom type this way:

```javascript
app.addCustomSlotType("moviegenre",
  {
    mappingFunctionName: "mapMovieGenre",
		values: [
			{
				text: "comedy",
				prompts: [
					{
						categories: ["DEFAULT", "datenight"],
						text: "a funny comedy to make you laugh "
					}
				]
			},
			{
				text: "drama",
				prompts: [
					{
						categories: ["DEFAULT", "datenight"],
						text: "a serious drama "
					}
				]
			},
			{
				text: "horror",
				prompts: [
					{
						categories: ["DEFAULT"],
						text: "a horror movie to scare you "
					}
				]
			}
		]
  }
);
```

then you can build a prompt for the user to select a genre like this:

```javascript
var askUser = "What kind of a movie would you like to watch?  You can select from: ";
var defaultPrompts = app.getPrompts("moviegenre");
for(var i = 0; i < defaultPrompts.length; i++){
	askUser += defaultPrompts[i];
}
```

or if you want to ask the user only for the movie genres that are likely to be
appropriate for a date night, you can do it like this:

```javascript
var askUser = "What kind of a movie would you like to watch together?  You can select from: ";
var dateNightPrompts = app.getPrompts("moviegenre", "datenight");
for(var i = 0; i < dateNightPrompts.length; i++){
	askUser += dateNightPrompts[i];
}
```


# Loading from JSON files

Since a custom type is defined by passing a JSON object to the addCustomSlotType(),
you can easily load it from a file, e.g.:

```javascript
var meats = require("./meat.json");
app.addCustomSlotType("meat", meats);
```

where the meat.json file contains the same text as what you'd pass to
addCustomSlotType() call:

```shell
{
  "mappingFunctionName": "mapDeliciousCritters",
  "fileName": "tastycritters.txt",
  "values": [
    {
      "text": "beef"
    },
    {
      "text": "the other white meat",
      "mapTo": "pork"
    },
    {
      "text": "pork"
    }
  ]
}
```
