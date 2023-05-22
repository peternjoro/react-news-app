import { classNames } from "../lib/util";

export default function SimpleCheckBox({ cbxname, req='no', onCheckChanged }){
    const required = req === 'yes' ? true : false;

    return (
        <input type="checkbox" name={cbxname} className={classNames("rounded border-gray-300 text-red-600 shadow-sm",
            "focus:border-green-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50")}
            required={required}
            onChange={e => onCheckChanged(cbxname,e.target.checked)}
            />
    )
}