import './Home.scss';

import React, {useState, useEffect} from 'react'
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import Select from 'react-dropdown-select';
import { saveAs } from "file-saver";
// var beautify = require('js-beautify').js;

var axios = require('axios');
var qs = require('qs');

const options = [
    { value: 'Javascript', label: 'Javascript' },
    { value: 'SQL', label: 'SQL' },
    { value: 'HTML', label: 'HTML' },
    { value: 'CSS', label: 'CSS' },
    { value: 'JSON', label: 'JSON' },
  ];
const truefalseoptions = [
    { value: 'true', label: 'True' },
    { value: 'false', label: 'False' },
  ];
const indentoptions = [
    { value: '0', label: '0' },
    { value: '2', label: '2' },
    { value: '4', label: '4' },
    { value: '6', label: '6' },
    { value: '8', label: '8' },
    { value: '10', label: '10' },
  ];

var js_options = {
    'indent_size' : 2,
    "indent_with_tabs": false,
    "end_with_newline": false,
    "preserve_newlines": true,
}
var json_options = {
    'indent' : 2,
    'expand' : true,
    'strict' : false,
    'escape' : false,
    'unscape ' : false,
}

function Home() {

    const [selectedLanguage, setSelectedLanguage] = useState('Javascript');
    const [code, setCode] = useState(placeholders[selectedLanguage]);
    var out = [];

    function handleEditorChange(value, event) {
        setCode(value);
      }

    // function validate() {
    //     var data = qs.stringify({
    //         'code': code
    //       });
    //     var route = 'validatecss';
    //     var config = {
    //         method: 'post',
    //         url: 'http://localhost:8000/' + route,
    //         mode: 'no-cors',
    //         headers: { 
    //           'Content-Type': 'application/x-www-form-urlencoded'
    //         },
    //         data : data
    //       };
    //       axios(config)
    //         .then(function (response) {
    //             // console.log(response.data.data)
    //             var res = JSON.stringify(response.data);
    //             console.log(res);
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // }

    function handleEditorValidation(markers) {
        // model markers
        // console.log("onValidate:", marker.message)
        markers.forEach(marker => console.log("onValidate:", marker.message));
    }

    function handleSubmit() {
        var current_options = js_options;
        if(selectedLanguage === 'JSON') current_options = json_options;
        var data = qs.stringify({
            'code': code,
            ...current_options,
          });
        var route = 'js';
        if(selectedLanguage==='SQL') route = 'sql';
        if(selectedLanguage==='HTML') route = 'html';
        if(selectedLanguage==='CSS') route = 'css';
        if(selectedLanguage==='JSON') route = 'json';
          var config = {
            method: 'post',
            url: 'http://localhost:8000/' + route,
            mode: 'no-cors',
            headers: { 
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
          };
        axios(config)
            .then(function (response) {
                // console.log(response.data.data)
                var res = JSON.stringify(response.data);
                if(selectedLanguage === 'JSON') res = JSON.stringify(response.data.data);
                res = res.slice(1, -1);
                res = res.replace(/\\n/g, "\n");
                res = res.replace(/\\t/g, "\t");
                res = res.replace(/\\b/g, "\b");
                res = res.replace(/\\r/g, "\r");
                res = res.replace(/\\"/g, '\"');
                setCode(res);
            })
            .catch(function (error) {
                console.log(error);
            });
        }

    // useEffect(() => {
    //     console.log(code);
    //   }, [code])
    useEffect(() => {
        setCode(placeholders[selectedLanguage]);
      }, [selectedLanguage])

    return (
        <div className="home-div">
            <div className="navbar">
                <h2>{selectedLanguage} Beautifier</h2>
            </div>
            <div className="container">
                <div className="left">
                    <div className="editor">
                    <Editor
                        height="100%"
                        width="100%"
                        defaultLanguage={selectedLanguage.toLowerCase()}
                        // defaultLanguage="html"
                        path={selectedLanguage.toLowerCase()}
                        defaultValue={placeholders[selectedLanguage]}
                        theme="vs-dark"
                        onValidate={handleEditorValidation}
                        onChange={handleEditorChange}
                        value={code}
                    />
                </div>
                {/* <div className='text'>
                    <p value={out}></p>
                </div> */}
                <div className="footer">
                    <span className="button2" onClick={()=>{setCode(placeholders[selectedLanguage])}}>Sample</span>
                    {/* <span className="button2" onClick={()=>{setCode('SELECT * FROM tbl')}}>Sample SQL</span>
                    <span className="button2" onClick={()=>{setCode(placeholders['HTML'])}}>Sample HTML</span>
    <span className="button2" onClick={()=>{setCode('menu{color:red} navigation{background-color:#333}')}}>Sample CSS</span>
    <span className="button2" onClick={()=>{setCode(placeholders['JSON'])}}>Sample JSON</span> */}
                    <span className="button2">Copy</span>
                    <span className='button2'>Download</span>
                    <span className="button" onClick={handleSubmit}>Beautify</span>
                    <span className="button" >Validate</span>
                </div>
                </div>
                <div className="right">
                    <h2>Settings</h2>
                    <hr />
                    <h3>Languages</h3>
                    <Select
                        options={options}
                        onChange={(values) => {setSelectedLanguage(values[0].value)}}
                        value = {selectedLanguage}
                        placeholder = {'Javascript'}
                    />
                    {
                        selectedLanguage === 'Javascript' ? 
                        <>
                            <h3>Indent size</h3>
                            <Select
                                options={indentoptions}
                                onChange={(values) => {js_options = {...js_options, 'indent_size': values[0].value}}}
                                placeholder = {'2'}
                            />
                            <h3>Indent with tabs</h3>
                            <Select
                                options={truefalseoptions}
                                onChange={(values) => {js_options = {...js_options, 'indent_with_tabs': values[0].value}}}
                                placeholder = {'False'}
                            />
                            <h3>End with newline</h3>
                            <Select
                                options={truefalseoptions}
                                onChange={(values) => {js_options = {...js_options, 'end_with_newline': values[0].value}}}
                                placeholder = {'False'}
                            />
                            <h3>Preserve newlines</h3>
                            <Select
                                options={truefalseoptions}
                                onChange={(values) => {js_options = {...js_options, 'preserve_newlines': values[0].value}}}
                                placeholder = {'True'}
                            />
                        </> 
                        : selectedLanguage === 'JSON' ? 
                        <>
                            <h3>Indent</h3>
                            <Select
                                options={indentoptions}
                                onChange={(values) => {json_options = {...json_options, 'indent': values[0].value}}}
                                placeholder = {'2'}
                            />
                            <h3>Expand</h3>
                            <Select
                                options={truefalseoptions}
                                onChange={(values) => {json_options = {...json_options, 'expand': values[0].value}}}
                                placeholder = {'True'}
                            />
                            <h3>Escape</h3>
                            <Select
                                options={truefalseoptions}
                                onChange={(values) => {json_options = {...json_options, 'escape': values[0].value}}}
                                placeholder = {'False'}
                            />
                            <h3>Unscape</h3>
                            <Select
                                options={truefalseoptions}
                                onChange={(values) => {json_options = {...json_options, 'unscape': values[0].value}}}
                                placeholder = {'False'}
                            />
                        </> : null
                    }
                </div>
            </div>
        </div>
    )
}
export default Home


const placeholders = {
    'Javascript': '// this is text a=b\nvar a=10,b=0;',
    'SQL': 'SELECT * from table;',
    'HTML': `<Html>    
    <Head>  
    <title>  
    Example of Paragraph tag  
    </title>  
    </Head>  
    <Body>   
    <p> <!-- It is a Paragraph tag for creating the paragraph -->  
    <b> HTML </b> stands for <i> <u> Hyper Text Markup Language. </u> </i> It is used to create a web pages and applications. This language   
    is easily understandable by the user and also be modifiable. It is actually a Markup language, hence it provides a flexible way for designing the  
    web pages along with the text.   
    </p>  
    HTML file is made up of different elements. <b> An element </b> is a collection of <i> start tag, end tag, attributes and the text between them</i>.   
    </p>  
    </Body>  
    </Html> `,
    'CSS': 'menu{color:red} navigation{background-color:#333}',
    'JSON': `{  "bool": true,
    "short array": [1, 2, 3],
    "long array": [
      {"x": 1, "y": 2},
      {"x": 2, "y": 1},
      {"x": 1, "y": 1},
      {"x": 2, "y": 2}
    ]
  }`,
};