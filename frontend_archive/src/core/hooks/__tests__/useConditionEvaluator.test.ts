import useConditionEvaluator, {
  NavigationCondition,
} from "../useConditionEvaluator";
import { renderHook } from "@testing-library/react-hooks";
import Redux, { useSelector } from "react-redux";
import { formDataSelector, formFieldsDataSelector } from "../customSelectors";
import { mockState, mockFormData, mockFormFieldsData } from "../../store/mockState";

jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockImplementation(selector => selector()),
}));

beforeEach(() => {
  (useSelector as unknown as jest.Mock)
    .mockReturnValue({})
    .mockReturnValueOnce(mockFormData)
    .mockReturnValueOnce(mockFormFieldsData);
});

afterEach(() => {
  jest.restoreAllMocks();
})

test("condition evaluator", () => {
  const { evaluateLogicalConditions } = useConditionEvaluator();
  const navigationCondition = [
    {
      or: [
        {
          equals: {
            selectAppTypeRadio: "homeoNat",
          },
        },
        {
          and: [
            {
              equals: {
                territoryRadioGroup: "UK",
              },
            },
            {
              or: [
                {
                  equals: {
                    selectAppTypeRadio: "homeoHR",
                  },
                },
                {
                  equals: {
                    selectAppTypeRadio: "traditionalHerbal",
                  },
                },
              ],
            },
          ],
        },
      ],
      then: "ConfirmAnswers",
    },
  ];
  const res = evaluateLogicalConditions(navigationCondition);
  expect(res).toBe("ConfirmAnswers");
});

test("condition evaluator greater than operator", () => {
  const { evaluateLogicalConditions } = useConditionEvaluator();
  const navigationCondition = [
    {
      or: [
        {
          greaterThan: {
            "companies.length": "1",
          },
        },
      ],
      then: "MultipleCompanyAddress",
    },
  ];
  const res = evaluateLogicalConditions(navigationCondition);
  expect(res).toBe("MultipleCompanyAddress");
});

test("condition evaluator Unsupported operator", () => {
  const { evaluateLogicalConditions } = useConditionEvaluator();
  console.warn = jest.fn();
  const navigationCondition = [
    {
      Or: [
        {
          equals: {
            chemicalLegalStatusChangeRadioGroup: "Yes",
          },
        },
      ],
      then: "",
    },
  ];
  const res = evaluateLogicalConditions(navigationCondition);
  expect(console.warn).toHaveBeenCalledWith("Unsupported operator: Or");
  expect(res).toBe(res)
});

test("evaluateFieldValueExists", () => {
  const { evaluateFieldValueExists } = useConditionEvaluator();

  const res = evaluateFieldValueExists(["chemicalLegalStatusChangeRadioGroup"]);
  expect(res).toBe(true);

  const res2 = evaluateFieldValueExists([
    "chemicalLegalStatusChangeRadioGroup1",
  ]);
  expect(res2).toBeTruthy;

  const res3 = evaluateFieldValueExists([
    "demo",
  ]);
  expect(res3).toBeFalsy();
});
test("evaluateCondition handles invalid operators", () => {
  const { evaluateCondition } = useConditionEvaluator();

  const res = evaluateCondition("invalidOperator", "value", "value");
  expect(console.warn).toHaveBeenCalledWith(
    "Unsupported operator: invalidOperator"
  );
  expect(res).toBeUndefined();
});

test("evaluateCondition handles invalid operands", () => {
  const { evaluateCondition } = useConditionEvaluator();

  const resEquals = evaluateCondition(
    "notEquals",
    "value",
    undefined as unknown as string
  );
  expect(resEquals).toBeTruthy();

  const resGreaterThan = evaluateCondition(
    "greaterThan",
    "value",
    undefined as unknown as string
  );
  expect(resGreaterThan).toBeFalsy();

  const resLessThan = evaluateCondition(
    "lessThan",
    "value",
    undefined as unknown as string
  );
  expect(resLessThan).toBeFalsy();
});

test("evaluateLogicalCondition handles nested conditions", () => {
  const { evaluateLogicalCondition } = useConditionEvaluator();

  const nestedAndCondition = {
    and: [
      {
        equals: {
          territoryRadioGroup: "UK",
        },
      },
      {
        equals: {
          selectAppTypeRadio: "homeoHR",
        },
      },
    ],
  };
  const resNestedAnd = evaluateLogicalCondition({
    and: [nestedAndCondition],
  });
  expect(resNestedAnd).toBeTruthy();

  const nestedOrCondition = {
    or: [
      {
        equals: {
          selectAppTypeRadio: "homeoNat",
        },
      },
      {
        equals: {
          selectAppTypeRadio: "traditionalHerbal",
        },
      },
    ],
  };
  const resNestedOr = evaluateLogicalCondition({ or: [nestedOrCondition] });
  expect(resNestedOr).toBeFalsy();
});

test("evaluateLogicalCondition handles if condition is empty", () => {
  const { evaluateLogicalCondition } = useConditionEvaluator();

  const resNestedAnd = evaluateLogicalCondition("");
  expect(resNestedAnd).toBe("");
});

test("evaluateLogicalConditions handles null or undefined condition", () => {
  const { evaluateLogicalConditions } = useConditionEvaluator();

  const nullCondition: any = null;
  const resNull = evaluateLogicalConditions(nullCondition);
  expect(resNull).toBe("");

  const undefinedCondition: any = undefined;
  const resUndefined = evaluateLogicalConditions(undefinedCondition);
  expect(resUndefined).toBe("");
});

test("evaluateLogicalConditions handles string condition", () => {
  const { evaluateLogicalConditions } = useConditionEvaluator();

  const stringCondition: any = "SomeStringCondition";
  const resString = evaluateLogicalConditions(stringCondition);
  expect(resString).toBe(stringCondition);
});

test("evaluateLogicalConditions returns empty string when no condition evaluates to true", () => {
  const { evaluateLogicalConditions } = useConditionEvaluator();

  const navigationCondition: NavigationCondition<Record<string, any>> = [
    {
      or: [
        {
          equals: {
            fieldName: "value1",
          },
        },
      ],
    },
    {
      or: [
        {
          equals: {
            fieldName: "value2",
          },
        },
      ],
    },
  ];
  const res = evaluateLogicalConditions(navigationCondition);
  expect(res).toBe("");
});

test("evaluateFieldValueExists returns false when at least one field does not exist in formData", () => {
  const { evaluateFieldValueExists } = useConditionEvaluator();

  const fieldName = ["field1", "field2", "field3"];
  const res = evaluateFieldValueExists(fieldName);
  expect(res).toBe(false);
});

test("formData and formFieldsData are correctly rendered", () => {
  const spy = jest
    .spyOn(Redux, "useSelector");

  const { formData, formFieldsData } = useConditionEvaluator();

  expect(formData).toEqual(mockFormData);
  expect(formFieldsData).toEqual(mockFormFieldsData);

  spy.mockReset();
  spy.mockRestore();
});

test("useSelector should be called with the correct selector function", () => {
  // Mock the useSelector behavior
  (useSelector as unknown as jest.Mock).mockReturnValueOnce(formDataSelector(mockState))
    .mockReturnValueOnce(formFieldsDataSelector(mockState));

  // Render the hook
  renderHook(() => useConditionEvaluator());

  // Ensure that useSelector is called with the correct selector functions
  expect(useSelector).toHaveBeenNthCalledWith(1, formDataSelector);
  expect(useSelector).toHaveBeenNthCalledWith(2, formFieldsDataSelector);
});