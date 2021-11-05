beforeEach(() => {
  cy.request("http://localhost:8001/api/debug/reset");
})

describe("Appointments", () => {
  it("should book an interview", () => {
    cy.visit("/");

    cy.wait(500);

    cy.get(".appointment__add-button")
      .first()
      .click();

    cy.get("input")
      .should("have.class", "appointment__create-input")
      .type("John Doe");

    cy.get(".interviewers > ul li:first-child img")
      .should("have.class", "interviewers__item-image")
      .click();

    cy.get("button")
      .contains("Save")
      .click();

    cy.wait(1000);

    cy.get(".appointment main h2")
      .contains("John Doe");
  });

  it("should edit an interview", () => {
    cy.visit("/");

    cy.wait(500);

    cy.get(".appointment__actions-button")
      .first()
      .should("be.hidden")
      .invoke("show")
      .click();

    cy.get("input")
      .should("have.class", "appointment__create-input")
      .clear()
      .type("Jane Doe");

    cy.get(".interviewers > ul li:nth-child(2) img")
      .should("have.class", "interviewers__item-image")
      .click();

    cy.get("button")
      .contains("Save")
      .click();

    cy.wait(1000);

    cy.get(".appointment main h2")
      .contains("Jane Doe");
  });

  it("should cancel an interview", () => {
    cy.visit("/");

    cy.wait(500);

    cy.get(".appointment__actions-button")
      .next()
      .should("be.hidden")
      .invoke("show")
      .click();

    cy.get("button")
      .contains("Confirm")
      .click();

    cy.wait(1000);

    cy.get(".appointment main")
      .first()
      .should("have.class", "appointment__add");
  });
});