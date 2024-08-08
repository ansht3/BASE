import * as d3 from "d3";

class Main {
  constructor() {}

  // Naive Approach
  static functionMap = {
    addTag: ({selection, tag, attributes, /*styles,*/ text}) => {
      const element = d3.selectAll(selection).append(tag);

      for (const attribute of attributes) {
        element.attr(attribute, attributes[attribute]);
      }

      // for (const style of styles) {
      //   element.style(style, styles[style]);
      // }

      if (text) {
        element.text(text);
      }
    },

    alterTag: ({selection, /*attributes, styles,*/ text}) => {
      const element = d3.selectAll(selection);

      // for (const attribute of attributes) {
      //   element.attr(attribute, attributes[attribute]);
      // }

      // for (const style of styles) {
      //   element.style(style, styles[style]);
      // }

      if (text) {
        element.text(text);
      }
    },

    deleteTag: ({selection}) => {
      d3.selectAll(selection).remove();
    }
  };

  // Elementwise
  /*
  static elementMap = {
    addDiv: ({selection, styles, text, id, _class}) => {
      const div = d3.selectAll(selection).append("div");

      for (const style of styles) {
        div.style(style, styles[style]);
      }

      if (text) {
        div.text(text);
      }

      if (id) {
        div.attr("id", id);
      }

      if (_class) {
        div.attr("class", _class);
      }
    },
  };
  */

  static functionDeclarations = [
    {
      name: "addTag",
      parameters: {
        type: "OBJECT",
        description: "Add an HTML element based on appending to a CSS selector, tag name, attributes, inline styles, and text",
        properties: {
          selection: {
            type: "STRING",
            description: "CSS selector to append element to. For single selection use id eg #name, group selection use class eg .name and for all tags use just name of tag eg div"
          },
          tag: {
            type: "STRING",
            description: "Name of HTML tag to append eg div"
          },
          attributes: {
            type: "ARRAY",
            description: "A list of JSON objects of tag attributes and their specified values eg '{ id: \"main\" }'",
            items: "STRING"
          },
          /*
          styles: {
            type: "ARRAY",
            description: "A list of JSON objects of tag styles and their specified values eg '{ color: \"red\" }'"
          },
          */
          text: {
            type: "STRING",
            description: "The text to be inserted into the newly generated tag"
          }
        },
        required: ["selection", "tag", "attributes", /*"styles",*/ "text"]
      }
    },
    {
      name: "alterTag",
      parameters: {
        type: "OBJECT",
        description: "Select HTML tag or tags based on a CSS selector, alter attributes, alter inline styles, and alter text",
        properties: {
          selection: {
            type: "STRING",
            description: "CSS selector to select elements to alter. For single selection use id eg #name, group selection use class eg .name and for all tags use just name of tag eg div"
          },
          tag: {
            type: "STRING",
            description: "Name of HTML tag to append eg div"
          },
          attributes: {
            type: "ARRAY",
            description: "A list of JSON object tag attributes and their specified values eg '{ id: \"main\" }'"
          },
          /*
          styles: {
            type: "ARRAY",
            description: "A list of JSON object tag styles and their specified values eg '{ color: \"red\" }'"
          },
          */
          text: {
            type: "STRING",
            description: "The text to replace the selected tag current text"
          }
        },
        required: ["selection", "tag", "attributes", /*"styles",*/ "text"]
      }
    },
    {
      name: "deleteTag",
      parameters: {
        type: "OBJECT",
        description: "Select HTML tag or tags based on a CSS selector to delete",
        properties: {
          selection: {
            type: "STRING",
            description: "CSS selector to select elements to delete. For single selection use id eg #name, group selection use class eg .name and for all tags use just name of tag eg div"
          }
        },
        required: ["selection"]
      }
    }
  ];

  static noFunction() {
    alert("Unable to Fulfill Request");
  }
}

export default Main;
