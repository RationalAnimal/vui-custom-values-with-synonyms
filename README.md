# vui-custom-values-with-synonyms

npm package that provides ability to add custom "slot" (i.e. VUI type) with synonym functionality to any javascript object.

# Installation

```shell
	npm install vui-custom-values-with-synonyms --save
```
or, if you don't want to run unit tests on it:

```shell
	npm install vui-custom-values-with-synonyms --save --production
```

# Summary

This project provides npm package to add custom "slot" (i.e. VUI type) with synonym functionality to any javascript object.
Once this functionality is added then the custom slots and their associated values can be added.
Then you can generate custom slot values directly from code for import into, for example, Amazon Alexa console.
Furthermore, the use of these values is further improved because mapping functions between equivalent custom slot values are automatically generated and added to the object.
While the primary purpose is to add this functionality to other VUI related objects, this is NOT necessary and is purely driven by usefulness.
These functions can be added to ANY object and they don't require that the target class has anything to do with VUI.

# Examples

```javascript
var synonyms = require("<path to vui-custom-values-with-synonyms>");
var app = {};
synonyms.addSynonymsToApp(app);

app.addCustomSlot("vegetable",
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
# Dumping custom slot values

One of the advantages of using this module is that you can generate the custom slot (type) values directly from the code:

```javascript
console.log(app.getCustomSlotValues("vegetable"));
```

will print out all the slot values for the "vegetable" custom slot:

```shell
carrot
russell
potato
```

# Mapping functions

Another advantage is the automatic generation of mapping functions whenever you add a custom slot.  So, after adding "vegetable" custom slot
above, the following code

```javascript
console.log(app.mapDeliciousVegetable(app.getCustomSlotValues("vegetable")[0]));
console.log(app.mapDeliciousVegetable(app.getCustomSlotValues("vegetable")[1]));
console.log(app.mapDeliciousVegetable(app.getCustomSlotValues("vegetable")[2]));
```

will print the mapped slot values for the "vegetable" custom slot:

```shell
carrot
potato
potato
```

# Loading from JSON files

Since a custom slot is defined by passing a JSON object to the addCustomSlot(),
you can easily load it from a file, e.g.:

```javascript
var meats = require("./meat.json");
app.addCustomSlot("meat", meats);
```
