'use server';

//returns array of all answers that identifiers match the target
const searchAnswers = (allAnswers, target) => {
  //check if target has multiple depths considering it has to retrirve from specific location
  if (target.includes('.')) {
    const targetIds = target.split('.');
    let targetData = allAnswers.filter(item => item[`${targetIds[0]}`])[0];
    for (const key of targetIds) {
      targetData = targetData[key];
    }
    return [targetData];
  }
  //check if target is directly accessible considering it is required to refer from API/CMS response
  const targetData = allAnswers.filter(item => item[target])[0];
  if (targetData) {
    return targetData[target];
  }

  //gets index of allAnswers that contains answers that match target
  const answerIndex = allAnswers
    .filter(ans => ans.answers?.length > 0)
    .findIndex(
      answer =>
        answer?.answers?.findIndex(value => value.identifier === target) !== -1,
    );
  let allMatchingAnswers = [];

  if (answerIndex !== -1) {
    //gets indexes of all answers within allAnswers that match target
    const allAns = allAnswers.filter(ans => ans.answers?.length > 0);
    allAns[answerIndex].answers.map(value => {
      if (value.identifier === target) {
        !value.code
          ? allMatchingAnswers.push(value.answer)
          : allMatchingAnswers.push(value.code);
      }
    });

    //returns answer that matches target id
    if (allMatchingAnswers.length) {
      return allMatchingAnswers;
    }
  }
  return undefined;
};

const evaluateCondition = (operator, leftOperands, rightOperand) => {
  return leftOperands?.some(leftOperand => {
    switch (operator) {
      case 'equals':
        return leftOperand === rightOperand;
      case 'notEquals':
        return leftOperand !== rightOperand;
      case 'greaterThen':
        return leftOperands.length > rightOperand;
      case 'lessThen':
        return leftOperands.length < rightOperand;
      case 'default':
        return rightOperand;
      default:
        console.error(`Unsupported operator: ${operator}`);
    }
  });
};

const showQuestion = (condition, answers) => {
  if (!condition) {
    return undefined;
  }

  const firstOperator = Object.keys(condition)[0];
  const firstOperatorContent = condition[Object.keys(condition)[0]];

  switch (firstOperator) {
    case 'or':
      return firstOperatorContent.some(value => showQuestion(value, answers));
    case 'and':
      return firstOperatorContent.every(value => showQuestion(value, answers));
    case 'greaterThen':
    case 'lessThen':
    case 'equals':
    case 'notEquals': {
      const leftOperands = searchAnswers(
        answers,
        Object.keys(firstOperatorContent)[0],
      );
      const rightOperand =
        firstOperatorContent[Object.keys(firstOperatorContent)[0]];
      return (
        evaluateCondition(firstOperator, leftOperands, rightOperand) || false
      );
    }
    default:
      //checks if default route is present
      if (condition === 'default') {
        return firstOperator;
      }
      console.error(`Unsupported operator: ${firstOperator}`);
  }
};

export const determineRoute = async (conditions, answers) => {
  let nextRoute = [];
  conditions.some(condition => {
    const route = Object.keys(condition)[0];
    const routeCondition = condition[route];
    if (showQuestion(routeCondition, answers)) {
      nextRoute.push(route);
    }
  });

  if (nextRoute[0]) {
    return nextRoute[0];
  } else {
    console.error('Invalid route');
  }
};
