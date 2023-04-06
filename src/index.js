import { setup } from "@contentful/dam-app-base";

import logo from "./logo.png";
import "./index.css";

import { renderDialog, openDialog } from "./dialog";
// import { renderDialog, openDialog } from "./popup";

import { makeThumbnail } from "./util";

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
        "Enter the URL of your Aprimo DAM tenant (e.g.https://mytenant.dam.aprimo.com)",
      required: true,
    },
  ],
  validateParameters,
  makeThumbnail,
  // We cannot use renderDialog because of the required authentication flow
  renderDialog,
  openDialog,
  isDisabled: () => false,
});

function validateParameters({ aprimoTenantUrl }) {
  if (!aprimoTenantUrl) {
    return "Please provide an Aprimo DAM URL.";
  }

  return null;
}
