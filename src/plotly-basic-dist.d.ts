// plotly.js-basic-dist ships no typings of its own, it is the same API as plotly.js (whose 4.x typings are bundled)
declare module 'plotly.js-basic-dist' {
    import Plotly from 'plotly.js';
    export default Plotly;
}
