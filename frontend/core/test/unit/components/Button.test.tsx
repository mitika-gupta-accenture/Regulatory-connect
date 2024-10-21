import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Button from "../../../components/Button";
 
describe("Button", () => {
  const name = "Click me";
  const text = "Click me";
  const href = "http://example.com";
  const className = "custom-class";
  const id = "custom-id";
 
  it("renders the correct name attribute", () => {
    const { getByRole } = render(<Button name={name} text={text} disabled={false} />);
    const button = getByRole('button');
    expect(button).toHaveAttribute('name', name);
  });
 
  it("applies the disabled attribute when disabled is true", () => {
    const { getByRole } = render(<Button name={name} text={text} disabled={true} />);
    const button = getByRole('button');
    expect(button).toBeDisabled();
  });
 
  it("does not apply the disabled attribute when disabled is false", () => {
    const { getByRole } = render(<Button name={name} text={text} disabled={false} />);
    const button = getByRole('button');
    expect(button).not.toBeDisabled();
  });
 
  it("applies the correct className", () => {
    const { getByRole } = render(<Button name={name} text={text} className={className} disabled={false} />);
    const button = getByRole('button');
    expect(button).toHaveClass(className);
  });
 
  it("applies the correct id attribute", () => {
    const { getByRole } = render(<Button name={name} text={text} id={id} disabled={false} />);
    const button = getByRole('button');
    expect(button).toHaveAttribute('id', id);
  });
 
  it("renders the isStartButton attribute correctly", () => {
    const { getByRole } = render(<Button name={name} text={text} isStartButton={true} disabled={false} />);
    const button = getByRole('button');
    expect(button).toHaveAttribute('data-module', 'govuk-button');
  });
});
 