import { useEffect, useState } from 'react'
import { CircleLoader } from "react-spinners";
import DatePicker from "react-datepicker";
import { MdOutlineRefresh } from 'react-icons/md';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Checkbox from '../../components/Checkbox/Checkbox.jsx';
import Select from '../../components/Select/Select.jsx';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import { fetchVersions, fetchInstruments, fetchProducts } from '../../api/fetch-data.jsx';

import '../../App.css';
import "react-datepicker/dist/react-datepicker.css";



//const CDL_API_BASE = 'http://localhost:8000/create-cdl'
const CDL_API_BASE = 'https://ncasdatatools.ddns.net/ncas-general-cdl/api/create-cdl'

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/vnd.github+json',
  }
}



function App() {
  const [versionNG, setVersionNG] = useState('')
  const [versionNGList, setVersionNGList] = useState([])
  const [instrument, setInstrument] = useState('')
  const [instrumentList, setInstrumentList] = useState([])
  const [dataProduct, setDataProduct] = useState('')
  const [dataProductList, setDataProductList] = useState([])
  const [deploymentMode, setDeploymentMode] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [requirementInfo, setRequirementInfo] = useState(false)
  const [startDateTextColour, setStartDateTextColour] = useState('text-gray-400')
  const [endDateTextColour, setEndDateTextColour] = useState('text-gray-400')

  const [filename, setFilename] = useState('')
  const [cdl, setCdl] = useState('')
  const [pythonSnippet, setPythonSnippet] = useState('')
  const [cdlLoading, setCdlLoading] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [requestGithubApi, setRequestGithubApi] = useState(false)
  const [apiDocumentationURL, setApiDocumentationURL] = useState('')

  const startup = async () => {
    setIsLoading(true);
    setCdl('');
    setErrorMessage('');
    try {
      const data = await fetchVersions({ API_OPTIONS });
      if (data.success) {
        setVersionNGList(data.versions);
        setVersionNG(data.versions[0]);
      } else {
        setErrorMessage(data.error || 'Failed to fetch versions');
        if (data.documentation_url) {
          setApiDocumentationURL(data.documentation_url);
          setRequestGithubApi(true);
        }
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
      setErrorMessage('Error fetching versions. Please try again later.');
    }
    try {
      const data = await fetchInstruments({ API_OPTIONS });
      if (data.success) {
        setInstrumentList(data.instruments);
      } else {
        setErrorMessage(data.error || 'Failed to fetch instruments');
        if (data.documentation_url) {
          setApiDocumentationURL(data.documentation_url);
          setRequestGithubApi(true);
        }
      }
    } catch (error) {
      console.error('Error fetching instruments:', error);
      setErrorMessage('Error fetching instruments. Please try again later.');
    }
    setIsLoading(false);
  }

  const handleCDLSubmit = async(event) => {
    event.preventDefault();
    if (!versionNG || !instrument || !dataProduct || !deploymentMode || !startDate) {// || !endDate) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    setCdlLoading(true);
    try {
      const startDateString = startDate.getFullYear().toString() + zeroPad(startDate.getMonth() + 1).toString() + zeroPad(startDate.getDate()).toString();
      const cdl_endpoint = `${CDL_API_BASE}?ncas_general_version=${versionNG}&instrument=${instrument}&data_product=${dataProduct}&deployment_mode=${deploymentMode}&start_date=${startDateString}&include_requirement_info=${requirementInfo}`;
      const cdl_response = await fetch(cdl_endpoint);
      if (!cdl_response.ok) {
        throw new Error('Failed to fetch CDL');
      }
      const cdl_data = await cdl_response.json();
      setCdl(cdl_data.cdl);
      setFilename(cdl_data.filename);
      setPythonSnippet(await makePythonSnippet(versionNG, instrument, dataProduct, deploymentMode, startDateString));
    } catch (error) {
      console.error('Error fetching CDL:', error);
      setErrorMessage('Error fetching CDL. Please try again later.');
    } finally {
      setCdlLoading(false);
    }
  }

  const makePythonSnippet = async (versionNG, instrument, dataProduct, deploymentMode, startDate) => {
    let text = `import ncas_amof_netcdf_template as nant\n`;
    text += `nc = nant.create_netcdf.main("${instrument}", products="${dataProduct}", date="${startDate}", loc="${deploymentMode}", tag="${versionNG}")`;
    return text;
  }

  const zeroPad = (num) => {
    return num < 10 ? '0' + num : num;
  }

  const handleAPIFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const apiKey = formData.get('githubApiKey');
    if (apiKey) {
      API_OPTIONS.headers.Authorization = `Bearer ${apiKey}`;
      setRequestGithubApi(false);
      setErrorMessage('');
      startup();
    } else {
      setErrorMessage('Please provide a valid GitHub API key');
    }
  }

  const handleFileDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([cdl], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${filename.split(".nc", 1)}.cdl`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element); // Clean up after download
  }

  useEffect(() => {
    startup();
  }, [])

  useEffect(() => {
    //fetchProducts();
    async function asyncFetchProducts() {
      try {
        const data = await fetchProducts({ versionNG });
        setDataProductList(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setErrorMessage('Error fetching products. Please try again later.');
      }
    }
    asyncFetchProducts();
  }, [versionNG])

  // reset end date if start date is after end date
  //useEffect(() => {
  //  if (startDate > endDate) {
  //    setEndDate(null);
  //  }
  //}, [startDate, endDate])

  useEffect(() => {
    if (startDate !== null) {
      setStartDateTextColour('text-black');
    } else {
      setStartDateTextColour('text-gray-400');
    }
  }, [startDate])

//  useEffect(() => {
//    if (endDate !== null) {
//      setEndDateTextColour('text-black');
//    } else {
//      setEndDateTextColour('text-gray-400');
//    }
//  }, [endDate])
      
  

  return (
    <div className="flex justify-center">
      <div className="App w-[95%] sm:w-3/4">
        <div className="header mb-4">
          <h1 className="text-2xl">NCAS General Data Standard CDL Template</h1>
        </div>
        {isLoading ? (
          <div className="flex justify-center">
            <CircleLoader color="#186f4d" />
          </div>
        ) : requestGithubApi ? (
          <div>
            <p className="text-red-500">Please provide a GitHub API key to continue, or try again later</p>
            <p>GitHub enforces a rate limit on requests, which has been exceeded. However, authenticated reqeusts get a higher rate limit. See <a href={apiDocumentationURL}>{apiDocumentationURL}</a> for more detail.</p>
            <form method="post" onSubmit={handleAPIFormSubmit}>
              <input className="border border-gray-300 rounded-lg p-2 mb-4" name="githubApiKey" type="text" placeholder="GitHub API Key" />
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:cursor-pointer">
                Submit
              </button>
            </form>
          </div>
        ) : errorMessage ? (
          <>
            <p className="text-red-500">{errorMessage}</p>
            <button onClick={startup} className="mt-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:cursor-pointer"><MdOutlineRefresh /></button>
          </>
        ) : (
          <>      
            <div className="selection">
              <form onSubmit={handleCDLSubmit}>
                <Select
                  value={versionNG}
                  setValue={setVersionNG}
                  options={versionNGList}
                  name="NCAS General Version"
                />
                <Select
                  value={instrument}
                  setValue={setInstrument}
                  options={instrumentList}
                  name="instrument"
                />
                <Select
                  value={dataProduct}
                  setValue={setDataProduct}
                  options={dataProductList}
                  name="data product"
                />
                <Select
                  value={deploymentMode}
                  setValue={setDeploymentMode}
                  options={["land","sea","air"]}
                  name="deployment mode"
                />
                <DatePicker
                  className={`${startDateTextColour} border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-50 rounded-lg border shadow-sm`}
                  dateFormat="yyyy/MM/dd"
                  placeholderText="Select start date of data"
                  onChange={(date) => setStartDate(date)}
                  selected={startDate}
                />
                <Checkbox id="requirementCheckbox" checked={requirementInfo} onChange={setRequirementInfo} /> 
                <br />
                <button 
                  type="submit"
                  className="mt-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:cursor-pointer"
                >
                  Create CDL
                </button>
              </form>
            </div>
            {cdlLoading ? (
              <div className="flex justify-center mt-5">
                <CircleLoader color="#186f4d" />
              </div>
            ) : cdl ? (
              <div className="results mt-5">
                <Accordion className="mb-2 rounded-lg! AccordionHeader" sx={{ bgcolor: '#eee9d5' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <h2>See how to make this file in Python</h2>
                  </AccordionSummary>
                  <AccordionDetails className="bg-gray-100 dark:bg-[#313244] dark:text-[#cdd6f4]">
                    <pre className="text-left p-5 border">{pythonSnippet}</pre>
                    <p className="mt-4 text-left">This uses the <code>ncas_amof_netcdf_template</code> package. For more detail, see the <a href="https://ncas-amof-netcdf-template.readthedocs.io/en/stable/index.html" target="_blank">documentation pages</a>.</p>
                  </AccordionDetails>
                </Accordion>
                <pre className="bg-gray-100 dark:bg-[#313244] p-4 rounded-lg text-left text-wrap">{cdl}</pre>
                <button className="mt-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:cursor-pointer" onClick={handleFileDownload}>Download CDL</button>
              </div>
            ) : (
              <div></div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App
