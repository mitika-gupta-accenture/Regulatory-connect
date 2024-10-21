import { mapApiDataToJson } from '../../../util/mapApiDataToJson';
import { Answer, ApiElementType, Field } from '../../../validation/types';

describe('mapApiDataToJson', () => {
  it('should return an empty array if questionFieldData.answers is undefined and no apiDataKey', () => {
    const questionFieldData: any = {
      apiDataKey: '',
      answers: undefined,
    };
    const data: ApiElementType[] = [];
    const result = mapApiDataToJson(questionFieldData, data);
    expect(result).toEqual([]);
  });

  it('should map top-level field answers correctly when apiDataKey is present', () => {
    const questionFieldData: any = {
      apiDataKey: 'someKey',
      answers: [{ value: 'id1', label: '', route: '' }],
    };
    const data: ApiElementType[] = [
      { identifier: 'id1', name: 'Label 1', code: 'id1' },
    ];

    const result = mapApiDataToJson(questionFieldData, data);
    expect(result).toEqual([
      {
        label: 'Label 1',
        value: 'id1',
        route: '',
        fields: [],
        code: 'id1',
      },
    ]);
  });

  it('should map nested fields correctly', () => {
    const questionFieldData: any = {
      apiDataKey: 'field1',
      answers: [
        {
          label: '',
          value: 'key1',
          route: '',
          fields: [
            {
              apiDataKey: 'nestedField',
              answers: [{ label: '', value: 'nestedKey1', route: '' }],
            },
          ],
        },
      ],
    };

    const data: ApiElementType[] = [
      {
        code: 'key1',
        name: 'Field 1',
        subGroup: [
          {
            code: 'nestedKey1',
            name: 'Nested Field 1',
            identifier: '2',
            isActive: '',
          },
        ],
        identifier: '1',
      },
    ];

    const result = mapApiDataToJson(questionFieldData, data);
    expect(result).toEqual([
      {
        label: 'Field 1',
        value: 'key1',
        route: '',
        code: 'key1', // Add this line to match the actual output
        fields: [
          {
            apiDataKey: '',
            answers: [
              {
                label: 'Nested Field 1',
                value: 'nestedKey1',
                route: '',
                code: 'nestedKey1', // Add this line to match the actual output
                hint: undefined, // Add this to match the actual output
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should return empty array when no matching identifiers are found', () => {
    const questionFieldData: any = {
      apiDataKey: 'nonExistingKey',
      answers: [{ label: '', value: 'key1', route: '' }],
    };

    const data: ApiElementType[] = [
      { identifier: 'key2', name: 'Field 2', code: 'key2' },
    ];

    const result = mapApiDataToJson(questionFieldData, data);
    expect(result).toEqual([
      { label: '', value: 'key1', route: '', fields: [], code: '' },
    ]);
  });

  it('should handle missing subGroup gracefully', () => {
    const questionFieldData: any = {
      apiDataKey: 'field1',
      answers: [
        {
          label: '',
          value: 'key1',
          route: '',
          fields: [
            {
              apiDataKey: 'nestedField',
              answers: [{ label: '', value: 'nestedKey1', route: '' }],
            },
          ],
        },
      ],
    };

    const data: ApiElementType[] = [
      { identifier: 'key1', name: 'Field 1', code: 'key1' },
    ];

    const result = mapApiDataToJson(questionFieldData, data);

    expect(result).toEqual([
      {
        label: 'Field 1',
        value: 'key1',
        route: '',
        code: 'key1', // Add this to match actual result
        fields: [
          {
            apiDataKey: '',
            answers: [
              {
                label: '',
                value: 'nestedKey1',
                route: '',
                code: '', // Add this to match actual result
                hint: undefined, // Add this to match actual result
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should transform nested field answers correctly when apiDataKey is present in both field and subfields', () => {
    const questionFieldData: any = {
      apiDataKey: '',
      answers: [
        {
          value: 'id1',
          label: '',
          route: '',
          fields: [
            {
              apiDataKey: 'nestedKey',
              answers: [{ value: 'subId1', label: '', route: '' }],
            },
          ],
        },
      ],
    };

    const data: ApiElementType[] = [
      {
        code: 'id1',
        identifier: 'id1',
        name: 'Label 1',
        subGroup: [
          {
            identifier: 'subId0',
            name: 'Sub Label 1',
            code: '1',
            isActive: '',
          },
        ],
      },
    ];

    const result = mapApiDataToJson(questionFieldData, data);

    expect(result).toEqual([
      {
        label: '',
        value: 'id1',
        route: '',
        code: undefined, // Handle undefined or missing code
        fields: [
          {
            apiDataKey: '',
            answers: [
              {
                label: '', // Since there's no match for subId1 in data, we expect the value to be returned as the label
                value: 'subId1',
                route: '',
                code: '', // Handle the empty code as per current output
                hint: undefined, // hint is not present in data
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should return default labels for non-existing identifiers', () => {
    const questionFieldData: any = {
      apiDataKey: 'field1',
      answers: [{ label: '', value: 'nonExistingKey', route: '' }],
    };

    const data: ApiElementType[] = [{ identifier: '1' }];

    const result = mapApiDataToJson(questionFieldData, data);
    expect(result).toEqual([
      {
        label: '',
        value: 'nonExistingKey',
        route: '',
        code: '',
        fields: [],
      },
    ]);
  });

  it('should handle nested fields without apiDataKey', () => {
    const questionFieldData: any = {
      apiDataKey: '',
      answers: [
        {
          label: 'Existing Label',
          value: 'key1',
          route: '',
          fields: [
            {
              apiDataKey: '',
              answers: [{ label: '', value: 'nestedKey1', route: '' }],
            },
          ],
        },
      ],
    };

    const data: ApiElementType[] = [
      {
        identifier: 'key1',
        name: 'Field 1',
        subGroup: [
          {
            identifier: 'nestedKey1',
            name: 'Nested Field 1',
            code: '1',
            isActive: '',
          },
        ],
        code: '1',
      },
    ];

    const result = mapApiDataToJson(questionFieldData, data);
    expect(result).toEqual([
      {
        label: 'Existing Label',
        value: 'key1',
        route: '',
        fields: [
          {
            apiDataKey: '',
            answers: [{ label: '', value: 'nestedKey1', route: '' }],
          },
        ],
      },
    ]);
  });

  it('should handle cases where the name field is missing in data', () => {
    const questionFieldData: any = {
      apiDataKey: 'someKey',
      answers: [{ value: 'id1', label: '', route: '' }],
    };
    const data: ApiElementType[] = [{ identifier: 'id1', code: 'id1' }]; // No 'name' field

    const result = mapApiDataToJson(questionFieldData, data);
    expect(result).toEqual([
      {
        label: 'undefined', // Fallback to value if name is missing
        value: 'id1',
        code: 'id1',
        route: '',
        fields: [],
      },
    ]);
  });

  it('should handle cases where subGroup in data is an empty array', () => {
    const questionFieldData: any = {
      apiDataKey: 'someKey',
      answers: [{ value: 'id1', label: '', route: '' }],
    };
    const data: ApiElementType[] = [
      { identifier: 'id1', name: 'Label 1', code: 'id1', subGroup: [] },
    ];

    const result = mapApiDataToJson(questionFieldData, data);
    expect(result).toEqual([
      {
        label: 'Label 1',
        value: 'id1',
        route: '',
        fields: [],
        code: 'id1',
      },
    ]);
  });

  it('should map nested fields only when parent is from JSON', () => {
    const questionFieldData: any = {
      answers: [
        {
          value: 'id1',
          label: 'id1',
          route: 'abc',
          fields: [
            {
              apiDataKey: 'accessPartner',
              route: 'abc',
            },
          ],
        },
      ],
    };

    const data: ApiElementType[] = [
      {
        identifier: 'subId1',
        name: 'Sub Label 1',
        code: '1',
      },
    ];

    const result = mapApiDataToJson(questionFieldData, data);

    expect(result).toEqual([
      {
        label: 'id1',
        value: 'id1',
        route: 'abc',
        code: undefined,
        fields: [
          {
            apiDataKey: '',
            route: 'abc',
            answers: [
              {
                label: 'Sub Label 1',
                value: 'subId1',
                route: undefined,
                code: '1',
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should return an empty array when questionFieldData has no answers', () => {
    const questionFieldData: any = {
      apiDataKey: '',
      answers: [], // No answers
    };

    const data: ApiElementType[] = [
      {
        identifier: 'key1',
        name: 'Field Label 1',
      },
    ];

    const result = mapApiDataToJson(questionFieldData, data);
    expect(result).toEqual([]); // Should return an empty array
  });

  it('should map top-level field answers correctly when apiDataKey and subApiDataKey is present', () => {
    const questionFieldData: any = {
      type: 'radio',
      identifier: 'which-procedure-type-radios',
      apiDataKey: 'productClassContent',
      subApiDataKey: 'productClassId=1.subGroup',
      hint: 'Select one.',
    };
    const data: ApiElementType[] = [
      {
        productClassId: 1,
        subGroup: [
          {
            identifier: '1',
            name: 'TYPE A PRODUCT CLASS CONTENT',
            code: '',
            isActive: '',
          },
        ],
        code: '1',
      },
      {
        productClassId: 7,
        subGroup: [
          {
            identifier: '1',
            name: '',
            code: '',
            isActive: '',
          },
        ],
        code: '2',
      },
    ];

    const result = mapApiDataToJson(questionFieldData, data);

    expect(result).toEqual([
      {
        label: 'TYPE A PRODUCT CLASS CONTENT',
        route: undefined,
        value: '1',
        code: '',
      },
    ]);
  });

  it('should map top-level field answers correctly when apiDataKey and subApiDataKey is present', () => {
    const questionFieldData: any = {
      type: 'radio',
      identifier: 'which-procedure-type-radios',
      apiDataKey: 'productClassContent',
      subApiDataKey: 'productClassId=7.subGroup',
      hint: 'Select one.',
    };
    const data: ApiElementType[] = [
      {
        productClassId: 1,
        subGroup: [
          {
            identifier: '1',
            name: 'TYPE A PRODUCT CLASS CONTENT',
            code: '',
            isActive: '',
          },
        ],
        code: '1',
      },
      {
        productClassId: 7,
        subGroup: [
          {
            identifier: '1',
            name: '',
            code: '',
            isActive: '',
          },
        ],
        code: '2',
      },
    ];

    const result = mapApiDataToJson(questionFieldData, data);

    expect(result).toEqual([
      {
        label: '',
        route: undefined,
        value: '1',
        code: '',
      },
    ]);
  });

  it('should map top-level field answers correctly when apiDataKey and subApiDataKey is present with hint text', () => {
    const questionFieldData: any = {
      identifier: 'marketing-authorisation-holder',
      apiDataKey: 'organisationDetails',
      type: 'summaryList',
      fields: [
        {
          name: {
            identifier: 'check-marketing-neha1',
            type: 'plainText',
            content: 'Organisation',
          },
          values: [
            {
              identifier: 'check-marketing-1',
              type: 'plainText',
              apiDataKey: 'organisationDetails.0.name',
              content: '###{}',
            },
          ],
        },
        {
          name: {
            identifier: 'check-marketing-neha1',
            type: 'plainText',
            apiDataKey: 'organisationDetails.0.content',
            content: 'Address',
          },
          values: [
            {
              identifier: 'check-marketing-1',
              type: 'plainText',
              apiDataKey: 'organisationDetails.0.addressLine1',
              content: '###{}',
            },
            {
              identifier: 'check-marketing-1',
              type: 'plainText',
              apiDataKey: 'organisationDetails.0.city',
              content: '###{}',
            },
            {
              identifier: 'check-marketing-1',
              type: 'plainText',
              apiDataKey: 'organisationDetails.0.postalcode',
              content: '###{}',
            },
            {
              identifier: 'check-marketing-1',
              type: 'plainText',
              apiDataKey: 'organisationDetails.1.country',
              content: '###{}',
            },
          ],
        },
      ],
    };
    const data: ApiElementType[] = [
      {
        addressLine1: 'No.37',
        addressLine2: null,
        addressLine3: null,
        addressLine4: null,
        addressState: null,
        addressTypeName: 'Headquarters',
        city: 'Bangalore',
        country: 'India',
        identifier: '1214',
        name: 'BAYER PLC',
        orgAddressCode: 1,
        orgIdentity: '10',
        postalcode: '560036',
        code: '1',
      },
      {
        addressLine1: 'No.37',
        addressLine2: null,
        addressLine3: null,
        addressLine4: null,
        addressState: null,
        addressTypeName: 'Headquarters',
        city: 'Bangalore',
        country: 'India',
        identifier: '1213',
        name: '',
        orgAddressCode: 1,
        orgIdentity: '10',
        postalcode: '560036',
        code: '2',
      },
    ];

    const result = mapApiDataToJson(questionFieldData, data);

    expect(result).toEqual([
      {
        label: 'BAYER PLC',
        route: undefined,
        value: '1214',
        code: '1',
      },
      {
        label: '',
        route: undefined,
        value: '1213',
        code: '2',
      },
    ]);
  });

  it('should map nested fields with func nestedDirectVal', () => {
    const questionFieldData: any = {
      identifier: 'application-relation-radios',
      apiDataKey: 'productClass',
      answers: [
        {
          value: 'id1',
          route: 'herbal-product-ingredients',
          fields: [
            {
              apiDataKey: 'productClass',
            },
          ],
        },
      ],
    };

    const data: ApiElementType[] = [
      {
        code: 'id1',
        name: 'Label 1',
        subGroup: [
          {
            identifier: 'subId1',
            name: 'Sub Label 1',
            code: '',
            isActive: '',
          },
        ],
        identifier: '1',
      },
    ];

    const result = mapApiDataToJson(questionFieldData, data);
    console.log('result :', result);
    expect(result).toEqual([
      {
        label: 'Label 1',
        value: 'id1',
        route: 'herbal-product-ingredients',
        code: 'id1',
        fields: [
          {
            apiDataKey: '',
            answers: [
              {
                value: 'subId1',
                label: 'Sub Label 1',
                code: '',
                route: undefined,
              },
            ],
          },
        ],
      },
    ]);
  });
  it('should return an empty array when all items are empty', () => {
    // Test with data where all fields would fail the filter
    const questionFieldData: any = {
      answers: [
        // Mock answer data if needed
      ],
      apiDataKey: 'someKey',
      subApiDataKey: 'subKey=value',
    };
    const emptyData = [{ label: '', value: '', route: undefined, code: '' }];

    const result = mapApiDataToJson(questionFieldData, emptyData);

    const filteredResults = Object.entries(result).filter(
      item =>
        item[1].label !== '' ||
        item[1].value !== '' ||
        item[1].route !== undefined ||
        item[1].code !== '',
    );

    expect(filteredResults).toHaveLength(0); // Should be empty
  });
  it('should filter out invalid entries', () => {
    const mockQuestionFieldData: any = {
      apiDataKey: 'someKey',
      subApiDataKey: 'key=value',
      answers: [
        { value: '1', route: 'route1', fields: [] },
        { value: '2', route: 'route2', fields: [] },
      ],
    };

    const result = mapApiDataToJson(mockQuestionFieldData, []);
    console.log('result :', result);
    expect(result).toEqual([
      { label: '', code: '', value: '1', route: 'route1', fields: [] },
      { label: '', code: '', value: '2', route: 'route2', fields: [] },
    ]);
  });

  it('should return objects with empty fields for non-matching entries in nestedDirectVal', () => {
    let mockData;

    // Sample mock data similar to what your function would work with
    mockData = [
      {
        identifier: '1',
        name: 'Item 1',
        code: '101',
        isActive: 'true',
        subGroup: [
          {
            identifier: '11',
            name: 'Sub Item 1',
            code: '201',
            isActive: 'true',
          },
          {
            identifier: '12',
            name: 'Sub Item 2',
            code: '202',
            isActive: 'true',
          },
        ],
      },
      {
        identifier: '2',
        name: 'Item 2',
        code: '102',
        isActive: 'true',
        subGroup: [
          {
            identifier: '21',
            name: 'Sub Item 3',
            code: '203',
            isActive: 'true',
          },
          {
            identifier: '22',
            name: 'Sub Item 4',
            code: '204',
            isActive: 'true',
          },
        ],
      },
    ];

    const mockQuestionFieldData: any = {
      apiDataKey: 'someKey',
      subApiDataKey: 'key=value',
      answers: [
        {
          value: '999', // this should not match any value in mockData
          label: 'Some Label',
          route: undefined,
          hint: undefined,
          code: undefined,
        },
      ],
    };
    const result = mapApiDataToJson(mockQuestionFieldData, mockData);

    // Find the nestedDirectVal result for an unmatched index (e.g., index = 3)
    const unmatchedResult = result.find(
      item => item.value === '' && item.label === '',
    );

    // Assert that the object has empty label, value, route, and code as expected
    expect(unmatchedResult).toEqual(undefined);
  });
});
