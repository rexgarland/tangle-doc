# tangle-doc

[Tangle.js](http://worrydream.com/Tangle/) for the modern web.

This is meant to be as backwards-compatible as possible. The main benefit here is sourcing the code from a CDN. I also added a pure-CSS paper shadow effect.

## Usage

1. Link to CDN styles and scripts in your html header
	- `<link rel="stylesheet" type="text/css" href="https://unpkg.com/tangle-doc@^1/styles/TangleKit.css">`
	- `<script type="text/javascript" src="https://unpkg.com/tangle-doc@^1/umd/Tangle.min.js"></script>`
2. Every div with a class `Tangle` will be styled as a Tangle document (with the paper effect). All tangle classes (e.g. TKAdjustableNumber) also come with a default style. You can override any of these classes in your own stylesheets.
3. Write normal Tangle html inside your example (see the original API).
4. Use the global `Tangle` variable to instantiate a tangle object using the DOM element you chose in step (2).

```javascript
window.addEvent('domready', function () {

    var model = {
        initialize: function () {
            this.cookies = 3;
            this.caloriesPerCookie = 50;
            this.caloriesPerDay = 2100;
        },
        update: function () {
            this.calories = this.cookies * this.caloriesPerCookie;
            this.dailyPercent = 100 * this.calories / this.caloriesPerDay;
        }
    };
    
    var element = document.getElementById("cookieExample");
    if (!element) { break; }
    new Tangle(element,model);
    
});
```

## Simple example

See `example/test.html` for details.

## Contributing

If you like where this is heading, please submit an issue or PR with any suggestions.