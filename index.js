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
  app.customInputTypes = [];
  /**
  * Call addCustomInputType to add a fully specified custom type to this object.
  * @param {string} name - This is the name given to the custom type, such
  * as in the Alexa developer console, e.g. 'MYFRUITInput'
  * @param {object} type - This is the object describing the type. Example of
  * type object:
  * {
  *   // This is the name of the file to create when dumping type values
  *   // for later import into developer's console.
  *   // This is OPTIONAL - will default to lower case <type name>.txt, e.g.
  *   // myfruittype.txt
  *   fileName: 'fruits.txt',
  *   // This is the name that will be given to the generated function that can
  *   // be called to map custom values. This is OPTIONAL - will default to
  *   // map<type name> with the camel case, e.g.: mapMyfruittype
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
  app.addCustomInputType = function(name, type){
    if(typeof type == 'undefined' || typeof name == 'undefined'){
      return;
    }
    app.customInputTypes[name] = type;
    app[app.getMappingFunctionName(name)] = function(value){
      return app.mapCustomInputTypeValue(name, value);
    }
  }
  /**
  * Call to get the list of custom type.
  * @returns {array} - list of custom type names.
  */
  app.getCustomInputTypeNames = function(){
    var returnValues = [];
    for (var key in app.customInputTypes) {
      if (app.customInputTypes.hasOwnProperty(key)) {
        returnValues.push(key);
      }
    }
    return returnValues;
  }
  /**
  * Call to get the list of prompts for a custom type for a particular category.
  * If the category is not specified, "DEFAULT" category is used.
  * @param {string} typeName - Name of the type
  * @param {category} category - the prompt category for which to get the prompt.
  * @returns {array} - list of prompts.
  */
  app.getPrompts = function(typeName, category){
    var returnValues = [];
    if(typeof typeName =="undefined"){
      return returnValues
    }
    if(typeof category == 'undefined'){
      category = "DEFAULT";
    }
    var type = app.customInputTypes[typeName];
    if(typeof type == "undefined"){
      return returnValues;
    }
    var typeValues = type.values;
    for (var i = 0; i < typeValues.length; i++){
      var value = typeValues[i];
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
  * @param {string} - Name of the type for which to return the list of prompts.
  * @returns {array} - list of all the default prompts.
  */
  app.getDefaultPrompts = function(typeName){
    return app.getPrompts(typeName, "DEFAULT");
  }
  /**
  * Call getInputTypeDumpFileName to get the file name to be used for dumping (a.k.a.
  * exporting) the custom type values into.  This file can then be used to load
  * these values into developer console when defining interaction model for this
  * skill.
  * NOTE: this is currently not used yet.  To "dump" the values simply use
  * getCustomInputTypeValues() call and pipe it to a file.
  * @param {string} name - This is the custom type name for which we need the
  * filename.
  * @returns {string} - The file name
  */
  app.getInputTypeDumpFileName = function(name){
    if(typeof name == 'undefined' || typeof app.customInputTypes[name] == 'undefined'){
      return;
    }
    if(typeof app.customInputTypes[name].fileName == 'undefined'){
      return name.toLowerCase() + ".txt";
    }
    return app.customInputTypes[name].fileName;
  }
  /**
  * Call getCustomInputTypeValues to get array of the custom type values.
  * @param {string} name - This is the custom type name for which we want the
  * resulting array.
  * @returns {array} - Array of strings of the custom type values.
  */
  app.getCustomInputTypeValues = function(typeName){
    if(typeof typeName == 'undefined' || typeof app.customInputTypes[typeName] == 'undefined'){
      return;
    }
    var typeArray = app.customInputTypes[typeName].values;
    var returnArray = [];
    if(typeof typeArray == 'undefined'){
      return;
    }
    for(var i = 0; i < typeArray.length; i++){
      var typeValue = typeArray[i];
      if(typeof typeValue != 'undefined' && typeof typeValue.text != 'undefined'){
        returnArray.push(typeValue.text);
      }
    }
    return returnArray;
  }

  /**
  * Call getMappingFunctionName to get the name of the mapping function for the
  * custom type values.
  * @param {string} name - This is the custom type name for which we want the
  * mapping function name.
  * @returns {string} - The function name
  */
  app.getMappingFunctionName = function(name){
    if(typeof name == 'undefined' || typeof app.customInputTypes[name] == 'undefined'){
      return;
    }
    if(typeof app.customInputTypes[name].mappingFunctionName == 'undefined'){
      var scratch = name.substring(0, 1).toUpperCase();
      if(name.length > 1){
        scratch += name.substring(1);
      }
      return "map" + scratch;
    }
    return app.customInputTypes[name].mappingFunctionName;
  }

  /**
  * You should rarely be using mapCustomInputTypeValue as this is the "generic"
  * mapping function.  Since each custom type will result in having its own
  * mapping function added, those should be used instead of mapCustomInputTypeValue.
  * @param {string} typeName - This is the custom type name for which we want to
  * map a value
  * @param {string} value - This is the custom type value which we want to map.
  * @returns {string} - The mapped value.
  */
  app.mapCustomInputTypeValue = function(typeName, value){
    if(typeof typeName == 'undefined' || typeof app.customInputTypes[typeName] == 'undefined'){
      return;
    }

    var typeArray = app.customInputTypes[typeName].values;    var returnArray = [];
    if(typeof typeArray == 'undefined'){
      return;
    }
    for(var i = 0; i < typeArray.length; i++){
      var typeValue = typeArray[i];
      if(typeValue.text == value){
        if(typeof typeValue.mapTo != 'undefined'){
          return typeValue.mapTo;
        }
        else {
          return typeValue.text;
        }
      }
    }
    return;
  }
  /**
  * Call remapCustomInputTypeValue to change what a specific custom value maps to.
  * @param {string} typeName - The name of the custom type whose value is to be
  * remapped.
  * @param {string} value - The custom type value to be remapped.
  * @param {string} newMapping - The mapping that the value will be mapped to
  * when calling mapCustomInputValue or the type specific mapXXX function.  If
  * the new mapping is the same as the value then internally the old mapping is
  * erased.  The mapping functions will still return the new mapping since they
  * default to the value itself if there isn't a mapping.
  * @param {boolean} createIfDoesNotExist - if this value is present and set to
  * true and also if value is not found amongst the custom type values, then it
  * will be added together with the new mapping for it.
  */
  app.remapCustomInputTypeValue = function(typeName, value, newMapping, createIfDoesNotExist){
    if(typeof typeName == 'undefined' || typeof app.customInputTypes[typeName] == 'undefined'){
      return;
    }
    if(typeof value == 'undefined'){
      return;
    }

    var typeArray = app.customInputTypes[typeName].values;
    if(typeof typeArray == 'undefined'){
      return;
    }
    for(var i = 0; i < typeArray.length; i++){
      var typeValue = typeArray[i];
      if(typeValue.text == value){
        if(value == newMapping){
          typeValue.mapTo = undefined;
        }
        else {
          typeValue.mapTo = newMapping;
        }
        return;
      }
    }
    // If we are here that means we have not found value amongst the current
    // values.
    if(createIfDoesNotExist == true){
      typeArray.push({"text": value, "mapTo": newMapping});
    }
    return;
  }

  /**
  * Call remapCustomInputTypeMapping to change the mapping of all values that map to
  * oldMapping to newMapping instead.
  * @param {string} typeName - The name of the custom type whose values are to
  * be remapped.
  * @param {string} oldMapping - The mapping that will be changed to newMapping.
  * @param {string} newMapping - The mapping that will be returned when calling
  * mapCustomInputTypeValue or the type specific mapXXX function that currently return
  * oldMapping. If the new mapping is the same as the value then internally the
  * old mapping is erased.  The mapping functions will still return the new
  * mapping since they default to the value itself if there isn't a mapping.
  */
  app.remapCustomInputTypeMapping = function(typeName, oldMapping, newMapping){
    if(typeof typeName == 'undefined' || typeof app.customInputTypes[typeName] == 'undefined'){
      return;
    }
    if(typeof oldMapping == 'undefined'){
      return;
    }
    if(oldMapping == newMapping){
      // Nothing to do
      return;
    }

    var typeArray = app.customInputTypes[typeName].values;
    if(typeof typeArray == 'undefined'){
      return;
    }
    for(var i = 0; i < typeArray.length; i++){
      var typeValue = typeArray[i];
      if(typeValue.mapTo == oldMapping){
        if(typeValue.text == newMapping) {
          typeValue.mapTo = undefined;
        }
        else {
          typeValue.mapTo = newMapping;
        }
      }
      else if(typeValue.text == oldMapping && typeof typeValue.mapTo == 'undefined'){
        typeValue.mapTo = newMapping;
      }
    }
  }
};

module.exports = synonyms;
