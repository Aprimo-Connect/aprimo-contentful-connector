import {
  Asset,
  BaseExtensionSDK,
  DialogExtensionSDK,
} from "@contentful/app-sdk";
import { selectorOptions } from "./config";
import {
  contentSelectorPostMessageCallbackHandlerBuilder,
  getAprimoContentSelectorUrl,
  getAprimoDamOrigin,
} from "./util";
import { Config } from "@contentful/dam-app-base";

let contentSelectorWindowReference: Window | null = null;

function isContentSelectorAlreadyOpen() {
  if (
    contentSelectorWindowReference &&
    !contentSelectorWindowReference.closed
  ) {
    return true;
  }

  return false;
}

function openContentSelector(
  aprimoDamOrigin: string,
  selectorOptions: any,
  sdk: BaseExtensionSDK
) {
  const aprimoContentSelectorUrl = getAprimoContentSelectorUrl(
    aprimoDamOrigin,
    selectorOptions,
    sdk
  );

  return new Promise((resolve) => {
    const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=1000,height=600,left=100,top=100`;
    contentSelectorWindowReference = window.open(
      aprimoContentSelectorUrl.toString(),
      "selector",
      params
    );
    window.addEventListener(
      "message",
      contentSelectorPostMessageCallbackHandlerBuilder(
        aprimoDamOrigin,
        (selection) => resolve(selection)
      )
    );
  });
}

export function renderDialog(sdk: DialogExtensionSDK) {}

export async function openDialog(
  sdk: DialogExtensionSDK,
  config: Config
): Promise<Asset[]> {
  if (isContentSelectorAlreadyOpen()) {
    contentSelectorWindowReference?.focus();
    return [];
  }

  const aprimoDamOrigin = getAprimoDamOrigin(config)!;

  const result = await openContentSelector(
    aprimoDamOrigin,
    selectorOptions,
    sdk
  );

  if (!Array.isArray(result)) {
    return [];
  }

  return result;
}
