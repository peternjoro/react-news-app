import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FaPowerOff } from "react-icons/fa";
import { useViewPortState } from '../../custom-hooks/useViewPortState';
import { loginStatus,authUser,activeState } from '../../store/userSlice';
import { alertProgress, closeAlertDialog } from '../sweetalert/alerts';

export default function Layout({ pageTitle, children }){
    const viewPortState = useViewPortState();
    const router = useRouter();
    const dispatch = useDispatch();
    const [signingOut,setSigningOut] = useState(false);
    const loggedIn = useSelector(loginStatus);
    const user = useSelector(authUser);
    const scrollPosition = viewPortState[1];

    const signOut = async () => {
        const token = localStorage.getItem('pr7rg0ko2');
        if(token)
        {
            if(!signingOut)
            {
                alertProgress("Signing out ...");
                setSigningOut(true);
                const endpoint = '/api/logout?token='+token;
                const response = await fetch(endpoint);
                const results = await response.json();
                let error = results.message;
                console.log(results);
                if(results.status){
                    error = null;
                   /* localStorage.removeItem('pr7rg0ko2');
                    dispatch(activeState({signedIn:false,user: {userId:0,authToken:'',user_name:''}}));
                    router.push(`/`);*/
                }
                localStorage.removeItem('pr7rg0ko2');
                dispatch(activeState({signedIn:false,user: {userId:0,authToken:'',user_name:'',my_sources:[],my_categories:[],my_authors:[]}}));
                router.push(`/`);
                closeAlertDialog();
                setSigningOut(false);
            }
        }
    }

    return (
        <>
            <Head>
                <meta charSet="utf-8"/>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>{ pageTitle ? pageTitle : 'News App' }</title>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com"/>
                <link rel="icon" href="/images/logo-icon1.png" />
            </Head>
            <main className={`flex flex-col main`}>
                {/** fixed nav bar at the top */}
                <div className={`fixed top-0 z-40 w-full mt-0 transition-shadow bg-white header-height ${scrollPosition > 0 ? 'shadow-md' : 'shadow-none'}`}>
                    <div className="container flex items-center justify-between h-full mx-auto">
                        <Link href={`/`}>
                            <div className="flex ml-5 cursor-pointer md:ml-0">
                                <Image priority alt="Identigate" src="/images/logo.jpg" height={50} width={150}/>
                            </div>
                        </Link>
                        <div className="flex flex-row mr-3 md:mr-0">
                            {loggedIn ? (
                                <div className='flex items-center'>
                                    <h3 className='mr-5 text-sm md:text-base'><strong>{user.user_name}</strong></h3>
                                    <div className='flex cursor-pointer' onClick={() => signOut()} title='Sign out now'><FaPowerOff /></div>
                                </div>
                            ) : (
                                <>
                                    <Link  href={`/login`} title='Login now'>
                                        <div className='mr-5 text-sm md:text-base link-hover'>
                                            Login
                                        </div>
                                    </Link>
                                    <Link  href={`/register`} title='Register now'>
                                        <div className='mr-5 text-sm md:text-base link-hover'>
                                            Register
                                        </div>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className='flex flex-grow w-full mt-20'>
                    <div className='container flex mx-auto'>
                        <div className='flex flex-col w-full ml-5 mr-3 md:ml-0 md:mr-0'>
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}