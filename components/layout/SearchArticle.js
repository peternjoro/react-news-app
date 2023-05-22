import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BiSearch } from "react-icons/bi";
import { FiChevronDown,FiChevronUp } from "react-icons/fi";
import { useViewPortState } from "../../custom-hooks/useViewPortState";
import { loginStatus } from "../../store/userSlice";
import { NEWS_SOURCES } from "../../lib/constants";
import { classNames, filterSources,getUniqueValues } from "../../lib/util";
import SimpleSelectBox from "../SimpleSelectBox";
import SimpleInputBox from "../SimpleInputBox";
import { alertError } from "../sweetalert/alerts";
import SimpleCheckBox from "../SimpleCheckBox";

const formError = {fromdt:'',todt:''};
const form_data = {skey:'',fromdt:'',todt:'',source:'',category:'',use_favourites:false};

export default function NewsSource({ onSearchEntered,onFilterArticles,showFilterViws=false }){
    const viewPortState = useViewPortState();
    const siggedIn = useSelector(loginStatus);
    const [error,setError] = useState(formError);
    const [formData,setFormData] = useState(form_data);
    const [filterViews,setFilterViews] = useState(showFilterViws);
    const [openFilterViews,setOpenFilterViews] = useState(false);
    const sources = filterSources(NEWS_SOURCES);
    const categories = getUniqueValues(sources,"category","array of objects","key value");
    let isMobile = false;
    if(viewPortState[0]<= 767){
        isMobile = true;
    }

    useEffect(() => {
        setFilterViews(showFilterViws);
    },[showFilterViws]);

    const validateDate = (type,dateStr) => {
        let curFData = {...formData};
        curFData[type] = dateStr;
        setFormData(curFData);
        if(type && dateStr){
        }
    }
    const onRadioBtnChange = (name,val) => {
        // console.log(`name: ${name}, val: ${val}`);
        switch(name)
        {
            case 'use_favourites':
                setFormData({...formData,use_favourites:val});
                break;
        }
    }
    const onInputChanged = (inputName,val) => {
        //console.log(`inputName: ${inputName}, val: ${val}`);
        switch(inputName)
        {
            case 'keyword':
                setFormData({...formData,skey:val});
                break;
            case 'fromdt':
            case 'todt':
                validateDate(inputName,val);
                break;
        }
    }
    const onItemSelected = (itemName,itemValue,text) => {
       // console.log(`itemName: ${itemName}, itemValue: ${itemValue}, text: ${text}`);
        switch(itemName)
        {
            case 'source':
                setFormData({...formData,source:itemValue});
                break;
            case 'category':
                setFormData({...formData,category:itemValue});
                break;
        }
    }
    const search = () => {
        setFilterViews(false);
        // return search key back to the caller
        onSearchEntered(formData.skey,formData.use_favourites);
    }
    const filterResults = () => {
        console.log('called ...');
        let source = formData.source;
        let cat = formData.category;
        let from = formData.fromdt;
        let to = formData.todt;
        if(from && !to){
            alertError("","Latest article date required");
            return;
        }
        if(to && !from){
            alertError("","Oldest article date required");
            return;
        }
        onFilterArticles(source,cat,from,to);
        /*if(source || cat || (from && to)){
            onFilterArticles(source,cat,from,to);
        }*/
    }

    return (
        <div className="flex flex-col w-full mb-3">
            <div className="flex flex-col w-full divide-y divide-white">
                <div className="flex flex-col">
                    <div className="flex items-center w-full p-1 bordered-label">
                        <input name="keyword" className="flex flex-grow p-2 px-2 border-0 rounded-md focus:border-0 focus:outline-0" 
                            placeholder="search keyword" defaultValue={`apple`} onChange={(e) => onInputChanged(e.target.name,e.target.value)}/>
                        <button className={`flex w-fit px-2 cursor-pointer`} title="Search from world news" onClick={() => search()}>
                            <BiSearch className="w-6 h-6"/>
                        </button>
                    </div>
                    <div className={siggedIn ? 'flex items-center py-3 pl-1' : 'hidden'}>
                        <SimpleCheckBox cbxname={`use_favourites`} onCheckChanged={onRadioBtnChange}/>
                        <span className="flex ml-2">Use my favourites</span>
                    </div>
                </div>
                <div className={classNames(filterViews ? 'flex' : 'hidden',`flex-col p-2 text-gray-700`)}>
                    <div className={`flex ${isMobile ? 'cursor-pointer text-center justify-between' : 'cursor-none'}`}
                        onClick={() => setOpenFilterViews(!openFilterViews)}>
                        <h3 className={`flex flex-grow ${isMobile ? 'hover-effect' : ''}`}>Filter Results</h3>
                        <div className={isMobile ? `flex w-fit px-2` : `hidden`}>
                            {openFilterViews ? (
                                <div className="flex text-red-700">
                                    <FiChevronUp />
                                </div>
                            ) : (
                                <div className="flex">
                                    <FiChevronDown/>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={`${!isMobile ? `flex` : (`${openFilterViews ? 'flex' : 'hidden'}`)} flex-col`}>
                        <div className="flex items-center mt-2 mb-0 space-y-0 md:block md:space-y-2">
                            <span className="flex w-1/3 md:w-full">Source</span>
                            <div className="flex w-2/3 md:w-full">
                                <SimpleSelectBox iname={`source`} data={sources} selected={formData.source} onSelectItem={onItemSelected}
                                    titleOption={true}
                                    />
                            </div>
                        </div>
                        <div className="flex items-center mt-2 mb-0 space-y-0 md:block md:space-y-2">
                            <span className="flex w-1/3 md:w-full">Category</span>
                            <div className="flex w-2/3 md:w-full">
                                <SimpleSelectBox iname={`category`} data={categories} selected={formData.category} onSelectItem={onItemSelected}
                                    titleOption={true}
                                    />
                            </div>
                        </div>
                        <div className="flex items-center mt-2 mb-0 space-y-0 md:block md:space-y-2">
                            <span className="flex w-1/3 md:w-full">Oldest Article</span>
                            <div className="flex w-2/3 md:w-full">
                                <SimpleInputBox type={`date`} iname="fromdt" req="yes" placeholder={``} val={formData.fromdt} onInputChange={onInputChanged}
                                    additionalStyles={`w-full ${error.fromdt ? 'focus-input' : 'outline-none'}`}/>
                            </div>
                        </div>
                        <div className="flex items-center mt-2 mb-0 space-y-0 md:block md:space-y-2">
                            <span className="flex w-1/3 md:w-full">Latest Article</span>
                            <div className="flex w-2/3 md:w-full">
                                <SimpleInputBox type={`date`} iname="todt" req="yes" placeholder={``} val={formData.todt} onInputChange={onInputChanged}
                                    additionalStyles={`w-full ${error.todt ? 'focus-input' : 'outline-none'}`}/>
                            </div>
                        </div>
                        <button className="p-1.5 px-2 outlined-action-btn w-fit mt-2" title="Filter results"
                            onClick={() => filterResults()}>Filter</button>
                    </div>
                </div>
            </div>
        </div>
    )
}