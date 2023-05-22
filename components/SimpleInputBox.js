import { classNames } from "../lib/util";

export default function SimpleInputBox({ type, iname, val, placeholder, onInputChange, additionalStyles, req='no'}){
    const required = req === 'yes' ? true : false;
    const inputVal = val || '';
    const additionalClassNames = additionalStyles || null;

    return (
        <input type={type} name={iname} className={classNames("simple-input",`${additionalClassNames}`)} value={inputVal} placeholder={placeholder}
            onChange={(e) => onInputChange(e.target.name,e.target.value)}
            required={required}
            />
    )
}