import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { FiSettings } from "react-icons/fi";
import { MdFavorite } from "react-icons/md";
import news from '../lib/api/news';
import { API_POST_REQUEST, NEWS_SOURCES } from '../lib/constants';
import { filterSources,getUniqueValues,readableDate,getArrayofObjects,filterArticles } from '../lib/util';
import { activeState,loginStatus,authUser,searchKey,curArticles } from '../store/userSlice';
import Layout from '../components/layout/Index';
import Loader from '../components/loaders/LoaderSpin';
import SearchArticle from '../components/layout/SearchArticle';
import { alertError } from '../components/sweetalert/alerts';

const search_data = {skey:'',fromdt:'',todt:'',source:'',category:''};

export default function IndexPage(){
    const user = useSelector(authUser);
    const signedIn = useSelector(loginStatus);
    const [searchCriteria,setSearchCriteria] = useState(search_data);
    const cur_search_key = useSelector(searchKey);
    const articles = useSelector(curArticles);
    const dispatch = useDispatch();
    const [error,setError] = useState('');
    const [fetchingArticles,setFetchingArticles] = useState(false);
    const [filteredArticles,setFilteredArticles] = useState([]);
    const [articlestoShow,setArticlestoShow] = useState(6);
    const [submitting,setSubmitting] = useState(false);
    const sources = getUniqueValues(filterSources(NEWS_SOURCES),"id");
   
    useEffect(() => {
        if(articles.length > 0){
            setFilteredArticles(articles);
        }
        else searchArticles('apple');
    },[]);

    const searchArticles = async (searchkey,useFavourites=false) => {
        //console.log(`skey: ${searchkey}, useFavourites: ${useFavourites}`);
        if(searchkey && sources.length > 0){
            let sourceStr = sources.toString();
            if(useFavourites){
                const mySources = getUniqueValues(user.my_sources,"source_id");
                sourceStr = mySources.toString();
            }
            if(cur_search_key !== searchkey)
            {
                if(!fetchingArticles)
                {
                    setSearchCriteria({...searchCriteria,skey:searchkey});
                    dispatch(activeState({search_key:searchkey,articles: []}));
                    setFetchingArticles(true);
                    // fetch articles
                    const news_query = `q=+${searchkey}&searchIn=title,description&sources=${sourceStr}&sortBy=publishedAt`;
                    // &language=${lang} &pageSize=${pageSize}
                    const { data } = await news.get(`/everything?${news_query}`);
                    //console.log(data);
                    let err = data.message;
                    if(data.status === "ok"){
                        err = null;
                        let curArtls = data.articles||[];
                        dispatch(activeState({articles: curArtls}));
                        setFilteredArticles(curArtls);
                        setArticlestoShow(6);
                    }
                    setError(err);
                    setFilteredArticles([]);
                    setFetchingArticles(false);
                }
            }
        }
    }
    const getFilteredArticles = async (source,cat,from,to) => {
        if(source || cat || (from || to))
        {
            setFetchingArticles(true);
            let filteredResult = [];
            let err = '';
            if(cat){
                const categories = getUniqueValues(getArrayofObjects(filterSources(NEWS_SOURCES),"category",cat),"id");
                filteredResult = await filterArticles(articles,"category",{categories});
            }
            if(source){
                let dataset = articles;
                if(cat){
                    dataset = filteredResult;
                }
                filteredResult = await filterArticles(dataset,"source",{source});
            }
            if(from && to){
                let dataset = articles;
                if(cat || source){
                    dataset = filteredResult;
                }
                filteredResult = await filterArticles(dataset,"dates",{from,to})
            }
            setFilteredArticles(filteredResult);
            setFetchingArticles(false);
            setArticlestoShow(6);
            if(filteredResult.length === 0){
               err = 'No results found';
            }
            setError(err);
        }
        else  setFilteredArticles(articles);
    }
    const addFavourite = async (author) => {
        if(author){
            const token = localStorage.getItem('pr7rg0ko2');
            if(token && !submitting){
                setSubmitting(true);
                const data = {itemType:"author",itemKey:author,itemValue:author};
                const endpoint = '/api/add-item?token='+token;
                const jsonData = JSON.stringify(data);
                const postReq = {...API_POST_REQUEST,body:jsonData};
                const response = await fetch(endpoint,postReq);
                const results = await response.json();
                let error = results.message;
                if(results.status){
                    const id = results.data||0;
                    const newAuthor = {id:id,author_name:author};
                    const newAuthors = [...user.my_authors,newAuthor];
                    const newUser = {...user,my_authors:newAuthors};
                    dispatch(activeState({user:newUser}));
                }
                if(error){
                    alertError("",error);
                }
                setSubmitting(false);
            }
        }
    }

    const renderArticles = () => {
        if(error){
            return (
                <div className='flex items-center justify-center w-full p-5 text-innoColor2'>
                    <strong>{error}</strong> 
                </div>
            )
        }
        if(fetchingArticles) {
            return (
                <div className='flex items-center justify-center w-full p-5'>
                    <Loader />
                </div>
            )
        }
        if(filteredArticles.length > 0){
            return (
                <div className="flex flex-col">
                    <div className="flex items-center justify-between p-3 text-innoColor1">
                        <h3><strong>Search for: <span className="ml-2">{searchCriteria.skey}</span></strong></h3>
                        <h3 className="flex"><strong>Results:</strong><span className="ml-2"><strong>{filteredArticles.length}</strong></span></h3>
                    </div>
                    <hr className="mb-2"/>
                    <div className="grid w-full md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-7">
                        {filteredArticles.map((article,index) => {
                            const count = parseInt(index)+1;
                            if(count <= articlestoShow){
                                return (
                                    <div className="flex flex-col bg-white rounded-lg" key={index}>
                                        <div className="flex flex-col p-3">
                                            <div className="relative block float-left w-full h-64 overflow-hidden bg-no-repeat rounded-lg md:h-48">
                                                <Image priority alt="Article Image" src={article.urlToImage} layout='fill' className="object-fill rounded-lg opacity-100"/>
                                            </div>
                                            <div className='flex flex-col justify-between w-full h-full mt-2'>
                                                <div className="block">
                                                    <Link href={article.url}>
                                                        <a className="flex hover:text-innoColor1" target='_blank'>
                                                            <h3 className='flex text-[0.82rem]'><strong>{article.title}</strong></h3>
                                                        </a>
                                                    </Link>
                                                    <Link href={article.url}>
                                                        <a className="flex hover:text-innoColor1" target='_blank'>
                                                            <p className='flex text-[0.8rem] mt-2'>{article.description}</p>
                                                        </a>
                                                    </Link>
                                                </div>
                                                <div className="flex items-center justify-between text-[0.75rem]">
                                                    <div className="flex flex-col flex-grow">
                                                        <h3 className="relative group">
                                                            {article.author||`No Author`}
                                                            {signedIn && (
                                                                <button className="absolute z-50 opacity-0 cursor-pointer -left-0 -top-3 group-hover:opacity-100" title="Add to favourites"
                                                                    onClick={() => addFavourite(article.author)}>
                                                                    <MdFavorite className="w-5 h-5 fill-pink-500"/>
                                                                </button>
                                                            )}
                                                        </h3>
                                                        <h3><strong>{article.source.name}</strong></h3>
                                                    </div>
                                                    <h3 className='flex pl-2 w-fit text-innoColor1'><strong>{readableDate(article.publishedAt,"MMM D, YYYY")}</strong></h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                    {filteredArticles.length > articlestoShow &&(
                        <div className="flex items-center justify-center w-full mt-10 mb-5">
                            <button className="flex p-2 font-light bg-gray-300 border border-gray-200 rounded-md w-fit"
                                onClick={() => setArticlestoShow(articlestoShow + 6)}>
                                <strong>View More Articles</strong>
                            </button>
                        </div>
                    )}
                </div>
            )
        }
        return (
            <div className='flex items-center justify-center w-full p-5 text-innoColor2'>
                No articles found
            </div>
        );
    }

    return (
        <Layout pageTitle={`News App`}>
            <div className="flex flex-col w-full h-full">
                <div className="flex items-center justify-between mt-5 mb-7">
                    <h3 className="flex"><strong>World News</strong></h3>
                    <div className="flex">
                        <Link href={`/settings`}>
                            <div className={signedIn ? 'flex items-center text-innoColor1 cursor-pointer' : 'hidden'}>
                                <FiSettings/>
                                <h3 className="flex ml-2 text-[0.75rem]"><strong>My Settings</strong></h3>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col mb-10 md:flex-row">
                    <div className="flex w-full bg-gray-200 md:w-1/5 md:rounded-md md:mr-10 h-fit">
                        <SearchArticle onSearchEntered={searchArticles} onFilterArticles={getFilteredArticles} showFilterViws={articles.length > 0 ? true : false}/>
                    </div>
                    <div className="flex w-full md:w-4/5">
                        {renderArticles()}
                    </div>
                </div>
            </div>
        </Layout>
    )
}