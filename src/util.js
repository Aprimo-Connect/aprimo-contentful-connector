const URL_SCHEME_REGEX = /^https?:\/\//;

function isFullUrl(url) {
  return URL_SCHEME_REGEX.test(url);
}

function getAprimoTenantUrl(config, sdk) {
  if (config["aprimoTenantUrl"]) {
    return config["aprimoTenantUrl"];
  }

  if (sdk.parameters.instance["aprimoTenantUrl"]) {
    return sdk.parameters.instance["aprimoTenantUrl"];
  }

  if (sdk.parameters.installation["aprimoTenantUrl"]) {
    return sdk.parameters.installation["aprimoTenantUrl"];
  }

  return null;
}

export function getAprimoDamOrigin(config, sdk) {
  let aprimoTenantUrl = getAprimoTenantUrl(config, sdk);

  if (!aprimoTenantUrl) {
    return null;
  }

  // Maybe they just entered the Aprimo tenant name
  if (
    aprimoTenantUrl.indexOf(".") === -1 &&
    aprimoTenantUrl.indexOf("localhost") === -1
  ) {
    aprimoTenantUrl = `https://${aprimoTenantUrl}.dam.aprimo.com`;
  }

  // Make sure the URL has a scheme
  if (!isFullUrl(aprimoTenantUrl)) {
    aprimoTenantUrl = `https://${aprimoTenantUrl}`;
  }

  const parsedUrl = new URL(aprimoTenantUrl);

  return parsedUrl.origin;
}

export function getAprimoContentSelectorUrl(aprimoDamOrigin, selectorOptions) {
  const encodedOptions = window.btoa(JSON.stringify(selectorOptions));
  const aprimoContentSelectorUrl = new URL(
    "/dam/selectcontent",
    aprimoDamOrigin
  );
  if (aprimoContentSelectorUrl.hostname === "localhost") {
    aprimoContentSelectorUrl.pathname = "/selectcontent";
  }
  aprimoContentSelectorUrl.hash = `#options=${encodedOptions}`;

  return aprimoContentSelectorUrl;
}

export function contentSelectorPostMessageCallbackHandlerBuilder(origin, cb) {
  return (e) => {
    if (e.origin !== origin) {
      return;
    }

    const { result, selection } = e.data;
    if (!result) {
      return;
    }

    if (result !== "accept" || !selection || selection.length === 0) {
      cb([]);
    }

    console.log("selection", selection);

    for (const asset of selection) {
      if (!isFullUrl(asset.rendition.publicuri)) {
        asset.rendition.publicuri = new URL(
          asset.rendition.publicuri,
          origin
        ).href;
      }
    }

    cb(selection);
  };
}

export function makeThumbnail(attachment) {
  const thumbnail = attachment.rendition.publicuri;
  const url = typeof thumbnail === "string" ? thumbnail : undefined;
  const alt = attachment.title || attachment.id;
  return [url, alt];
}