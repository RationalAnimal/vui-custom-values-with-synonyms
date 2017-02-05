/*
MIT License

Copyright (c) 2017 Ilya Shubentsov

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
*/
var expect = require("chai").expect;
var synonyms = require("../index.js");
describe("vui-custom-values-with-synonyms", function() {
  describe("getCustomSlotTypeNames", function() {
    var app = {};
    synonyms.addSynonymsToApp(app);
    app.addCustomSlotType("fruit",
      {values: [
        {
          text: "apple"
        },
        {
          text: "golden delicious",
          mapTo: "apple"
        },
        {
          text: "banana"
        }
      ]}
    );
    app.addCustomSlotType("vegetable",
      {
        mappingFunctionName: "mapDeliciousVegetable",
        fileName: "essentialvegetables.txt",
        values: [
        {
          text: "carrot"
        },
        {
          text: "russel",
          mapTo: "potato"
        },
        {
          text: "potato"
        }
      ]}
    );

    var typeNames = app.getCustomSlotTypeNames();
    it("verify that we are getting back the type names.", function() {
      expect(typeNames[0]).to.equal("fruit");
      expect(typeNames[1]).to.equal("vegetable");
    });
  });


  describe("getPrompts", function() {
    var app = {};
    synonyms.addSynonymsToApp(app);
    app.addCustomSlotType("fruit",
      {
        values: [
          {
            text: "apple",
            prompts: [
              {
                categories: ["DEFAULT", "desert"],
                text: "apple"
              }
            ]
          },
          {
            text: "golden delicious",
            mapTo: "apple",
            prompts: [
              {
                categories: ["apple variety"],
                text: "golden delicious apple"
              }
            ]
          },
          {
            text: "granny smith",
            mapTo: "apple",
            prompts: [
              {
                categories: ["apple variety"],
                text: "granny smith apple"
              }
            ]
          },
          {
            text: "banana",
            prompts: [
              {
                categories: ["DEFAULT", "desert"],
                text: "banana"
              }
            ]
          }
        ]
      }
    );

    var defaultPrompts = app.getPrompts("fruit");
    var applePrompts = app.getPrompts("fruit", "apple variety");
    it("verify that we are getting back the default prompts.", function() {
      expect(defaultPrompts[0]).to.equal("apple");
      expect(defaultPrompts[1]).to.equal("banana");
    });
    it("verify that we are getting back the prompts.", function() {
      expect(applePrompts[0]).to.equal("golden delicious apple");
      expect(applePrompts[1]).to.equal("granny smith apple");
    });
  });

  describe("getSlotTypeDumpFileName", function() {
    var app = {};
    synonyms.addSynonymsToApp(app);
    app.addCustomSlotType("fruit",
      {values: [
        {
          text: "apple"
        },
        {
          text: "golden delicious",
          mapTo: "apple"
        },
        {
          text: "banana"
        }
      ]}
    );
    app.addCustomSlotType("vegetable",
      {
        mappingFunctionName: "mapDeliciousVegetable",
        fileName: "essentialvegetables.txt",
        values: [
        {
          text: "carrot"
        },
        {
          text: "russel",
          mapTo: "potato"
        },
        {
          text: "potato"
        }
      ]}
    );

    it("verify that we are getting back the file name to dump the custom type values to.", function() {
      expect(app.getSlotTypeDumpFileName("fruit")).to.equal("fruit.txt");
    });
    it("verify that we are getting back the file name to dump the custom type values to.", function() {
      expect(app.getSlotTypeDumpFileName("vegetable")).to.equal("essentialvegetables.txt");
    });
  });

  describe("getCustomSlotTypeValues", function() {
    var app = {};
    synonyms.addSynonymsToApp(app);
    app.addCustomSlotType("fruit",
      {values: [
        {
          text: "apple"
        },
        {
          text: "golden delicious",
          mapTo: "apple"
        },
        {
          text: "banana"
        }
      ]}
    );

    it("verify that we are getting back custom type values", function() {
      expect(app.getCustomSlotTypeValues("fruit")[0]).to.equal("apple");
      expect(app.getCustomSlotTypeValues("fruit")[1]).to.equal("golden delicious");
      expect(app.getCustomSlotTypeValues("fruit")[2]).to.equal("banana");
    });
  });

  describe("getMappingFunctionName", function() {
    var app = {};
    synonyms.addSynonymsToApp(app);
    app.addCustomSlotType("fruit",
      {values: [
        {
          text: "apple"
        },
        {
          text: "golden delicious",
          mapTo: "apple"
        },
        {
          text: "banana"
        }
      ]}
    );
    app.addCustomSlotType("vegetable",
      {
        mappingFunctionName: "mapDeliciousVegetable",
        values: [
        {
          text: "carrot"
        },
        {
          text: "russel",
          mapTo: "potato"
        },
        {
          text: "potato"
        }
      ]}
    );

    it("verify that we are getting back correct default name of the mapping function", function() {
      expect(app.getMappingFunctionName("fruit")).to.equal("mapFruit");
    });
    it("verify that we are getting back correct custom name of the mapping function", function() {
      expect(app.getMappingFunctionName("vegetable")).to.equal("mapDeliciousVegetable");
    });
  });

  describe("mapCustomSlotTypeValue", function() {
    var app = {};
    synonyms.addSynonymsToApp(app);
    app.addCustomSlotType("fruit",
      {values: [
        {
          text: "apple"
        },
        {
          text: "golden delicious",
          mapTo: "apple"
        },
        {
          text: "banana"
        }
      ]}
    );
    app.addCustomSlotType("vegetable",
      {
        mappingFunctionName: "mapDeliciousVegetable",
        values: [
        {
          text: "carrot"
        },
        {
          text: "russel",
          mapTo: "potato"
        },
        {
          text: "potato"
        }
      ]}
    );

    it("verify that we are getting back mapped custom type values", function() {
      expect(app.mapCustomSlotTypeValue("fruit", app.getCustomSlotTypeValues("fruit")[0])).to.equal("apple");
      expect(app.mapCustomSlotTypeValue("fruit", app.getCustomSlotTypeValues("fruit")[1])).to.equal("apple");
      expect(app.mapCustomSlotTypeValue("fruit", app.getCustomSlotTypeValues("fruit")[2])).to.equal("banana");
    });
    it("verify that we are getting back mapped custom type values when calling the default named mapping function by name", function() {
      expect(app.mapFruit(app.getCustomSlotTypeValues("fruit")[0])).to.equal("apple");
      expect(app.mapFruit(app.getCustomSlotTypeValues("fruit")[1])).to.equal("apple");
      expect(app.mapFruit(app.getCustomSlotTypeValues("fruit")[2])).to.equal("banana");
    });
    it("verify that we are getting back mapped custom type values when calling the custom named mapping function by name", function() {
      expect(app.mapDeliciousVegetable(app.getCustomSlotTypeValues("vegetable")[0])).to.equal("carrot");
      expect(app.mapDeliciousVegetable(app.getCustomSlotTypeValues("vegetable")[1])).to.equal("potato");
      expect(app.mapDeliciousVegetable(app.getCustomSlotTypeValues("vegetable")[2])).to.equal("potato");
    });
  });
  describe("Loading custom types from json files", function() {
    var app = {};
    synonyms.addSynonymsToApp(app);
    var meats = require("./meat.json");
    app.addCustomSlotType("meat", meats);

    it("verify that we are getting back custom type values", function() {
      expect(app.getCustomSlotTypeValues("meat")[0]).to.equal("beef");
      expect(app.getCustomSlotTypeValues("meat")[1]).to.equal("the other white meat");
      expect(app.getCustomSlotTypeValues("meat")[2]).to.equal("pork");
    });
    it("verify that we are getting back mapped custom type values when calling the mapping function by name", function() {
      expect(app.mapDeliciousCritters(app.getCustomSlotTypeValues("meat")[0])).to.equal("beef");
      expect(app.mapDeliciousCritters(app.getCustomSlotTypeValues("meat")[1])).to.equal("pork");
      expect(app.mapDeliciousCritters(app.getCustomSlotTypeValues("meat")[2])).to.equal("pork");
    });
  });

  describe("remapCustomSlotTypeValue", function() {
    var app = {};
    synonyms.addSynonymsToApp(app);
    app.addCustomSlotType("fruit",
      {values: [
        {
          text: "apple"
        },
        {
          text: "golden delicious",
          mapTo: "apple"
        },
        {
          text: "plantain",
          mapTo: "banana"
        }
      ]}
    );
    app.remapCustomSlotTypeValue("fruit", "golden delicious", "pear");
    app.remapCustomSlotTypeValue("fruit", "orange", "citrus", true);
    app.remapCustomSlotTypeValue("fruit", "plantain", "plantain");

    it("verify that we are getting back mapped custom type values", function() {
      expect(app.mapCustomSlotTypeValue("fruit", app.getCustomSlotTypeValues("fruit")[0])).to.equal("apple");
      expect(app.mapCustomSlotTypeValue("fruit", app.getCustomSlotTypeValues("fruit")[1])).to.equal("pear");
      expect(app.mapCustomSlotTypeValue("fruit", app.getCustomSlotTypeValues("fruit")[2])).to.equal("plantain");
      expect(app.mapCustomSlotTypeValue("fruit", app.getCustomSlotTypeValues("fruit")[3])).to.equal("citrus");
    });
    it("verify that we are getting back mapped custom type values when calling the default named mapping function by name", function() {
      expect(app.mapFruit(app.getCustomSlotTypeValues("fruit")[0])).to.equal("apple");
      expect(app.mapFruit(app.getCustomSlotTypeValues("fruit")[1])).to.equal("pear");
      expect(app.mapFruit(app.getCustomSlotTypeValues("fruit")[2])).to.equal("plantain");
      expect(app.mapFruit(app.getCustomSlotTypeValues("fruit")[3])).to.equal("citrus");
    });
  });
  describe("remapCustomSlotTypeMapping", function() {
    var app = {};
    synonyms.addSynonymsToApp(app);
    var meats = require("./meat.json");
    app.addCustomSlotType("meat",
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
    );
    app.remapCustomSlotTypeMapping("meat", "pork", "the other white meat");

    it("verify that we are getting back custom type values", function() {
      expect(app.getCustomSlotTypeValues("meat")[0]).to.equal("beef");
      expect(app.getCustomSlotTypeValues("meat")[1]).to.equal("the other white meat");
      expect(app.getCustomSlotTypeValues("meat")[2]).to.equal("pork");
    });
    it("verify that we are getting back mapped custom type values when calling the mapping function by name", function() {
      expect(app.mapDeliciousCritters(app.getCustomSlotTypeValues("meat")[0])).to.equal("beef");
      expect(app.mapDeliciousCritters(app.getCustomSlotTypeValues("meat")[1])).to.equal("the other white meat");
      expect(app.mapDeliciousCritters(app.getCustomSlotTypeValues("meat")[2])).to.equal("the other white meat");
    });
  });
});
