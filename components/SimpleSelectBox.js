import { classNames,ucwords } from "../lib/util";

export default function SimpleSelectBox({ iname, data, selected, onSelectItem, req='no',w='w-fit',titleOption=false }){
    const required = req === 'yes' ? true : false; // yes or no
    
    return (
        <select name={iname} value={selected} onChange={(e) => onSelectItem(iname,e.target.value,e.target.selectedOptions[0].text)}
            className={classNames(`block ${w} rounded-md border-gray-300 shadow-sm focus:border-indigo-300`,
                "focus:ring focus:ring-indigo-200 focus:ring-opacity-50")} required={required}>
            {titleOption && (
                <option value="">{`Select ${ucwords(iname)}`}</option>
            )}
            {data.map((item) => 
                <option value={item.id} key={item.id}>{item.value}</option>
            )}
        </select>
    )
}