# Aprimo App

The Aprimo App allows content from the Aprimo DAM to be integrated with Contentful.

### Aprimo's Open Source Policy 
This code is provided by Aprimo _as-is_ as an example of how you might solve a specific business problem. It is not intended for direct use in Production without modification.

You are welcome to submit issues or feedback to help us improve visibility into potential bugs or enhancements. Aprimo may, at its discretion, address minor bugs, but does not guarantee fixes, vulnerability remediation or ongoing support.

It is expected that developers who clone or use this code take full responsibility for supporting, maintaining, securing, and vulnerability management of any deployments derived from it.

If you are interested in a production-ready and supported version of this solution, please contact your Aprimo account representative. They can connect you with our technical services team or a partner who may be able to build and support a packaged implementation for you.

Please note: This code may include references to non-Aprimo services or APIs. You are responsible for acquiring any required credentials or API keys to use those services—Aprimo does not provide them.

## Overview

The Aprimo App allows editors to select media from their Aprimo DAM without leaving Contentful using the [Aprimo Content Selector](https://developers.aprimo.com/digital-asset-management/aprimo-integration-tools/aprimo-content-selector/). The information about the Aprimo DAM assets are stored in Contentful for further customization.

## Requirements

To use the Aprimo App you will need:

- A content type in Contentful with a field of type JSON object to hold the reference data from Aprimo
- A log in to Aprimo

# Technical Information

## Setup

- Install [nodejs](https://nodejs.org/en)
- Run `npm install`

## Running

- `npm run start`

Create an app in Contentful to test your local development environment is working:

https://www.contentful.com/developers/docs/extensibility/app-framework/tutorial/#create-your-app-definition

## Building

- `npm run build`

This will create a `build` folder that can be deployed to Contentful.

## Publishing

After build the application (or using the Github action to execute the build), upload the package to Contentful.
# Open Source Policy

For more information about Aprimo's Open Source Policies, please refer to
https://community.aprimo.com/knowledgecenter/aprimo-connect/aprimo-connect-open-source

