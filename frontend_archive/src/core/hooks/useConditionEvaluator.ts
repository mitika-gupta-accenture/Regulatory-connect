import { useSelector } from "react-redux";
import { formDataSelector, formFieldsDataSelector } from "./customSelectors";

type ComparisonCondition<T extends { [key: string]: string }> = {
  equals?: T;
  notEquals?: T;
  greaterThan?: T;
  lessThan?: T;
};

export type NavigationCondition<T extends Record<string, any>> = Array<{
  or?: Array<ComparisonCondition<T>>;
  and?: Array<ComparisonCondition<T>>;
  then?: string | Record<string, any>[];
}>;

const useConditionEvaluator = () => {
  const formData = useSelector(formDataSelector);

  const formFieldsData = useSelector(formFieldsDataSelector);

  const evaluateCondition = (
    operator: string,
    leftOperand: string,
    rightOperand: string
  ) => {
    switch (operator) {
      case "equals":
        return leftOperand === rightOperand;
      case "notEquals":
        return leftOperand !== rightOperand;
      case "greaterThan":
        return leftOperand > rightOperand;
      case "lessThan":
        return leftOperand < rightOperand;
      default:
        console.warn(`Unsupported operator: ${operator}`);
    }
  };

  const evaluateLogicalCondition: any = (
    condition: ComparisonCondition<Record<string, any>>
  ) => {
    if (!condition) {
      return "";
    }

    const firstOperator = Object.keys(condition)[0];
    const firstOperatorContent =
      condition[
      firstOperator as keyof ComparisonCondition<Record<string, any>>
      ]!;
    switch (firstOperator) {
      case "or":
        return firstOperatorContent.some((value: object) =>
          evaluateLogicalCondition(value)
        );
      case "and":
        return firstOperatorContent.every((value: object) =>
          evaluateLogicalCondition(value)
        );
      case "greaterThan":
      case "lessThan":
      case "equals":
      case "notEquals":
        const fieldName: any = Object.keys(firstOperatorContent)[0];
        const leftOperand = formData[fieldName]
          ? formData[fieldName]
          : formFieldsData[fieldName.split(".")[0]];
        const rightOperand: any = firstOperatorContent[fieldName];
        return evaluateCondition(firstOperator, leftOperand, rightOperand);
      default:
        console.warn(`Unsupported operator: ${firstOperator}`);
        return condition;
    }
  };

  const evaluateLogicalConditions = (
    conditions: NavigationCondition<Record<string, any>>,
    fieldName?: string,
    value?: string
  ) => {
    let result: any;

    if (!conditions) {
      return result;
    }

    if (typeof conditions === "string") {
      return conditions;
    }

    conditions.some((condition) => {
      const conditionOperator = Object.keys(
        condition
      )[0] as keyof typeof condition;
      const conditionOperatorContent = condition[conditionOperator]!;   
      const evaluationResult = evaluateLogicalCondition({
        [conditionOperator]: conditionOperatorContent,
      });
      if (evaluationResult) {
        result = condition.then ? condition.then : evaluationResult;
        return result; // Break the loop if the condition is true
      }
      return false; // Continue the loop if the condition is false
    });
    
    return result;
  };

  const evaluateFieldValueExists = (fieldName: string[]) => {
    for (const field of fieldName) {
      if (!formData[field]) {
        if (field.match(/\d/g) && formData[field.replace(/\d/g, "")]) {
          return field;
        } else {
          return false;
        }
      }
    }
    return true;
  };

  return {
    evaluateLogicalConditions,
    evaluateLogicalCondition,
    evaluateFieldValueExists,
    evaluateCondition,
    formData,
    formFieldsData,
  };
};

export default useConditionEvaluator;