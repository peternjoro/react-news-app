import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { TfiAngleDoubleLeft } from "react-icons/tfi";
import { FaTimesCircle } from "react-icons/fa";
import { activeState,authUser } from "../store/userSlice";
import { API_POST_REQUEST, NEWS_SOURCES } from "../lib/constants";
import { filterSources,getUniqueValues, ucwords,classNames,objectFoundInArray, objectNotEmpty,removeObjFromArray } from "../lib/util";
import Layout from "../components/layout/Index";
import SimpleSelectBox from "../components/SimpleSelectBox";
import LoaderSpin from "../components/loaders/LoaderSpin";
import { alertError, alertProgress } from "../components/sweetalert/alerts";
import { closeAlertDialog } from "../components/sweetalert/alerts";

const add_views = {source:false,category:false};
const selected_items = {source:'',sourceVal:'',category:'',categoryVal:''};

export default function Settings(){
    const dispatch = useDispatch();
    const user = useSelector(authUser);
    const [showView,setShowView] = useState(add_views);
    const [selected,setSelected] = useState(selected_items);
    const [submitting,setSubmitting] = useState({source:false,category:false});
    const [deleting,setDeleting] = useState({source:false,category:false,author:false});
    const sources = filterSources(NEWS_SOURCES);
    const categories = getUniqueValues(sources,"category","array of objects","key value");
    const my_authors = user.my_authors||[];

    const onItemSelected = (itemName,itemValue,text) => {
        // console.log(`itemName: ${itemName}, itemValue: ${itemValue}, text: ${text}`);
        switch(itemName)
        {
            case 'source':
                setSelected({...selected,source:itemValue,sourceVal:text});
                break;
            case 'category':
                setSelected({...selected,category:itemValue,categoryVal:text});
                break;
        }
    }
    const addItem = async (type) => {
        if(type)
        {
            const itemType = type;
            const itemKey = selected[type];
            if(!itemKey){
                alertError("",ucwords(type)+" is required");
                return;
            }
            const itemValue = '';
            let checkerKey = '';
            let checkerDataSet = [];
            if(type === "source"){
                itemValue = selected.sourceVal;
                checkerKey = "source_id";
                checkerDataSet = user.my_sources;
            }
            else {
                itemValue = selected.categoryVal;
                checkerKey = "category_key";
                checkerDataSet = user.my_categories;
            }
            const itemExists = objectFoundInArray(checkerDataSet,checkerKey,itemKey);
            if(itemExists){
                alertError("",type+" exists in your favourites list");
                return;
            }
            const processing = submitting[type];
            if(!processing)
            {
                const token = localStorage.getItem('pr7rg0ko2');
                if(token)
                {
                    let curProcessing = {...submitting};
                    curProcessing[type] = true;
                    setSubmitting(curProcessing);
                    const data = {itemType,itemKey,itemValue};
                    const endpoint = '/api/add-item?token='+token;
                    const jsonData = JSON.stringify(data);
                    const postReq = {...API_POST_REQUEST,body:jsonData};
                    const response = await fetch(endpoint,postReq);
                    const results = await response.json();
                    let error = results.message;
                    if(results.status){
                        //error = null;
                        // add item to my current list
                        const id = results.data||0;
                        if(parseInt(id) > 0){
                            if(type === "source"){
                                const newSource = {id:id,source_id:itemKey,source_name:itemValue};
                                const newSources = [...user.my_sources,newSource];
                                const newUser = {...user,my_sources:newSources};
                                dispatch(activeState({user:newUser}));
                            }
                            else {
                                const newCat = {id:id,category_key:itemKey,category_name:itemValue};
                                const newCats = [...user.my_categories,newCat];
                                const newUser = {...user,my_categories:newCats};
                                dispatch(activeState({user:newUser}));
                            }
                        }
                    }
                    if(error){
                        alertError("",error);
                    }
                    let curProcessing1 = {...submitting};
                    curProcessing1[type] = false;
                    setSubmitting(curProcessing1);
                }
            }
        }
    }
    const removeFavourite = async (type, data) => {
        if(type && objectNotEmpty(data))
        {
            const delStatus = deleting[type];
            if(!delStatus)
            {
                const id = data.id;
                const token = localStorage.getItem('pr7rg0ko2');
                if(token)
                {
                    alertProgress(`Deleting ${type} ...`);
                    let curDelStatus = {...deleting};
                    curDelStatus[type] = true;
                    setDeleting(curDelStatus);
                    const endpoint = '/api/delete-item?token='+token;
                    const jsonData = JSON.stringify({itemId:id});
                    const postReq = {...API_POST_REQUEST,body:jsonData};
                    const response = await fetch(endpoint,postReq);
                    const results = await response.json();
                    let error = results.message;
                    if(results.status){
                        // delete item from my current list
                        if(type === "source"){
                            const newSources = removeObjFromArray(user.my_sources,"id",id);
                            const newUser = {...user,my_sources:newSources};
                            dispatch(activeState({user:newUser}));
                        }
                        if(type === "category"){
                            const newCats = removeObjFromArray(user.my_categories,"id",id);
                            const newUser = {...user,my_categories:newCats};
                            dispatch(activeState({user:newUser}));
                        }
                        if(type === "author"){
                            const newList = removeObjFromArray(user.my_authors,"id",id);
                            const newUser = {...user,my_authors:newList};
                            dispatch(activeState({user:newUser}));
                        }
                    }
                    if(error){
                        alertError("",error);
                    }
                    closeAlertDialog();
                    let curDelStatus1 = {...deleting};
                    curDelStatus1[type] = false;
                    setDeleting(curDelStatus1);
                }
            }
        }
    }

    return (
        <Layout pageTitle={`My Settings`}>
            <div className="flex flex-col w-full h-full mb-10">
                <div className="flex items-center justify-between">
                    <h3 className="flex mt-10 mb-2 text-softGreen"><strong>My Preferences</strong></h3>
                    <Link href={`/`}>
                        <div className={classNames("flex w-fit space-x-1 p-1 items-center rounded-md text-softGreen",
                            "border border-softGreen px-2 hover:bg-softGreen hover:text-white cursor-pointer")}>
                            <TfiAngleDoubleLeft className="w-3 h-3"/>
                            <span>Back</span>
                        </div>
                    </Link>
                </div>
                <hr/>
                <div className="flex flex-col p-3 my-5 bg-white rounded-md shadow">
                    <h3 className="flex mb-3 text-gray-700"><strong>My favourite sources</strong></h3>
                    <button className="outlined-action-btn p-1.5 w-fit px-2" onClick={() => setShowView({...showView,source:!showView.source})}>New Source</button>
                    <hr className="my-2"/>
                    <div className={showView.source ? 'flex flex-col md:flex-row items-center my-2' : 'hidden'}>
                        <div className="flex w-full md:w-1/2">
                            <span className="w-1/3 text-gray-700">Source:</span>
                            <div className="block w-full md:w-2/3">
                                <SimpleSelectBox iname={`source`} data={sources} selected={selected.source} onSelectItem={onItemSelected}
                                    titleOption={true}
                                    />
                            </div>
                        </div>
                        <div className="flex w-full md:w-1/2">
                            <button className="submit-btn p-1.5 px-2" title="Add new source" onClick={() => addItem('source')}>
                                {submitting.source ? (
                                    <LoaderSpin />
                                ) : ('Add Source')}
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 my-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-2 gap-y-7">
                        {user.my_sources.length > 0 ? (
                            user.my_sources.map((source,index) => {
                                return (
                                    <div className="relative block p-2 px-5 text-white rounded w-fit outline outline-1 outline-innoColor1 bg-softGreen" key={index}>
                                        {source.source_name}
                                        <button className="absolute z-50 flex -top-3 right-0.5 text-red-700" title="Remove favourite"
                                            onClick={() => removeFavourite('source',source)}><FaTimesCircle/></button>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="flex">
                                <h3>You have no preferred sources</h3>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col p-3 bg-white rounded-md shadow">
                    <h3 className="flex mb-3 text-gray-700"><strong>My favourite categories</strong></h3>
                    <button className="outlined-action-btn p-1.5 w-fit px-2" onClick={() => setShowView({...showView,category:!showView.category})}>New Category</button>
                    <hr className="my-2"/>
                    <div className={showView.category ? 'flex flex-col md:flex-row items-center my-2' : 'hidden'}>
                        <div className="flex w-full md:w-1/2">
                            <span className="w-1/3 text-gray-700">Category:</span>
                            <div className="block w-full md:w-2/3">
                                <SimpleSelectBox iname={`category`} data={categories} selected={selected.category} onSelectItem={onItemSelected}
                                    titleOption={true}
                                    />
                            </div>
                        </div>
                        <div className="flex w-full md:w-1/2">
                            <button className="submit-btn p-1.5 px-2" title="Add new category" onClick={() => addItem('category')}>
                                {submitting.category ? (
                                    <LoaderSpin />
                                ) : ('Add Category')}
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 my-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-2 gap-y-7">
                        {user.my_categories.length > 0 ? (
                            user.my_categories.map((cat,index) => {
                                return (
                                    <div className="relative block p-2 px-5 text-white rounded w-fit outline outline-1 outline-innoColor1 bg-softGreen" key={index}>
                                        {cat.category_name}
                                        <button className="absolute z-50 flex -top-3 right-0.5 text-red-700" title="Remove favourite"
                                            onClick={() => removeFavourite('category',cat)}><FaTimesCircle/></button>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="flex">
                                <h3>You have no preferred categories</h3>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col p-3 my-5 bg-white rounded-md shadow">
                    <h3 className="flex text-gray-700"><strong>My favourite authors</strong></h3>
                    <div className="grid grid-cols-2 my-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-2 gap-y-7">
                        {my_authors.length > 0 ? (
                            my_authors.map((author,index) => {
                                return (
                                    <div className="relative block p-2 px-5 text-white rounded w-fit outline outline-1 outline-innoColor1 bg-softGreen" key={index}>
                                        {author.author_name}
                                        <button className="absolute z-50 flex -top-3 right-0.5 text-red-700" title="Remove favourite"
                                            onClick={() => removeFavourite('author',author)}><FaTimesCircle/></button>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="flex">
                                <h3>You have no preferred authors</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}