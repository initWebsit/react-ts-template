import React from 'react';
import {rows} from "../../type/utils";
import {Select} from "antd";

type SelectProps = {
    value: rows;
    onChange: (value: number) => void;
    defaultOptionName?: string;
    options: { id: number; name: string; }[]
} & Omit<React.ComponentProps<typeof Select>, 'value' | 'onChange' | 'options'>

const toNumber = (value: unknown) => {
    return isNaN(Number(value)) ? 0 : Number(value);
}

const IdSelect = (props: SelectProps) => {
    let { value, onChange, defaultOptionName, options, ...result } = props;
    return (
        <Select value={options.length && options.length > 0 ? toNumber(value) : 0} onChange={(value) => onChange(toNumber(value))} {...result}>
            {props.defaultOptionName ? <Select.Option value={0} key={'defaultOptionName'}>{defaultOptionName}</Select.Option> : null}
            {
                options
                    ? options.map((element, index) => {
                        return (
                            <Select.Option value={element.id} key={index}>{element.name}</Select.Option>
                        )
                    })
                    : null
            }
        </Select>
    )
}

export default IdSelect;