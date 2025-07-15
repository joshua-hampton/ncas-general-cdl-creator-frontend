import React from "react";
import '../../App.css'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const About = () => {
  return (
    <div className="flex justify-center">
      <div className="App sm:w-3/4 md:w-1/2">
        <h1 className="mb-5">About</h1>
        <p>This CDL Template app is designed to show what a data file that is compliant with the NCAS General should look like. By choosing an instrument, a data product, a deployment mode, and the date of the data, you can see what the CDL representation of the final netCDF file should look like, as well as see a snippet of python code that could be used to make that file.</p>
        <div className="FAQ mt-8">
          <h2 className="mb-1">Frequently Asked Questions</h2>
          <Accordion className="mt-4 mb-2 rounded-lg! bg-[#EEE9D5]!">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h2 className="AccordianHeader">What is CDL?</h2>
            </AccordionSummary>
            <AccordionDetails className="bg-gray-100">
              <p className="mt-4 text-left">CDL, short for "Common Data Language", is a representation of the contents of a netCDF file. CDL is what is returned by the <code>ncdump</code> command. In this application, none of the actual data is shown by the returned CDL code, which is the same as the <code>ncdump -h</code> command.</p>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </div>
  )
};

export default About;
