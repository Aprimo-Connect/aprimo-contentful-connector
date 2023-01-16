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
  color: '#005F7F',
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
  renderDialog : () => null,
  openDialog,
  isDisabled: () => false,
});

function makeThumbnail(attachment) {
  const thumbnail = attachment.rendition.publicuri;
  const url = typeof thumbnail === 'string' ? thumbnail : undefined;
  const alt = attachment.id;
  return [url, alt];
}

async function openDialog(sdk, _currentValue, _config) {
  
  // Set the ContentSelector options to Public Links mode.
  var selectorOptions = {
    title: 'Select File',
    description: 'Select the file to import.',
    limitingSearchExpression: "",
    accept: 'Select',
    select: 'singlerendition',
    facets: ['TextFilter']
  };
  
  var tenant = "productstrategy1";
  var encodedOptions = window.btoa(JSON.stringify(selectorOptions));
  const tenantUrl = `https://${tenant}.dam.aprimo.com`
  var aprimoContentSelectorUrl = `${tenantUrl}/dam/selectcontent#options=${encodedOptions}`;


  function handleMessageEvent(event)  {
    // Ensure only messages from the Aprimo Content Selector are handled.
    if (event.origin !== tenantUrl) {
        return;
    }
    if (event.data.result === 'cancel') {
  
    } else {
        console.log(event);
        const ids = event.data.selection.map((selection) => selection.id)
        console.log(ids); 
        sdk.field.setValue(event.data.selection);
    }
  }
  
  let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=1000,height=600,left=100,top=100`;
  window.open(aprimoContentSelectorUrl, 'selector', params);
  
  window.addEventListener("message", handleMessageEvent, false);

  return [];

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
