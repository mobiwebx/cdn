# Grapesjs Fonts

Custom Fonts plugin for grapesjs

> This code is part of a bigger project: [about Silex v3](https://www.silexlabs.org/silex-v3-kickoff/)

## About this plugin

Links

* [DEMO on Codepen](https://codepen.io/lexoyo/full/zYLWdxY)
* [Npm package](https://www.npmjs.com/package/@silexlabs/grapesjs-fonts)
* [Discussion about ongoing developments](https://github.com/artf/grapesjs/discussions/4858#discussioncomment-4756119)

It looks like this:

![Screenshot from 2023-01-20 16-20-56](https://user-images.githubusercontent.com/715377/213734511-7e66175b-cb72-4a61-b215-2af64f5d532c.png)
![Screenshot from 2023-01-20 16-19-41](https://user-images.githubusercontent.com/715377/213734520-adc1072f-ed94-4a01-b1e0-3560a6816083.png)


The plugin currently has these features

* [x] API to add / remove fonts from the site (from goole font name) 
* [x] Updates the DOM and the "font family" dropdown
* [x] Save the fonts with the site data
* [x] Load the fonts when site data is loaded (add to the DOM on load)
* [x] UI to manage fonts
* [x] Integration with google API
* [x] Store google fonts list in local storage for performance and API quotas
* [x] Generate HTML imports for the final website
* [x] Support [Google fonts proxies, e.g fontlay](https://fontlay.com/) and a [privacy-friendly drop-in replacement for Google Fonts, e.g coollabsio's fonts server](https://github.com/coollabsio/fonts)
* [ ] Generate CSS imports for the final website
* [ ] Handle variants and weights
* [ ] Google fonts V3 API

### Limitations

For now this plugin supports only Goolge fonts and use the V2 API. It should be upgraded to V3 and take advantage of variable fonts.

### Export / publication

In your app you probaly publish / export the website to a final format (html, css, js, images, etc).

You need to add the font to the final website when you publish/export it, this is not done by the plugin. You can use the provided commands `get-fonts-css` OR `get-fonts-html` to get the code to add to the final website.

```js
// get the CSS to add to the final website
const css = editor.runCommand('get-fonts-css')
// Here css is like @import url('https://fonts.googleapis.com/css2?family=Protest+Strike&display=swap')
```

Or ues the `get-fonts-import-html` command to get the HTML to add to the final website

```js
// get the HTML to add to the final website
const html = editor.runCommand('get-fonts-html')
// Here html is like <link href="https://fonts.googleapis.com/css2?family=Protest+Strike&display=swap" rel="stylesheet">
```

You can check how it is done in [Silex website builder](https://github.com/silexlabs/Silex/blob/dev/src/ts/client/publish-fonts.ts)

### Motivations

I saw discussions and issues like "How can i add custom fonts in grapesjs editor? #4563" 

What seems to work for me is

1. update the "font family" dropdown
    ```
    const styleManager = editor.StyleManager
    const fontProperty = styleManager.getProperty('typography', 'font-family')
    fontProperty.setOptions(fonts)
    styleManager.render()
    ```
1. update the DOM to display the font correctly: add style elements to the editor.Canvas.getDocument()

This is quite easy but here are the things which took me time as I implemented google fonts

* use google fonts api to select fonts and get their name, variants, weights
* build the URL of the fonts to load
* the UI to manage and install fonts

## Use the plugin in your website builder

### HTML

```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet">
<script src="https://unpkg.com/grapesjs"></script>
<script src="https://unpkg.com/@silexlabs/grapesjs-fonts"></script>

<div id="gjs"></div>
```

### JS
```js
const editor = grapesjs.init({
  container: '#gjs',
  height: '100%',
  fromElement: true,
  storageManager: false,
  plugins: ['@silexlabs/grapesjs-fonts'],
});
```

This will make sure the fonts are saved and loaded with the website data

Here is how to open the fonts dialog:

```js
editor.runCommand('open-fonts')
```

### CSS

```css
body, html {
  margin: 0;
  height: 100%;
}
```

Also you should style the dialog:

```css
.silex-form select {
  ...
}
```

## Options

The options `api_url` and `server_url` are used to support Google fonts proxies, e.g fontlay and a privacy-friendly drop-in replacement for Google Fonts, e.g coollabsio's fonts server. Their default values are the Google fonts API and server.

| Option | Description | Default |
|-|-|-
| `api_key` | Google fonts API key, [see this doc to get an API key](https://developers.google.com/fonts/docs/developer_api#APIKey) | Required |
| `api_url` | Fonts API | `https://www.googleapis.com` |
| `server_url` | Fonts server | `https://fonts.googleapis.com` |

## Download

* CDN
  * `https://unpkg.com/@silexlabs/grapesjs-fonts`
* NPM
  * `npm i @silexlabs/grapesjs-fonts`
* GIT
  * `git clone https://github.com/silexlabs/grapesjs-fonts.git`



## Usage

Directly in the browser
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet"/>
<script src="https://unpkg.com/grapesjs"></script>
<script src="path/to/grapesjs-fonts.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
      container: '#gjs',
      // ...
      plugins: ['@silexlabs/grapesjs-fonts'],
      pluginsOpts: {
        '@silexlabs/grapesjs-fonts': {
          api_key: '...',
        }
      }
  });
</script>
```

Modern javascript

```js
import grapesjs from 'grapesjs';
import plugin from '@silexlabs/grapesjs-fonts';
import 'grapesjs/dist/css/grapes.min.css';

const editor = grapesjs.init({
  container : '#gjs',
  // ...
  plugins: [plugin],
  pluginsOpts: {
    [plugin]: {
      api_key: '...',
    }
  }
  // or
  plugins: [
    editor => plugin(editor, {
      api_key: '...',
    }),
  ],
});
```

## Development

Clone the repository

```sh
$ git clone https://github.com/silexlabs/grapesjs-fonts.git
$ cd grapesjs-fonts
```

Install dependencies

```sh
$ npm i
```

Start the dev server

```sh
$ npm start
```

Build the source

```sh
$ npm run build
```

## License

MIT

