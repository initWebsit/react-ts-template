import {FormEvent, useState} from 'react';
import { personSelectList } from 'mock/test/test';
import { searchTabProps } from "interface/searchTab/searchTab";
import {Input} from "antd";
import styled from '@emotion/styled';
import IdSelect from "../id_select/id_select";

const SearchTabBox = styled.div<{
    marginBottom?: number,
    height?: number
}>`
  //display: grid;
  //grid-template-columns: 1fr 100px;
  //grid-template-rows: repeat(1, 40px);
  //grid-template-areas: "left right";
  //grid-auto-columns: auto;
  //grid-auto-rows: 40px;
  //grid-auto-flow: row;
  //grid-column-gap: 10px;
  //justify-content: start;
  //align-content: start;
  //justify-items: stretch;
  //align-items: center;

  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.marginBottom ? props.marginBottom + 'rem' : undefined};
  height: ${(props) => props.height ? props.height + 'rem' : undefined};
  &>div:nth-of-type(1){
    flex-grow: 1;
  }
  &>div:nth-of-type(2){
    width: 10rem;
    margin-left: 1rem;
  }
`

const SearchTab = ({moduleName, setModuleNameFunc, personId, setPersonIdFunc}: searchTabProps) => {
    const [personList] = useState(personSelectList);
    const InputChangeFunc = (e: FormEvent<HTMLInputElement>) => {
        setModuleNameFunc(String(e.currentTarget.value));
    };
    const selectChangeFunc = (value: number) => {
        setPersonIdFunc(value || 0);
    };
    return (
        <SearchTabBox marginBottom={1} height={4}>
            <div>
                <Input value={moduleName} onInput={InputChangeFunc}/>
            </div>
            <div>
                <IdSelect value={personId} onChange={selectChangeFunc} defaultOptionName={'全部'} options={personList}/>
            </div>
        </SearchTabBox>
    )
}

export default SearchTab;