const mockQuestions = [
  {
    number: 0,
    type: "radio",
    question: "What is the scope of your application?",
    identifier: "q0",
    sectionName: "section1",
    radios: {
      "National (any other case including hybrid applications)": {
        name: "What is the scope of your application?",
        value: "National (any other case including hybrid applications)",
        id: "National (any other case including hybrid applications)",
      },
      "MRDC reliance procedure - Application for GB or UK excluding GB unfettered access route":
        {
          name: "What is the scope of your application?",
          value:
            "MRDC reliance procedure - Application for GB or UK excluding GB unfettered access route",
          id: "MRDC reliance procedure - Application for GB or UK excluding GB unfettered access route",
        },
      "EC Decision reliance procedure - Automatic recognition application": {
        name: "What is the scope of your application?",
        value:
          "EC Decision reliance procedure - Automatic recognition application",
        id: "EC Decision reliance procedure - Automatic recognition application",
      },
      "Unfettered access route to GB (Previously granted by EU)": {
        name: "What is the scope of your application?",
        value: "Unfettered access route to GB (Previously granted by EU)",
        id: "Unfettered access route to GB (Previously granted by EU)",
      },
      "Incoming mutual recognition procedure for sale or supply in Northern Ireland and Unfettered access route for UKMA(GB)":
        {
          name: "What is the scope of your application?",
          value:
            "Incoming mutual recognition procedure for sale or supply in Northern Ireland and Unfettered access route for UKMA(GB)",
          id: "Incoming mutual recognition procedure for sale or supply in Northern Ireland and Unfettered access route for UKMA(GB)",
        },
      "Decentralised procedure for sale or supply in Northern Ireland and Unfettered access route for UKMA(GB)":
        {
          name: "What is the scope of your application?",
          value:
            "Decentralised procedure for sale or supply in Northern Ireland and Unfettered access route for UKMA(GB)",
          id: "Decentralised procedure for sale or supply in Northern Ireland and Unfettered access route for UKMA(GB)",
        },
      "European reference product application for sale or supply in Northern Ireland":
        {
          name: "What is the scope of your application?",
          value:
            "European reference product application for sale or supply in Northern Ireland",
          id: "European reference product application for sale or supply in Northern Ireland",
        },
    },
    summary: [
      {
        key: "Which does your application concern?",
        value: "Variations: license fee application",
      },
      {
        key: "What is the scope of your application?",
        value: "National",
      },
    ],
    routes: {
      "National (any other case including hybrid applications)": 1,
      "MRDC reliance procedure - Application for GB or UK excluding GB unfettered access route": 1,
      "EC Decision reliance procedure - Automatic recognition application": 1,
      "Unfettered access route to GB (Previously granted by EU)": 1,
      "Incoming mutual recognition procedure for sale or supply in Northern Ireland and Unfettered access route for UKMA(GB)": 1,
      "Decentralised procedure for sale or supply in Northern Ireland and Unfettered access route for UKMA(GB)": 1,
      "European reference product application for sale or supply in Northern Ireland": 1,
    },
  },

  {
    number: 1,
    type: "radio",
    identifier: "q1",
    sectionName: "section1",
    question:
      "Has the active substance(s) of your product previously been authorised in the UK?",
    radios: [
      {
        name: "Has the active substance(s) of your product previously been authorised in the UK?",
        value: "Yes",
        id: "Yes",
      },
      {
        name: "Has the active substance(s) of your product previously been authorised in the UK?",
        value: "No",
        id: "No",
      },
    ],
    summary: [
      {
        key: "Has the active substance(s) of your product previously been authorised in the UK?",
        value: "Yes",
      },
      {
        key: "Has the active substance(s) of your product previously been authorised in the UK?",
        value: "No",
      },
    ],
    routes: {
      Yes: 3,
      No: 2,
    },
  },

  {
    number: 2,
    type: "radio",
    identifier: "q2",
    sectionName: "section1",
    question:
      "Does your application concern an orphan medicinal product (to which point 6 of part II of annex I to the 2001 Directive applies)?",
    radios: [
      {
        name: "Does your application concern an orphan medicinal product (to which point 6 of part II of annex I to the 2001 Directive applies)?",
        value: "Yes",
        id: "Yes",
      },
      {
        name: "Does your application concern an orphan medicinal product (to which point 6 of part II of annex I to the 2001 Directive applies)?",
        value: "No",
        id: "No",
      },
    ],
    summary: [
      {
        key: "Does your application concern an orphan medicinal product (to which point 6 of part II of annex I to the 2001 Directive applies)?",
        value: "Yes",
      },
      {
        key: "Does your application concern an orphan medicinal product (to which point 6 of part II of annex I to the 2001 Directive applies)?",
        value: "No",
      },
    ],
    routes: {
      Yes: 6,
      No: 6,
    },
  },

  {
    number: 3,
    type: "radio",
    identifier: "q3",
    sectionName: "section1",
    question:
      "Please confirm the legal basis of your application or whether you intend to submit an extension application:",
    radios: [
      {
        name: "Please confirm the legal basis of your application or whether you intend to submit an extension application:",
        value:
          "Regulation 50 (previously Article 8(3) of Directive 2001/83/EC)",
        id: "Regulation 50 (previously Article 8(3) of Directive 2001/83/EC)",
      },
      {
        name: "Please confirm the legal basis of your application or whether you intend to submit an extension application:",
        value: "Extension",
        id: "Extension",
      },
      {
        name: "Please confirm the legal basis of your application or whether you intend to submit an extension application:",
        value: "Abridged (Previously Article 10 of Directive 2001/83/EC)",
        id: "Abridged (Previously Article 10 of Directive 2001/83/EC)",
      },
    ],
    summary: [
      {
        key: "Please confirm the legal basis of your application or whether you intend to submit an extension application:",
        value:
          "Regulation 50 (previously Article 8(3) of Directive 2001/83/EC)",
      },
      {
        key: "Please confirm the legal basis of your application or whether you intend to submit an extension application:",
        value: "Extension",
      },
      {
        key: "Please confirm the legal basis of your application or whether you intend to submit an extension application:",
        value:
          "Well-established use application - Regulation 54 (previously Article 10a of Directive 2001/83/EC)",
      },
    ],
    routes: {
      "Regulation 50 (previously Article 8(3) of Directive 2001/83/EC)": 6,
      Extension: 6,
      "Abridged (Previously Article 10 of Directive 2001/83/EC)": 4,
    },
  },

  {
    number: 4,
    type: "radio",
    identifier: "q4",
    sectionName: "section1",
    question: "What is the legal basis of your application?",
    radios: [
      {
        name: "What is the legal basis of your application?",
        value:
          "Hybrid application - Regulation 52 (previously Article 10.3 of Directive 2001/83/EC)",
        id: "Hybrid application - Regulation 52 (previously Article 10.3 of Directive 2001/83/EC)",
      },
      {
        name: "What is the legal basis of your application?",
        value:
          "Similar biological application - Regulation 53 (previously Article 10.4 of Directive 2001/83/EC)",
        id: "Similar biological application - Regulation 53 (previously Article 10.4 of Directive 2001/83/EC)",
      },
      {
        name: "What is the legal basis of your application?",
        value:
          "Well-established use application - Regulation 54 (previously Article 10a of Directive 2001/83/EC)",
        id: "Well-established use application - Regulation 54 (previously Article 10a of Directive 2001/83/EC)",
      },
      {
        name: "What is the legal basis of your application?",
        value:
          "Fixed-combination application - Regulation 55 (previously Article 10b) of Directive 2001/83/EC)",
        id: "Fixed-combination application - Regulation 55 (previously Article 10b) of Directive 2001/83/EC)",
      },
      {
        name: "What is the legal basis of your application?",
        value:
          "Informed consent application - Regulation 56 (previously Article 10c) of Directive 2001/83/EC)",
        id: "Informed consent application - Regulation 56 (previously Article 10c) of Directive 2001/83/EC)",
      },
      {
        name: "What is the legal basis of your application?",
        value:
          "Generic Application - Regulation 51 (previously Article 10.1 of Directive 2001/83/EC)",
        id: "Generic Application - Regulation 51 (previously Article 10.1 of Directive 2001/83/EC)",
      },
    ],
    summary: [
      {
        key: "What is the legal basis of your application?",
        value:
          "Hybrid application - Regulation 52 (previously Article 10.3 of Directive 2001/83/EC)",
      },
      {
        key: "What is the legal basis of your application?",
        value:
          "Similar biological application - Regulation 53 (previously Article 10.4 of Directive 2001/83/EC)",
      },
      {
        key: "What is the legal basis of your application?",
        value:
          "Well-established use application - Regulation 54 (previously Article 10a of Directive 2001/83/EC)",
      },
      {
        key: "What is the legal basis of your application?",
        value:
          "Fixed-combination application - Regulation 55 (previously Article 10b) of Directive 2001/83/EC)",
      },
      {
        key: "What is the legal basis of your application?",
        value:
          "Informed consent application - Regulation 56 (previously Article 10c) of Directive 2001/83/EC)",
      },
      {
        key: "What is the legal basis of your application?",
        value:
          "Generic Application - Regulation 51 (previously Article 10.1 of Directive 2001/83/EC)",
      },
    ],
    routes: {
      "Hybrid application - Regulation 52 (previously Article 10.3 of Directive 2001/83/EC)": 6,
      "Similar biological application - Regulation 53 (previously Article 10.4 of Directive 2001/83/EC)": 6,
      "Well-established use application - Regulation 54 (previously Article 10a of Directive 2001/83/EC)": 6,
      "Fixed-combination application - Regulation 55 (previously Article 10b) of Directive 2001/83/EC)": 6,
      "Informed consent application - Regulation 56 (previously Article 10c) of Directive 2001/83/EC)": 6,
      "Generic Application - Regulation 51 (previously Article 10.1 of Directive 2001/83/EC)": 5,
    },
  },
  {
    number: 5,
    type: "radio",
    identifier: "q5",
    sectionName: "section1",
    question: "Does any of the following apply to your application(s)",
    description: [
      "• The application lists a new source of active substance not covered by:",
      "- a European Pharmacopoeia certificate of suitability (CEP) or",
      "- an ASMF which has been assessed and accepted as part of an authorised medicinal product the UK. ",
      "• The application concerns a new route/method of synthesis for active substance.",
      "• The application concerns use of the active substance for a new population or a new clinical indication.",
      "• The application concerns a new route of administration, or a new method of administration to the site of action or absorption.",
      "• The product is presented as a modified/controlled release dosage form or presented as a metered dose/power inhaler.",
      "• The application is for a sterile product which uses a new sterilisation method or container material direct contact with the product. ",
      "• The application for a new influenza vaccine, or a new manufacturer of strain, or an influenza vaccine using a new manufacturer or manufacturing process. ",
      "• The application includes a new excipient not previously used in the UK",
    ],
    radios: [
      {
        name: "Does any of the following apply to your application(s)",
        value: "Yes",
        id: "Yes",
      },
      {
        name: "Does any of the following apply to your application(s)",
        value: "None of the above",
        id: "None of the above",
      },
    ],
    summary: [
      {
        key: "Does any of the following apply to your application(s)",
        value: "Yes",
      },
      {
        key: "Does any of the following apply to your application(s)",
        value: "None of the above",
      },
    ],
    routes: {
      Yes: 6,
      "None of the above": 6,
    },
  },
  {
    number: 6,
    type: "text",
    identifier: "q6",
    sectionName: "section1",
    size: 20,
    question:
      "How many additional strengths of the same dosage form are you submitting? (If it is a single submission, please set to 0.)",

    summary: [
      {
        key: "How many additional strengths of the same dosage form are you submitting?",
        value: "Yes",
      },
    ],
    route: "complete",
  },
];

export { mockQuestions };
