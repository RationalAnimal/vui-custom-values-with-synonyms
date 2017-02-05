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
  describe("getCustomTypeNames", function() {
    var app = {};
    synonyms.addSynonymsToApp(app);
    app.addCustomType("fruit",
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
    app.addCustomType("vegetable",
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

    var typeNames = app.getCustomTypeNames();
    it("verify that we are getting back the type names.", function() {
      expect(typeNames[0]).to.equal("fruit");
      expect(typeNames[1]).to.equal("vegetable");
    });
  });


  describe("getPrompts", function() {
    var app = {};
    synonyms.addSynonymsToApp(app);
    app.addCustomType("fruit",
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

  describe("getSlotDumpFileName", function() {
    var app = {};
    synonyms.addSynonymsToApp(app);
    app.addCustomType("fruit",
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
    app.addCustomType("vegetable",
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
      expect(app.getSlotDumpFileName("fruit")).to.equal("fruit.txt");
    });
    it("verify that we are getting back the file name to dump the custom type values to.", function() {
      expect(app.getSlotDumpFileName("vegetable")).to.equal("essentialvegetables.txt");
    });
  });

  describe("getCustomSlotValues", function() {
    var app = {};
    synonyms.addSynonymsToApp(app);
    app.addCustomType("fruit",
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
      expect(app.getCustomSlotValues("fruit")[0]).to.equal("apple");
      expect(app.getCustomSlotValues("fruit")[1]).to.equal("golden delicious");
      expect(app.getCustomSlotValues("fruit")[2]).to.equal("banana");
    });
  });

  describe("getMappingFunctionName", function() {
    var app = {};
    synonyms.addSynonymsToApp(app);
    app.addCustomType("fruit",
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
    app.addCustomType("vegetable",
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

  describe("mapCustomSlotValue", function() {
    var app = {};
    synonyms.addSynonymsToApp(app);
    app.addCustomType("fruit",
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
    app.addCustomType("vegetable",
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
      expect(app.mapCustomSlotValue("fruit", app.getCustomSlotValues("fruit")[0])).to.equal("apple");
      expect(app.mapCustomSlotValue("fruit", app.getCustomSlotValues("fruit")[1])).to.equal("apple");
      expect(app.mapCustomSlotValue("fruit", app.getCustomSlotValues("fruit")[2])).to.equal("banana");
    });
    it("verify that we are getting back mapped custom type values when calling the default named mapping function by name", function() {
      expect(app.mapFruit(app.getCustomSlotValues("fruit")[0])).to.equal("apple");
      expect(app.mapFruit(app.getCustomSlotValues("fruit")[1])).to.equal("apple");
      expect(app.mapFruit(app.getCustomSlotValues("fruit")[2])).to.equal("banana");
    });
    it("verify that we are getting back mapped custom type values when calling the custom named mapping function by name", function() {
      expect(app.mapDeliciousVegetable(app.getCustomSlotValues("vegetable")[0])).to.equal("carrot");
      expect(app.mapDeliciousVegetable(app.getCustomSlotValues("vegetable")[1])).to.equal("potato");
      expect(app.mapDeliciousVegetable(app.getCustomSlotValues("vegetable")[2])).to.equal("potato");
    });
  });
  describe("Loading custom types from json files", function() {
    var app = {};
    synonyms.addSynonymsToApp(app);
    var meats = require("./meat.json");
    app.addCustomType("meat", meats);

    it("verify that we are getting back custom type values", function() {
      expect(app.getCustomSlotValues("meat")[0]).to.equal("beef");
      expect(app.getCustomSlotValues("meat")[1]).to.equal("the other white meat");
      expect(app.getCustomSlotValues("meat")[2]).to.equal("pork");
    });
    it("verify that we are getting back mapped custom type values when calling the mapping function by name", function() {
      expect(app.mapDeliciousCritters(app.getCustomSlotValues("meat")[0])).to.equal("beef");
      expect(app.mapDeliciousCritters(app.getCustomSlotValues("meat")[1])).to.equal("pork");
      expect(app.mapDeliciousCritters(app.getCustomSlotValues("meat")[2])).to.equal("pork");
    });
  });

  describe("remapCustomSlotValue", function() {
    var app = {};
    synonyms.addSynonymsToApp(app);
    app.addCustomType("fruit",
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
    app.remapCustomSlotValue("fruit", "golden delicious", "pear");
    app.remapCustomSlotValue("fruit", "orange", "citrus", true);
    app.remapCustomSlotValue("fruit", "plantain", "plantain");

    it("verify that we are getting back mapped custom type values", function() {
      expect(app.mapCustomSlotValue("fruit", app.getCustomSlotValues("fruit")[0])).to.equal("apple");
      expect(app.mapCustomSlotValue("fruit", app.getCustomSlotValues("fruit")[1])).to.equal("pear");
      expect(app.mapCustomSlotValue("fruit", app.getCustomSlotValues("fruit")[2])).to.equal("plantain");
      expect(app.mapCustomSlotValue("fruit", app.getCustomSlotValues("fruit")[3])).to.equal("citrus");
    });
    it("verify that we are getting back mapped custom type values when calling the default named mapping function by name", function() {
      expect(app.mapFruit(app.getCustomSlotValues("fruit")[0])).to.equal("apple");
      expect(app.mapFruit(app.getCustomSlotValues("fruit")[1])).to.equal("pear");
      expect(app.mapFruit(app.getCustomSlotValues("fruit")[2])).to.equal("plantain");
      expect(app.mapFruit(app.getCustomSlotValues("fruit")[3])).to.equal("citrus");
    });
  });
  describe("remapCustomSlotMapping", function() {
    var app = {};
    synonyms.addSynonymsToApp(app);
    var meats = require("./meat.json");
    app.addCustomType("meat",
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
    app.remapCustomSlotMapping("meat", "pork", "the other white meat");

    it("verify that we are getting back custom type values", function() {
      expect(app.getCustomSlotValues("meat")[0]).to.equal("beef");
      expect(app.getCustomSlotValues("meat")[1]).to.equal("the other white meat");
      expect(app.getCustomSlotValues("meat")[2]).to.equal("pork");
    });
    it("verify that we are getting back mapped custom type values when calling the mapping function by name", function() {
      expect(app.mapDeliciousCritters(app.getCustomSlotValues("meat")[0])).to.equal("beef");
      expect(app.mapDeliciousCritters(app.getCustomSlotValues("meat")[1])).to.equal("the other white meat");
      expect(app.mapDeliciousCritters(app.getCustomSlotValues("meat")[2])).to.equal("the other white meat");
    });
  });
});
