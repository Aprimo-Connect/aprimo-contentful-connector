# Aprimo App

The Aprimo App allows content from the Aprimo DAM to be integrated with Contentful.

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
