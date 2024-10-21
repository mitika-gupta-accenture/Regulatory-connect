import { getColumnClassName } from "../renderUtils";

describe('renderUtils', () => {
  it("returns class names of 'full', when the layout value is 'full'", () => {
    const sectionContent = {layout: 'full'}
    const { oddColumnClassName, evenColumnClassName} = getColumnClassName(sectionContent.layout)
    
    expect(oddColumnClassName).toBe('full')
    expect(evenColumnClassName).toBe('full')
  });

  it("returns class names of 'one-half', when the layout value is 'one-half'", () => {
    const sectionContent = {layout: 'one-half'}
    const { oddColumnClassName, evenColumnClassName} = getColumnClassName(sectionContent.layout)
    
    expect(oddColumnClassName).toBe('one-half')
    expect(evenColumnClassName).toBe('one-half')
  });

  it("returns class names of 'one-third', when the layout value is 'one-third'", () => {
    const sectionContent = {layout: 'one-third'}
    const { oddColumnClassName, evenColumnClassName} = getColumnClassName(sectionContent.layout)
    
    expect(oddColumnClassName).toBe('one-third')
    expect(evenColumnClassName).toBe('one-third')
  });

  it("returns class names of 'one-third' and 'two-thirds', when the layout value is 'one-third-mixed'", () => {
    const sectionContent = {layout: 'one-third-mixed'}
    const { oddColumnClassName, evenColumnClassName} = getColumnClassName(sectionContent.layout)
    
    expect(oddColumnClassName).toBe('one-third')
    expect(evenColumnClassName).toBe('two-thirds')
  });

  it("returns class names of 'two-thirds', when the layout value is 'two-thirds'", () => {
    const sectionContent = {layout: 'two-thirds'}
    const { oddColumnClassName, evenColumnClassName} = getColumnClassName(sectionContent.layout)
    
    expect(oddColumnClassName).toBe('two-thirds')
    expect(evenColumnClassName).toBe('two-thirds')
  });

  it("returns class names of 'two-thirds' and 'one-third', when the layout value is 'two-thirds-mixed'", () => {
    const sectionContent = {layout: 'two-thirds-mixed'}
    const { oddColumnClassName, evenColumnClassName} = getColumnClassName(sectionContent.layout)
    
    expect(oddColumnClassName).toBe('two-thirds')
    expect(evenColumnClassName).toBe('one-third')
  });

  it("returns class names of 'one-quarter', when the layout value is 'one-quarter'", () => {
    const sectionContent = {layout: 'one-quarter'}
    const { oddColumnClassName, evenColumnClassName} = getColumnClassName(sectionContent.layout)
    
    expect(oddColumnClassName).toBe('one-quarter')
    expect(evenColumnClassName).toBe('one-quarter')
  });

  it("returns class names of 'one-quarter' and 'three-quarters', when the layout value is 'one-quarter-mixed'", () => {
    const sectionContent = {layout: 'one-quarter-mixed'}
    const { oddColumnClassName, evenColumnClassName} = getColumnClassName(sectionContent.layout)
    
    expect(oddColumnClassName).toBe('one-quarter')
    expect(evenColumnClassName).toBe('three-quarters')
  });

  it("returns class names of 'three-quarters', when the layout value is 'three-quarters'", () => {
    const sectionContent = {layout: 'three-quarters'}
    const { oddColumnClassName, evenColumnClassName} = getColumnClassName(sectionContent.layout)
    
    expect(oddColumnClassName).toBe('three-quarters')
    expect(evenColumnClassName).toBe('three-quarters')
  });

  it("returns class names of 'three-quarters' amd 'one-quarter', when the layout value is 'three-quarters-mixed'", () => {
    const sectionContent = {layout: 'three-quarters-mixed'}
    const { oddColumnClassName, evenColumnClassName} = getColumnClassName(sectionContent.layout)
    
    expect(oddColumnClassName).toBe('three-quarters')
    expect(evenColumnClassName).toBe('one-quarter')
  });
  
  it("returns class names of 'full', when the layout value is undefined", () => {
    const sectionContent = {layout: undefined}
    const { oddColumnClassName, evenColumnClassName} = getColumnClassName(sectionContent.layout)
  
    expect(oddColumnClassName).toBe('full')
    expect(evenColumnClassName).toBe('full')
  });
});
