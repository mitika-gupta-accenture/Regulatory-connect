import React from 'react';
import Paragraph, { ParagraphFieldType } from 'core/components/Paragraph';

export interface ParagraphServerFieldtype {
    apiKey?: string[];
    apiEndPoint?: string;
}

type ApiResponse = {
    [key: string]: string;
};

async function fetchData(apiEndPoint: string, apiKey?: string[]): Promise<string> {
    const response = await fetch(apiEndPoint);
    const data: ApiResponse = await response.json();
    let nestedValue = "";
    apiKey?.forEach(key => {
        nestedValue += data[key];
    });
    return nestedValue;
}

async function GetParagraph({
    field,
}: {
    field: ParagraphServerFieldtype;
}) {
    let data: string[] | undefined;
    
    if (field.apiEndPoint) {
        try {
            const fetchedData = await fetchData(field.apiEndPoint, field.apiKey);
            data = [fetchedData]; 
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    return (
        <Paragraph field={{
            content: data || [],
            type: "paragraph",
        }} />
    );
}

export default GetParagraph;
