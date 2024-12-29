import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
//import apiEndpoint from '../assets/apiEndpoints.json'
import SingleEntry from './SingleEntry'
import Navbar from '../Common/NavBar'
import EntryFilter from "./EntryFilter";

import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import axios from "axios";
import { useSession } from '../Common/SessionProvider'

import url from '../url.json';

function ListEntries(){

    const location = useLocation()
    const {id, name} = location.state || {}
    const { user } = useSession();

    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    }

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [formState,setFormState] = useState({
        year: "",
        month: "",
        day: "",
        description: "",
        tags: [],
    });

    let urlApi = ''

    useEffect(() => {
        getData()
    },[id])

    const getData = async() => {
        urlApi = url.active_urlBase + '/wikis/' + `${id}` + '/entries';
        console.log(urlApi)
        try{
            const response = await axios.get(urlApi)
            console.log(response)
            setData(response.data)
        }catch(err){
            setError(err.message)
        }finally{
            setLoading(false)
        }
    };


    const handleFilterEntry = async(e) => {
        e.preventDefault();

        let filterURL = url.active_urlBase + `/entries/?wiki=${id}`;

        if (formState.year) filterURL += `&year=${formState.year}`;
        if (formState.month) filterURL += `&month=${formState.month}`;
        if (formState.day) filterURL += `&day=${formState.day}`;
        if (formState.description) filterURL += `&description=${formState.description}`;
        if (formState.tags && formState.tags.length > 0) {
            formState.tags.forEach((tag) => {
                filterURL += `&tags=${tag}`;
            });
        }

        try {
            const response = await axios.get(filterURL);
            setData(response.data);
        } catch (err) {
            setError(err.message);
        }
    };

    return(
        <div className="min-h-screen bg-gray-100 text-black">
            <Navbar/>

            <div className='w-full sm:w-5/6 md:w-5/6 lg:w-4/6 mx-auto rounded-lg shadow-2xl bg-white'>
            <section className='flex flex-grow flex-col p-8 gap-3'>
                <ArrowBackIcon className="hover:cursor-pointer" onClick={handleBack}/>
                <EntryFilter formState={formState} setFormState={setFormState} handleFilterEntry={handleFilterEntry} />
                <h1 className='w-full text-center text-2xl font-bold border-b border-gray-600 mb-4'>Listado de entradas de {name} </h1>
                {
                data != null &&  data.map(item => (
                        <SingleEntry key={item._id} item={item} wiki_id={id} setData={setData}></SingleEntry>
                    ))
                }
                {((user?.rol === 'ADMIN') || (user?.rol === 'EDITOR') || (user?.rol === 'REDACTOR'))&& (
                <Link className='w-16 h-16 m-16 fixed bottom-0 right-0' to={`/wikis/${id}/create`}>
                    <AddCircleIcon style={{width:'100%', height:'100%'}} fontSize="large" color='success'></AddCircleIcon>
                </Link>
                )}
            </section>
            </div>
        </div>

    );


}

export default ListEntries;