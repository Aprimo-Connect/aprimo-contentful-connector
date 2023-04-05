import { setup } from "@contentful/dam-app-base";

import logo from "./logo.svg";
import "./index.css";

const CTA = "Browse Aprimo";

setup({
  cta: CTA,
  name: "Aprimo for Contentful",
  logo,
  color: "#005F7F",
  description:
    "The Aprimo for Contentful app allows editors to select media from the Aprimo DAM.",
  parameterDefinitions: [
    {
      id: "aprimoTenantName",
      type: "Symbol",
      name: "Arimo Tenant Name",
      description:
        "Enter the name of your Aprimo DAM tenant (e.g. mytenant if your Aprimo DAM URL is https://mytenant.dam.aprimo.com)",
      required: true,
    },
  ],
  validateParameters,
  makeThumbnail,
  // We cannot use renderDialog because of the required authentication flow
  renderDialog: () => {},
  openDialog,
  isDisabled: () => false,
});

function makeThumbnail(attachment) {
  const thumbnail = attachment.rendition.publicuri;
  const url = typeof thumbnail === "string" ? thumbnail : undefined;
  const alt = attachment.title || attachment.id;
  return [url, alt];
}

const selectorOptions = {
  title: "Select File",
  description: "Select the file to import.",
  limitingSearchExpression: "",
  accept: "Select",
  select: "singlerendition",
  facets: ["TextFilter"],
};

let contentSelectorWindowReference;
async function openDialog(sdk, _, config) {
  if (isContentSelectorAlreadyOpen()) {
    contentSelectorWindowReference.focus();
    return [];
  }

  const aprimoDamOrigin = getAprimoDamOrigin(config, sdk);

  const result = await openContentSelector(aprimoDamOrigin, selectorOptions);

  if (!Array.isArray(result)) {
    return [];
  }

  return result;
}

function isContentSelectorAlreadyOpen() {
  if (
    contentSelectorWindowReference &&
    !contentSelectorWindowReference.closed
  ) {
    return true;
  }

  return false;
}

function openContentSelector(aprimoDamOrigin, selectorOptions) {
  const encodedOptions = window.btoa(JSON.stringify(selectorOptions));
  const aprimoContentSelectorUrl = `${aprimoDamOrigin}/dam/selectcontent#options=${encodedOptions}`;

  return new Promise((resolve) => {
    const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=1000,height=600,left=100,top=100`;
    contentSelectorWindowReference = window.open(
      aprimoContentSelectorUrl,
      "selector",
      params
    );
    window.addEventListener(
      "message",
      (e) => {
        if (e.origin !== aprimoDamOrigin) {
          return;
        }

        const { result, selection } = e.data;
        if (!result) {
          return;
        }

        if (result !== "accept" || !selection || selection.length === 0) {
          resolve([]);
          return;
        }

        resolve(selection);
      },
      false
    );
  });
}

function getAprimoDamOrigin(config, sdk) {
  const aprimoTenantName = getAprimoTenantName(config, sdk);

  if (!aprimoTenantName) {
    return null;
  }

  return `https://${aprimoTenantName}.dam.aprimo.com`;
}

function getAprimoTenantName(config, sdk) {
  if (config["aprimoTenantName"]) {
    return config["aprimoTenantName"];
  }

  if (sdk.parameters.instance["aprimoTenantName"]) {
    return sdk.parameters.instance["aprimoTenantName"];
  }

  if (sdk.parameters.installation["aprimoTenantName"]) {
    return sdk.parameters.installation["aprimoTenantName"];
  }

  return null;
}

function validateParameters({ aprimoTenantName }) {
  if (!aprimoTenantName) {
    return "Please provide an Aprimo tenant name.";
  }

  return null;
}
