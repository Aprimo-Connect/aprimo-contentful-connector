import { selectorOptions } from "./config";
import {
  contentSelectorPostMessageCallbackHandlerBuilder,
  getAprimoContentSelectorUrl,
  getAprimoDamOrigin,
} from "./util";

export function renderDialog(sdk) {
  const config = sdk.parameters.invocation;

  const { aprimoDamOrigin } = config;

  const container = document.createElement("div");

  const iframe = document.createElement("iframe");
  iframe.id = "aprimo-contentselector";
  iframe.src = getAprimoContentSelectorUrl(
    aprimoDamOrigin,
    selectorOptions,
    sdk
  );
  iframe.width = 650;
  iframe.height = 650;
  iframe.style.border = "none";
  container.appendChild(iframe);

  document.body.appendChild(container);

  sdk.window.startAutoResizer();

  window.addEventListener(
    "message",
    contentSelectorPostMessageCallbackHandlerBuilder(
      aprimoDamOrigin,
      (selection) => sdk.close(selection)
    )
  );
}

export async function openDialog(sdk, _, config) {
  console.log(sdk);

  const result = await sdk.dialogs.openCurrentApp({
    position: "center",
    title: "Browse Aprimo",
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    parameters: { aprimoDamOrigin: getAprimoDamOrigin(config) },
    width: 650,
    allowHeightOverflow: true,
  });

  if (!Array.isArray(result)) {
    return [];
  }

  return result;
}
