import * as d3 from "d3";

class Main {
  constructor() {}

  static counter = 0;

  static functionMap = {
    addTag: ({ selection, tag, attributes, styles, text }) => {
      const element = d3.selectAll(selection).append(tag);

      for (const attribute of attributes) {
        element.attr(attribute.name, attribute.value);
      }

      for (const style of styles) {
        element.style(style.name, style.value);
      }

      if (text) {
        element.text(text);
      }
      Main.counter++;
    },

    onHover: ({ selection, styles }) => {
      const element = d3.selectAll(selection);

      const oldStyles = [];
      for (const style of styles) {
        oldStyles.push([style.name, element.style(style.name)]);
      }

      element.on("mouseover", () => {
        for (const style of styles) {
          element.style(style.name, style.value);
        }
      });

      element.on("mouseout", () => {
        for (const style of oldStyles) {
          element.style(style[0], style[1]);
        }
      });
    },

    alterText: ({ selection, text }) => {
      const element = d3.selectAll(selection);

      if (text) {
        element.text(text);
      }
    },

    alterAttribute: ({ selection, attributes }) => {
      const element = d3.selectAll(selection);

      for (const attribute of attributes) {
        element.attr(attribute.name, attribute.value);
      }
    },

    alterStyle: ({ selection, styles }) => {
      const element = d3.selectAll(selection);

      for (const style of styles) {
        element.style(style.name, style.value);
      }
    },

    deleteTag: ({ selection }) => {
      d3.selectAll(selection).filter(":not(.main)").remove();
    },
  };

  static functionDeclarations = [
    {
      name: "addTag",
      parameters: {
        type: "object",
        description:
          "Add an HTML element based on appending to a CSS selector, tag name, attributes, inline styles, and text",
        properties: {
          selection: {
            type: "string",
            description:
              "CSS selector to append element to. For single selection use id eg #name, group selection use class eg .name and for all tags use just name of tag eg div. If none is specified, default to body",
          },
          tag: {
            type: "string",
            description: "Name of HTML tag to append eg div",
          },
          attributes: {
            type: "array",
            description:
              "Array of objects for HTML tag attributes and their specified values",
            items: {
              description:
                "Object specifying an HTML tag attribute and its value eg {name: 'id', value: 'one'}",
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Name of the HTML attribute eg id",
                },
                value: {
                  type: "string",
                  description: "Value of the corresponding HTML attribute",
                },
              },
            },
          },
          styles: {
            type: "array",
            description:
              "Array of objects for HTML tag styles and their specified values",
            items: {
              description:
                "Object specifying a CSS style name and its value eg {name: 'color', value: 'red'}",
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Name of the CSS style eg color",
                },
                value: {
                  type: "string",
                  description: "Value of the corresponding CSS style",
                },
              },
            },
          },
          text: {
            type: "string",
            description: "The text to be inserted into the newly generated tag",
          },
        },
        required: ["selection", "tag", "attributes", "styles", "text"],
      },
    },
    {
      name: "onHover",
      parameters: {
        type: "object",
        description:
          "Select HTML tag or tags based on a CSS selector and add hover styling",
        properties: {
          selection: {
            type: "string",
            description:
              "CSS selection to select elements to add hover styling. For single selection use id eg #name, group selection use class eg .name and for all tags use name of tag eg div",
          },
          styles: {
            type: "array",
            description:
              "Array of objects for HTML tag styles and their specified values",
            items: {
              description:
                "Object specifying a CSS style name and its value eg {name: 'color', value: 'red'}",
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Name of the CSS style eg color",
                },
                value: {
                  type: "string",
                  description: "Value of the corresponding CSS style",
                },
              },
            },
          },
        },
        required: ["selection", "styles"],
      },
    },
    {
      name: "alterText",
      parameters: {
        type: "object",
        description:
          "Select HTML tag or tags based on a CSS selector and alter text",
        properties: {
          selection: {
            type: "string",
            description:
              "CSS selector to select elements to alter. For single selection use id eg #name, group selection use class eg .name and for all tags use name of tag eg div",
          },
          text: {
            type: "string",
            description: "The text to replace the selected tag current text",
          },
        },
        required: ["selection", "text"],
      },
    },
    {
      name: "alterAttribute",
      parameters: {
        type: "object",
        description:
          "Select HTML tag or tags based on CSS selector to alter attributes",
        properties: {
          selection: {
            type: "string",
            description:
              "CSS selector to select elements to alter. For single selection use id eg #name, group selection use class eg .name and for all tags use the name of tag eg div",
          },
          attributes: {
            type: "array",
            description:
              "A list objects for HTML tag attributes and their specified values",
            items: {
              description:
                "object specifying an HTML tag attribute and its value eg {name: 'id', value: 'one'}",
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "name of the HTML attribute eg id",
                },
                value: {
                  type: "string",
                  description: "value of the corresponding HTML attribute",
                },
              },
            },
          },
        },
        required: ["selection", "attributes"],
      },
    },
    {
      name: "alterStyle",
      parameters: {
        type: "object",
        description:
          "Select HTML tag or tags based on a CSS selector to alter styles",
        properties: {
          selection: {
            type: "string",
            description:
              "CSS selector to select elements to alter. For single selection use id eg #name, group selection use class eg .name and for all tags use name of tag eg div",
          },
          styles: {
            type: "array",
            description:
              "Array of objects for HTML tag styles and their specified values",
            items: {
              description:
                "Object specifying a CSS style name and its value eg {name: 'color', value: 'red'}",
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Name of the CSS style eg color",
                },
                value: {
                  type: "string",
                  description: "Value of the corresponding CSS style",
                },
              },
            },
          },
        },
        required: ["selection", "styles"],
      },
    },
    {
      name: "deleteTag",
      parameters: {
        type: "object",
        description:
          "Select HTML tag or tags based on a CSS selector to delete",
        properties: {
          selection: {
            type: "string",
            description:
              "CSS selector to select elements to delete. For single selection use id eg #name, group selection use class eg .name and for all tags use name of tag eg div",
          },
        },
        required: ["selection"],
      },
    },
  ];

  static noFunction() {
    alert("Unable to Fulfill Request");
  }
}

export default Main;
