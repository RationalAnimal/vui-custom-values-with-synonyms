/*
@author Ilya Shubentsov

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
'use strict'
var synonyms = {};

/**
 * Call this function to add vui-custom-values-with-synonyms functionality to
 * any object.  This is really meant to be used on objects such as app from
 * alexa-app npm module.
 * @param {object} app - The object to which the functionality should be added.
 */
synonyms.addSynonymsToApp = function(app){
  app.customSlots = [];
  /**
  * Call addCustomSlot to add a fully specified custom type/slot to this object.
  * @param {string} name - This is the name given to the custom type/slot, such
  * as in the Alexa developer console, e.g. 'MYFRUITSLOT'
  * @param {object} slot - This is the object describing the type/slot. Example of
  * type/slot object:
  * {
  *   // This is the name of the file to create when dumping type/slots values
  *   // for later import into developer's console.
  *   // This is OPTIONAL - will default to lower case <slot name>.txt, e.g.
  *   // myfruitslot.txt
  *   fileName: 'fruits.txt',
  *   // This is the name that will be given to the generated function that can
  *   // be called to map custom values. This is OPTIONAL - will default to
  *   // map<slot name> with the camel case, e.g.: mapMyfruitslot
  *   mappingFunctionName: 'mapFruit',
  *
  *   values: [
  *     {
  *       text: "apple",
  *       prompts: [
  *         {
  *          categories: ["DEFAULT", "desert"],
  *          text: "apple"
  *         }
  *       ]
  *     },
  *     {
  *       text: "golden delicious",
  *       mapTo: "apple",
  *       prompts: [
  *         {
  *          categories: ["apple variety"],
  *          text: "golden delicious apple"
  *         }
  *       ]
  *     },
  *     {
  *       text: "granny smith",
  *       mapTo: "apple",
  *       prompts: [
  *         {
  *          categories: ["apple variety"],
  *          text: "granny smith apple"
  *         }
  *       ]
  *     },
  *     {
  *       text: "banana",
  *       prompts: [
  *         {
  *          categories: ["DEFAULT", "desert"],
  *          text: "banana"
  *         }
  *       ]
  *     }
  *   ]
  * }
  */
  app.addCustomSlot = function(name, slot){
    if(typeof slot == 'undefined' || typeof name == 'undefined'){
      return;
    }
    app.customSlots[name] = slot;
    app[app.getMappingFunctionName(name)] = function(value){
      return app.mapCustomSlotValue(name, value);
    }
  }
  /**
  * Call to get the list of custom slots.
  * @returns {array} - list of custom slot names.
  */
  app.getCustomSlotNames = function(){
    var returnValues = [];
    for (var key in app.customSlots) {
      if (app.customSlots.hasOwnProperty(key)) {
        returnValues.push(key);
      }
    }
    return returnValues;
  }
  /**
  * Call to get the list of prompts for a slot for a particular category.
  * If the category is not specified, "DEFAULT" category is used.
  * @param {string} slotName - Name of the slot
  * @param {category} category - the prompt category for which to get the prompt.
  * @returns {array} - list of prompts.
  */
  app.getPrompts = function(slotName, category){
    var returnValues = [];
    if(typeof slotName =="undefined"){
      return returnValues
    }
    if(typeof category == 'undefined'){
      category = "DEFAULT";
    }
    var slot = app.customSlots[slotName];
    if(typeof slot == "undefined"){
      return returnValues;
    }
    var slotValues = slot.values;
    for (var i = 0; i < slotValues.length; i++){
      var value = slotValues[i];
      if(typeof value.prompts == 'undefined'){
        continue;
      }
      for(var j = 0; j < value.prompts.length; j++){
        var prompt = value.prompts[j];
        if(prompt.categories.indexOf(category) >= 0){
          if(returnValues.indexOf(prompt.text) < 0){
            returnValues.push(prompt.text);
          }
        }
      }
    }
    return returnValues
  }
  /**
  * This is equivalent to calling the getPrompts without the category argument.
  * @param {string} - Name of the slot for which to return the list of prompts.
  * @returns {array} - list of all the default prompts.
  */
  app.getDefaultPrompts = function(slotName){
    return app.getPrompts(slotName, "DEFAULT");
  }
  /**
  * Call getSlotDumpFileName to get the file name to be used for dumping (a.k.a.
  * exporting) the custom type/slot values into.  This file can then be used to load
  * these values into developer console when defining interaction model for this
  * skill.
  * NOTE: this is currently not used yet.  To "dump" the values simply use
  * getCustomSlotValues() call and pipe it to a file.
  * @param {string} name - This is the custom type/slot name for which we need the
  * filename.
  * @returns {string} - The file name
  */
  app.getSlotDumpFileName = function(name){
    if(typeof name == 'undefined' || typeof app.customSlots[name] == 'undefined'){
      return;
    }
    if(typeof app.customSlots[name].fileName == 'undefined'){
      return name.toLowerCase() + ".txt";
    }
    return app.customSlots[name].fileName;
  }
  /**
  * Call getCustomSlotValues to get array of the custom type/slot values.
  * @param {string} name - This is the custom type/slot name for which we want the
  * resulting array.
  * @returns {array} - Array of strings of the custom type/slot values.
  */
  app.getCustomSlotValues = function(slotName){
    if(typeof slotName == 'undefined' || typeof app.customSlots[slotName] == 'undefined'){
      return;
    }
    var slotArray = app.customSlots[slotName].values;
    var returnArray = [];
    if(typeof slotArray == 'undefined'){
      return;
    }
    for(var i = 0; i < slotArray.length; i++){
      var slotValue = slotArray[i];
      if(typeof slotValue != 'undefined' && typeof slotValue.text != 'undefined'){
        returnArray.push(slotValue.text);
      }
    }
    return returnArray;
  }

  /**
  * Call getMappingFunctionName to get the name of the mapping function for the
  * custom type/slot values.
  * @param {string} name - This is the custom type/slot name for which we want the
  * mapping function name.
  * @returns {string} - The function name
  */
  app.getMappingFunctionName = function(name){
    if(typeof name == 'undefined' || typeof app.customSlots[name] == 'undefined'){
      return;
    }
    if(typeof app.customSlots[name].mappingFunctionName == 'undefined'){
      var scratch = name.substring(0, 1).toUpperCase();
      if(name.length > 1){
        scratch += name.substring(1);
      }
      return "map" + scratch;
    }
    return app.customSlots[name].mappingFunctionName;
  }

  /**
  * You should rarely be using mapCustomSlotValue as this is the "generic"
  * mapping function.  Since each custom type/slot will result in having its own
  * mapping function added, those should be used instead of mapCustomSlotValue.
  * @param {string} slotName - This is the custom type/slot name for which we want to
  * map a value
  * @param {string} value - This is the custom type/slot value which we want to map.
  * @returns {string} - The mapped value.
  */
  app.mapCustomSlotValue = function(slotName, value){
    if(typeof slotName == 'undefined' || typeof app.customSlots[slotName] == 'undefined'){
      return;
    }

    var slotArray = app.customSlots[slotName].values;    var returnArray = [];
    if(typeof slotArray == 'undefined'){
      return;
    }
    for(var i = 0; i < slotArray.length; i++){
      var slotValue = slotArray[i];
      if(slotValue.text == value){
        if(typeof slotValue.mapTo != 'undefined'){
          return slotValue.mapTo;
        }
        else {
          return slotValue.text;
        }
      }
    }
    return;
  }
  /**
  * Call remapCustomSlotValue to change what a specific custom value maps to.
  * @param {string} slotName - The name of the custom type/slot whose value is to be
  * remapped.
  * @param {string} value - The custom type/slot value to be remapped.
  * @param {string} newMapping - The mapping that the value will be mapped to
  * when calling mapCustomSlotValue or the type/slot specific mapXXX function.  If
  * the new mapping is the same as the value then internally the old mapping is
  * erased.  The mapping functions will still return the new mapping since they
  * default to the value itself if there isn't a mapping.
  * @param {boolean} createIfDoesNotExist - if this value is present and set to
  * true and also if value is not found amongst the custom type/slot values, then it
  * will be added together with the new mapping for it.
  */
  app.remapCustomSlotValue = function(slotName, value, newMapping, createIfDoesNotExist){
    if(typeof slotName == 'undefined' || typeof app.customSlots[slotName] == 'undefined'){
      return;
    }
    if(typeof value == 'undefined'){
      return;
    }

    var slotArray = app.customSlots[slotName].values;
    if(typeof slotArray == 'undefined'){
      return;
    }
    for(var i = 0; i < slotArray.length; i++){
      var slotValue = slotArray[i];
      if(slotValue.text == value){
        if(value == newMapping){
          slotValue.mapTo = undefined;
        }
        else {
          slotValue.mapTo = newMapping;
        }
        return;
      }
    }
    // If we are here that means we have not found value amongst the current
    // values.
    if(createIfDoesNotExist == true){
      slotArray.push({"text": value, "mapTo": newMapping});
    }
    return;
  }

  /**
  * Call remapCustomSlotMapping to change the mapping of all values that map to
  * oldMapping to newMapping instead.
  * @param {string} slotName - The name of the custom type/slot whose values are to
  * be remapped.
  * @param {string} oldMapping - The mapping that will be changed to newMapping.
  * @param {string} newMapping - The mapping that will be returned when calling
  * mapCustomSlotValue or the type/slot specific mapXXX function that currently return
  * oldMapping. If the new mapping is the same as the value then internally the
  * old mapping is erased.  The mapping functions will still return the new
  * mapping since they default to the value itself if there isn't a mapping.
  */
  app.remapCustomSlotMapping = function(slotName, oldMapping, newMapping){
    if(typeof slotName == 'undefined' || typeof app.customSlots[slotName] == 'undefined'){
      return;
    }
    if(typeof oldMapping == 'undefined'){
      return;
    }
    if(oldMapping == newMapping){
      // Nothing to do
      return;
    }

    var slotArray = app.customSlots[slotName].values;
    if(typeof slotArray == 'undefined'){
      return;
    }
    for(var i = 0; i < slotArray.length; i++){
      var slotValue = slotArray[i];
      if(slotValue.mapTo == oldMapping){
        if(slotValue.text == newMapping) {
          slotValue.mapTo = undefined;
        }
        else {
          slotValue.mapTo = newMapping;
        }
      }
      else if(slotValue.text == oldMapping && typeof slotValue.mapTo == 'undefined'){
        slotValue.mapTo = newMapping;
      }
    }
  }
};

module.exports = synonyms;
