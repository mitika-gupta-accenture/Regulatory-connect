import "@testing-library/jest-dom";
import { getRequiredComponents } from "../utils/getRequiredComponents";

describe("getRequiredComponents", () => {
  it("should return required components from JSON sections", () => {
    const JSONsections = [{
        name: "section",
        component: "sections",
        displayOrder: 1,
        children: [{
          name: "input",
          type: "input",
          displayOrder: 1
        }]
    }]

    const requiredComponents = getRequiredComponents(JSONsections)
    expect(requiredComponents).toEqual([{
      name: "input",
      type: "input",
      displayOrder: 1
    }])
  })

  it("should not return components that are optional", () => {
    const JSONsections = [{
        name: "section",
        component: "sections",
        displayOrder: 1,
        children: [{
          name: "input",
          type: "input",
          displayOrder: 1,
          required: false
        }]
    }]

    const requiredComponents = getRequiredComponents(JSONsections)
    expect(requiredComponents).toEqual([])
  })

  it("should add components nested within components", () => {
    const JSONsections = [{
        name: "section",
        component: "sections",
        displayOrder: 1,
        children: [{
          name: "radios",
          type: "radios",
          displayOrder: 1,
          options: [
            {
              title: "option 1",
              value: "option 1",
              children: [
                {
                  name: "checkboxes",
                  type: "checkboxes",
                  displayOrder: 1,
                  options: [
                    {
                      title: "option 1",
                      value: "option 1"
                    }
                  ]
                }
              ]
            }]               
        }]
    }]

    const requiredComponents = getRequiredComponents(JSONsections)
    expect(requiredComponents).toEqual([{
        name: "radios",
        type: "radios",
        displayOrder: 1,
        options: [
          {
            title: "option 1",
            value: "option 1",
            children: [
              {
                name: "checkboxes",
                type: "checkboxes",
                displayOrder: 1,
                options: [
                  {
                    title: "option 1",
                    value: "option 1"
                  }
                ]
              }
            ]
          }]               
    }, {
      name: "checkboxes",
      type: "checkboxes",
      displayOrder: 1,
      options: [
        {
          title: "option 1",
          value: "option 1"
        }
      ]
    }])
  })

  it("should not add a nested component if it is optional", () => {
    const JSONsections = [{
        name: "section",
        component: "sections",
        displayOrder: 1,
        children: [{
          name: "radios",
          type: "radios",
          displayOrder: 1,
          options: [
            {
              title: "option 1",
              value: "option 1",
              children: [
                {
                  name: "checkboxes",
                  type: "checkboxes",
                  displayOrder: 1,
                  required: false,
                  options: [
                    {
                      title: "option 1",
                      value: "option 1"
                    }
                  ]
                }
              ]
            }]               
        }]
    }]

    const requiredComponents = getRequiredComponents(JSONsections)
    expect(requiredComponents).toEqual([{
        name: "radios",
        type: "radios",
        displayOrder: 1,
        options: [
          {
            title: "option 1",
            value: "option 1",
            children: [
              {
                name: "checkboxes",
                type: "checkboxes",
                displayOrder: 1,
                required: false,
                options: [
                  {
                    title: "option 1",
                    value: "option 1"
                  }
                ]
              }
            ]
          }
        ]               
    }])
  })
});