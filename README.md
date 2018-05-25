<div>
    <a href="https://github.com/fru/anyform">
        <img src="/packages/readme-resources/header.png" align="right" height="95px"/>
    </a>
    <a href="goto_demo_readme">
        <img src="/packages/readme-resources/demo.gif" align="right" width="476px"/>
    </a>
</div>

# Usage

Install anyform and a [component set](https://www.google.com):

```bash
npm install -s anyform-react
npm install -s anyform-set-default
```

Embed the editor into your app:

```jsx
import Any from 'anyform-react';
import set from 'anyform-set-default';

// In the intended render method add:
<Any.Editor components={set} />
```
<br />

## Content

* [Common usage](#common-usage)
* [Installation](#installation)
    * [Node projects](#node-projects)
    * [Web projects](#web-projects)
* [Parameters](#parameters)
    * [Aliases](#aliases)
    * [Sequence](#sequence)
