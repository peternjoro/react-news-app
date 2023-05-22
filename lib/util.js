import dayjs from "dayjs";

// join multiple classnames
export function classNames(...classes){
    return classes.filter(Boolean).join(' ');
}
export const ucwords = (str) => {
    let result = str;
    if(str){
        const words = str.split(" ");
        if(words.length > 0){
            result = words.map((word) => {
                return word ? word[0].toUpperCase() + word.substring(1) : null;
            }).join(" ");
        }
    }
    return result;
}
export const lowercase = (str) => {
    let results = str;
    if(str){
        results = str.trim().toLowerCase();
    }
    return results;
}
export function validText(str,type='text-only'){
    let valid = false;
    if(type && str){
        if(type === 'text-only'){
            valid = /^[a-zA-Z']*$/.test(str);
        }
        if(type === 'names'){
            valid = /^[a-zA-Z' ]*$/.test(str);
        }
        if(type === 'alpha-numeric'){
            if(/^[a-zA-Z0-9'-._,() ]*$/.test(str) === true) valid = true;
        }
        if(type === 'email'){
            valid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/.test(str);
        }
    }
    return valid;
}
export function objectNotEmpty(obj)
{
    let isEmpty = false;
    if(obj)
    {
        for(const keys in obj){
            isEmpty = true;
            break;
        }
    }
    return isEmpty;
}
export function timeDifference(fromDatetime,toDatetime,diffIn){
    let diff = 0;
    if(fromDatetime && toDatetime && diffIn){
        let diffms = Math.abs(new Date(toDatetime) - new Date(fromDatetime));
        if(diffms > 0){
            diff = Math.floor(diffms/1000); // in seconds
            if(diffIn === 'min'){
                diff = Math.floor((diffms/1000)/60);
            }
        }
    }
    return diff;
}
export function getObjFromArray(arrayofObjs,findKey,findVal){
    let objItem = null;
    let objIndex = null;
    if(arrayofObjs && arrayofObjs.length > 0 && findKey && findVal){
        const obj = arrayofObjs.filter(item => item[findKey] === findVal);
        if(obj.length > 0){
            objItem = obj[0];
            objIndex = arrayofObjs.findIndex(obj => obj[findKey] === findVal);
        }
    }
    return [objItem,objIndex];
}
// filter an array where key(findKey) = findVal
export const getArrayofObjects = (arrayofObjs,findKey,findVal) => {
    let filteredArray = [];
    if(arrayofObjs.length > 0 && findKey && findVal){
        filteredArray = arrayofObjs.filter(function (el){
            return lowercase(el[findKey]) === lowercase(findVal);
        });
    }
    return filteredArray;
}
// check object found in array of objects
export const objectFoundInArray = (arrayofObjs,findKey,findVal) => {
    let objFound = false;
    if(arrayofObjs && arrayofObjs.length > 0 && findKey && findVal){
        objFound = arrayofObjs.some(obj => {
            if (obj[findKey] === findVal) {
                return true;
            }
            return false;
        });
    }
    return objFound;
}
// remove object from array where findKey = findVal
export function removeObjFromArray(arrayofObjs,findKey,findVal)
{
    let finalArry = arrayofObjs;
    if(arrayofObjs.length > 0 && findKey && findVal)
    {
        finalArry = arrayofObjs.filter(object => {
            return object[findKey] !== findVal;
        });
    }
    return finalArry;
}
export function filterSources(data){
    let filteredSources = [];
    if(data && data.length > 0){
        filteredSources = data.filter(object => {
            return object.active === true;
        });
    }
    return filteredSources;
}
export function filterArticles(articles,filterBy,filterData){
    let filtered = [];
    if(articles && articles.length && objectNotEmpty(filterData) && filterBy){
        switch(filterBy)
        {
            case 'source':
                if(filterData.source){
                    filtered = articles.filter(function (el){
                        return el.source.id === filterData.source;
                    });
                }
                break;
            case 'category':
                const categories = filterData.categories;
                if(categories && categories.length > 0){
                    let filteredArray = []
                    categories.forEach(cat => {
                        articles.filter(function (el){
                            if(el.source.id === cat){
                                filteredArray.push(el);
                            }
                            return;
                        });
                    });
                    filtered = filteredArray;
                }
                break;
            case 'dates':
                const from = filterData.from;
                const to = filterData.to;
                if(from && to){
                    filtered = articles.filter(function (el){
                        let dateStr = el.publishedAt;
                        const dtStr = dateStr.split('T');
                        if(dtStr.length > 0){
                            dateStr = dtStr[0];
                        }
                        const fmt = `YYYY-MM-DD`;
                        return ((dateStr === from || dayjs(dateStr).isAfter(dayjs(from))) && (dateStr === to || dayjs(dateStr).isBefore(dayjs(to))));
                    });
                }
                break;
        }
    }
    return filtered;
}
export function getUniqueValues(arrayofObjs,uniqueKey,returnType="array",objIdValueType="index"){
    let uniquekeyValues = [];
    if(arrayofObjs && arrayofObjs.length > 0 && uniqueKey){
        const uniqueValuesArray = [...new Set(arrayofObjs.map(obj => obj[uniqueKey]))];
        // return an array of objects
        if(returnType === "array of objects"){
            uniqueValuesArray.map((val,index) => {
                let objId = parseInt(index)+1;
                if(objIdValueType === "key value"){
                    if(val){
                        objId = (val.trim()).replace(/ /g,"_");
                    }
                }
                let obj = {id:objId,value:ucwords(val)};
                uniquekeyValues.push(obj);
            });
        }
        else uniquekeyValues = uniqueValuesArray;
    }
    return uniquekeyValues;
}
// get the first 10,20,30.. objects from array
export function firstNResults(arrayofObjs, n){
    let slicedArray = [];
    if(arrayofObjs && arrayofObjs.length > 0){
        slicedArray = arrayofObjs.slice(0, n);
    }
    return slicedArray;
}
export function readableDate(dateStr,format){
    let results = dateStr;
    if(dateStr && format)
    {
        let dtStr = dateStr.split('T');
        if(dtStr.length > 0){
            dateStr = dtStr[0];
        }
        results = dayjs(dateStr).format(format);
    }
    return results;
}