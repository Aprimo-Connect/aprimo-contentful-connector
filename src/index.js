import { setup } from "@contentful/dam-app-base";

import logo from "./logo.png";
import "./index.css";

import {
  renderDialog as dialogRenderDialog,
  openDialog as dialogOpenDialog,
} from "./dialog";
import {
  renderDialog as popupRenderDialog,
  openDialog as popupOpenDialog,
} from "./popup";

import { makeThumbnail } from "./util";

const popup = {
  renderDialog: popupRenderDialog,
  openDialog: popupOpenDialog,
};

const dialog = {
  renderDialog: dialogRenderDialog,
  openDialog: dialogOpenDialog,
};

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
      id: "aprimoTenantUrl",
      type: "Symbol",
      name: "Arimo URL",
      description:
        "Enter the URL of your Aprimo DAM tenant (e.g. https://mytenant.dam.aprimo.com)",
      required: true,
    },
    {
      id: "type",
      type: "List",
      name: "Integration Type (testing)",
      description:
        "Choose 'popup' if you cannot log in with an iframe. Otherwise choose 'dialog'.",
      value: "dialog,popup",
      default: "dialog",
      required: true,
    },
  ],
  validateParameters,
  makeThumbnail,
  renderDialog(sdk) {
    return chooseAppType(sdk.parameters.installation).renderDialog(sdk);
  },
  openDialog(sdk, currentValue, config) {
    return chooseAppType(sdk.parameters.installation).openDialog(
      sdk,
      currentValue,
      config
    );
  },
  isDisabled: () => false,
});

function validateParameters({ aprimoTenantUrl }) {
  if (!aprimoTenantUrl) {
    return "Please provide an Aprimo DAM URL.";
  }

  return null;
}

function chooseAppType({ type }) {
  if (type === "popup") {
    return popup;
  } else {
    return dialog;
  }
}
