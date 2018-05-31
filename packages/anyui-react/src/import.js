
export function retrieveNpm(name, version, path) {
    return fetch(`https://unpkg.com/${name}@${version}/${path}`).then(r => r.text());
}

function loadScript(code){
    return new Promise(function(resolve, reject) {
        var el = document.createElement('script');
        el.appendChild(document.createTextNode(code));
        el.onload = resolve;
        document.head.appendChild(el);
    });
}

export function dynamicImport(code) {
    /*
    Example, Convert to module, exports, require
    (function () {
        var define, exports = {};
        if (window.define && window.define.amd) {
            define = window.define;
        } else {
            exports = window;
            define = function (name, dependencies, fn) {
                var deps = [];
                for (var i = 0; i < dependencies.length; i++)
                    deps.push(window[dependencies[i]]);
                var module = fn.apply(undefined, deps);
                if (!window[name]) window[name] = module;
            };
        }

        define('mylib.interaction', ['jQuery', 'mylib.core', 'jQuery.UI'], function($, mylib) {
            return ;
        })
    })()
    */

    // TODO dont expose REACT to window
    return loadScript(code).then(() => window.React);
}

