import { determineRoute } from 'app/convertQuestionConditions';

describe('convertQuestionConditions', () => {
  const answersArr = [
    {
      organisationDetails: [
        {
          name: 'BAYER PLC',
          identifier: '10',
          orgCode: 1214,
          orgAddressCode: 1,
          addressLine1: 'No.37',
          addressLine2: null,
          addressLine3: null,
          addressLine4: null,
          city: 'Bangalore',
          addressState: null,
          postalcode: '560036',
          country: 'India',
          addressTypeName: 'Headquarters',
        },
      ],
    },
    {
      question: 'What type of an application are you making?',
      sectionName: 'Tailor your application',
      identifier: 'what-type-of-application-are-you-making',
      answers: [
        {
          identifier: 'application-relation-radios',
          answer: 'Herbal',
          label: 'Select one.',
        },
      ],
    },
  ];

  test('returns default route', async () => {
    const route = [
      {
        'confirm-contact-address-marketing-authorisation-holder': {
          greaterThen: {
            organisationDetails: 3,
          },
        },
      },
      {
        'check-proposed-marketing-authorisation-holder-details': 'default',
      },
    ];
    const nextRoute = await determineRoute(route, answersArr);
    expect(nextRoute).toEqual('check-proposed-marketing-authorisation-holder-details');
  });

  test('returns matching route for successfull condition', async () => {
    const route = [
      {
        'confirm-contact-address-marketing-authorisation-holder': {
          equals: {
            'application-relation-radios': 'Herbal',
          },
        },
      },
      {
        'check-proposed-marketing-authorisation-holder-details': 'default',
      },
    ];
    const nextRoute = await determineRoute(route, answersArr);
    expect(nextRoute).toEqual(
      'confirm-contact-address-marketing-authorisation-holder',
    );
  });

  test('returns matching route for successfull condition for greater than', async () => {
    const route = [
      {
        'confirm-contact-address-marketing-authorisation-holder': {
          greaterThen: {
            organisationDetails: 0,
          },
        },
      },
      {
        'check-proposed-marketing-authorisation-holder-details': 'default',
      },
    ];
    const nextRoute = await determineRoute(route, answersArr);
    expect(nextRoute).toEqual(
      'confirm-contact-address-marketing-authorisation-holder',
    );
  });

  test('returns matching route for successfull condition for less than', async () => {
    const route = [
      {
        'confirm-contact-address-marketing-authorisation-holder': {
          lessThen: {
            organisationDetails: 5,
          },
        },
      },
      {
        'check-proposed-marketing-authorisation-holder-details': 'default',
      },
    ];
    const nextRoute = await determineRoute(route, answersArr);
    expect(nextRoute).toEqual(
      'confirm-contact-address-marketing-authorisation-holder',
    );
  });

  test('returns matching route for successfull condition for not equals & and', async () => {
    const route = [
      {
        'select-windsor-framework-category-that-applies-to-your-product': {
          and: [
            {
              notEquals: {
                'application-relation-radios':
                  'Simplified Homeopathic Registration (HR)',
              },
            },
            {
              notEquals: {
                'application-relation-radios':
                  'Traditional Herbal Registration (THR)',
              },
            },
          ],
        },
      },
      {
        'check-proposed-marketing-authorisation-holder-details': 'default',
      },
    ];
    const nextRoute = await determineRoute(route, answersArr);
    expect(nextRoute).toEqual('select-windsor-framework-category-that-applies-to-your-product');
  });

  test('returns matching route for successfull condition for not equals & or', async () => {
    const route = [
      {
        'select-windsor-framework-category-that-applies-to-your-product': {
          or: [
            {
              notEquals: {
                'application-relation-radios':
                  'Simplified Homeopathic Registration (HR)',
              },
            },
            {
              notEquals: {
                'application-relation-radios':
                  'Traditional Herbal Registration (THR)',
              },
            },
          ],
        },
      },
      {
        'check-proposed-marketing-authorisation-holder-details': 'default',
      },
    ];
    const nextRoute = await determineRoute(route, answersArr);
    expect(nextRoute).toEqual('select-windsor-framework-category-that-applies-to-your-product');
  });

  test('returns matching route for successfull condition with depth logic', async () => {
    const route = [
      {
        'confirm-contact-address-marketing-authorisation-holder': {
          equals: {
            'organisationDetails.0.orgCode': 1214,
          },
        },
      },
      {
        'check-proposed-marketing-authorisation-holder-details': 'default',
      },
    ];
    const nextRoute = await determineRoute(route, answersArr);
    expect(nextRoute).toEqual(
      'confirm-contact-address-marketing-authorisation-holder',
    );
  });

  test('error scenario', async () => {
    const nextRoute = await determineRoute([], answersArr);
    expect(nextRoute).toEqual(undefined);
  });
});
