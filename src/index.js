import { setup } from '@contentful/dam-app-base';
import { EntityList } from '@contentful/f36-components';
import { useEffect, useState } from 'react';
import { render } from 'react-dom';
import './index.css';
import { pick } from './utils';

const CTA = 'Browse Aprimo';
const FIELDS_TO_PERSIST = ['id', 'name', 'url'];

setup({
  cta: CTA,
  name: 'Aprimo for Contentful',
  logo: 'https://images.ctfassets.net/fo9twyrwpveg/6eVeSgMr2EsEGiGc208c6M/f6d9ff47d8d26b3b238c6272a40d3a99/contentful-logo.png',
  color: '#036FE3',
  description:
    'This is a sample Application to demonstrate how to make a custom DAM (Digital Asset Management) application on top of Contentful.',
  parameterDefinitions: [
    {
      id: 'apiKey',
      type: 'Symbol',
      name: 'API Key',
      description: 'Provide the API key here',
      required: true,
    },
    {
      id: 'projectId',
      type: 'Number',
      name: 'Project Id',
      description: 'Provide the Project Id here',
      required: true,
    },
  ],
  validateParameters,
  makeThumbnail,
  renderDialog,
  openDialog,
  isDisabled: () => false,
});

function DialogLocation({ sdk }) {
  const apiKey = sdk.parameters.installation.apiKey;
  const projectId = sdk.parameters.installation.projectId;

  const [damData, setDAMData] = useState();
  useEffect(() => {
    const fetchAssets = async () => {
      const response = await fetch(
        `/dam_api_response.json?api_key=${apiKey}&project_id=${projectId}`
      );
      return response.json();
    };

    fetchAssets().then(setDAMData);
  }, [apiKey, projectId]);

  if (damData === undefined) {
    return <div>Please wait</div>;
  }

  return (
    <EntityList>
      {damData.map((item) => (
        <EntityList.Item
          key={item.id}
          title={item.name}
          description="Description"
          thumbnailUrl={item.url}
          onClick={() => sdk.close([item])}
        />
      ))}
    </EntityList>
  );
}

function makeThumbnail(attachment) {
  const thumbnail = attachment.url;
  const url = typeof thumbnail === 'string' ? thumbnail : undefined;
  const alt = attachment.name;
  return [url, alt];
}

async function renderDialog(sdk) {
  render(<DialogLocation sdk={sdk} />, document.getElementById('root'));
  sdk.window.startAutoResizer();
}

async function openDialog(sdk, _currentValue, _config) {
  
  
  var selectorOptions = {
    title: 'Select File',
    description: 'Select the file to import.',
    limitingSearchExpression: "",
    accept: 'Select',
    select: 'singlerendition',
    facets: ['TextFilter', 'File Type', 'License Type', 'Country', 'Asset Status', 'Aprimo Smart Tags']
  };

  
  var tenant = "productstrategy1";
  var encodedOptions = window.btoa(JSON.stringify(selectorOptions));
  const tenantUrl = `https://${tenant}.dam.aprimo.com`
  var aprimoContentSelectorUrl = `${tenantUrl}/dam/selectcontent#options=${encodedOptions}`;

  const handleMessageEvent = (event) => {
    // Ensure only messages from the Aprimo Content Selector are handled.
    if (event.origin !== tenantUrl) {
        return;
    }
    if (event.data.result === 'cancel') {
  
    } else {
        const ids = event.data.selection.map((selection) => selection.id)
        console.log(ids); 
    }
  }
  
  let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=1000,height=600,left=100,top=100`;
  window.open(aprimoContentSelectorUrl, 'selector', params);
  
  
  window.addEventListener("message", handleMessageEvent, false);
  //const button = document.getElementById('openSelector');
  //button.addEventListener('click', openSelector);

  /*const result = await sdk.dialogs.openCurrentApp({
    position: 'center',
    title: CTA,
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    width: 400,
    allowHeightOverflow: true,
  });

  if (!Array.isArray(result)) {
    return [];
  }

  return result.map((asset) => pick(asset, FIELDS_TO_PERSIST));*/
}

function validateParameters({ apiKey, projectId }) {
  if (!apiKey) {
    return 'Please add an API Key';
  }

  if (!projectId) {
    return 'Please add a Project Id';
  }

  return null;
}
