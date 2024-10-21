import scrollToMainContent from "../../../util/scrollToMainContent";

document.body.innerHTML = `<div id="main-content"></div>`;

HTMLElement.prototype.focus = jest.fn();

describe("scrollToMainContent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should focus on the main content div", () => {
    const div = document.getElementById("main-content");
    const setAttributeSpy = jest.spyOn(div, "setAttribute");
    const removeAttributeSpy = jest.spyOn(div, "removeAttribute");
    scrollToMainContent();
    expect(HTMLElement.prototype.focus).toHaveBeenCalled();

    expect(div).toBeInTheDocument();

    expect(setAttributeSpy).toHaveBeenCalledWith("tabindex", "-1");
    expect(removeAttributeSpy).toHaveBeenCalledWith("tabindex");
  });
  it("should do nothing if the main content div is not found", () => {
    document.getElementById("main-content").remove();

    scrollToMainContent();

    expect(HTMLElement.prototype.focus).not.toHaveBeenCalled();
  });
});
