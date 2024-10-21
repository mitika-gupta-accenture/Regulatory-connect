import React, { useState } from 'react';
import { IChildrenJsonProps } from '../../core/types/common';

export interface ITextInputProps {
    field: IChildrenJsonProps;
  }

export const TextInput = ({field}: ITextInputProps) => {

    const [value, setValue] = useState('')
    
    return (
        <div className='form-group '>
            <label htmlFor={field.name} title={field.toolTip}>{field.text}</label>
            <input
                type='text'
                id={field.name}
                value={value}
                placeholder={field.toolTip}
                title={field.toolTip}
                disabled={field.disabled}
                onChange={(e) => {setValue(e.target.value)}}
            />
        </div>
    );
}
