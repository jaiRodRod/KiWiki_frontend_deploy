import { useEffect, useState } from "react";
import { formatDate } from "../Common/CommonOperations";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import SingleVersionSection from "../Version/SingleVersionSection";
import VersionHistory from "../Version/VersionHistory";
import Navbar from '../Common/NavBar';
import CommentaryComponent from "../Commentary/CommentaryComponent";

import "../Common/CSS/commonCSS.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import url from '../url.json';

function DetailedEntry() {

  const location = useLocation();
  const { id } = location.state || {};

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showHistory, setShowHistory] = useState(false);

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let localUrl = `${url.active_urlBase}/entries/` + id;
        const response = await axios.get(localUrl);
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateActualVersion = (newVersionID) => {
    setData((prevData) => ({
      ...prevData,
      actual_version: newVersionID,
    }));
  };

  const handleAnchorClick = (event) => {
    if (event.target.tagName === 'A') {
      event.preventDefault();
      const targetId = event.target.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (loading) return <p>Cargando... (ESTO ES UN PLACEHOLDER DE UN COMPONENTE DE CARGA)</p>;
  if (error) return <p>Error: {error} (ESTO ES UN PLACEHOLDER DE UN COMPONENTE ERROR)</p>;

  return (
      <div onClick={handleAnchorClick} className="min-h-screen bg-gray-100 text-black">
        <Navbar/>
        <div className="p-5 w-full sm:w-5/6 md:w-5/6 lg:w-4/6 mx-auto rounded-lg shadow-2xl bg-white">
            <ArrowBackIcon className="hover:cursor-pointer" onClick={handleBack}/>
            <h1 className="pt-4 text-3xl font-bold">{data.title}</h1>

            <div className="flex justify-end p-2 gap-3">
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 mt-3 px-4 rounded-full" onClick={() => setShowHistory(!showHistory)}>
                {showHistory ? "Ocultar Historial" : "Ver Historial"}
              </button>
            </div>

            {showHistory ? (
              <VersionHistory entryID={data._id} onVersionChange={updateActualVersion}/>
            ) : (
              <div>
                <div className="flex gap-3">
                  <span className="text-xs">Creado: {formatDate(data.creationDate)}</span><br/>
                  <span className="text-xs" >Redactor: {data.creator}</span><br/>
                </div>
                <span className="block text-base text-gray-700">{data.description}</span>
                <hr className="w-1/4 h-1 mx-auto my-4 bg-gray-900 border-0 rounded md:my-10 dark:bg-gray-700"></hr>
                <SingleVersionSection entryVersionID={data.actual_version} redactor={data.creator}/>
                <CommentaryComponent entryID={data._id} entryVersionID={data.actual_version} />
              </div>
            )}
          </div>
      </div>
  );
}

export default DetailedEntry;
