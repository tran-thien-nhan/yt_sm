"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[8625,5655],{94854:e=>{function a(e){!function(e){var a=e.languages.javadoclike={parameter:{pattern:/(^[\t ]*(?:\/{3}|\*|\/\*\*)\s*@(?:arg|arguments|param)\s+)\w+/m,lookbehind:!0},keyword:{pattern:/(^[\t ]*(?:\/{3}|\*|\/\*\*)\s*|\{)@[a-z][a-zA-Z-]+\b/m,lookbehind:!0},punctuation:/[{}]/};Object.defineProperty(a,"addSupport",{value:function(a,n){"string"===typeof a&&(a=[a]),a.forEach((function(a){!function(a,n){var t="doc-comment",s=e.languages[a];if(s){var r=s[t];if(!r){var o={};o[t]={pattern:/(^|[^\\])\/\*\*[^/][\s\S]*?(?:\*\/|$)/,lookbehind:!0,alias:"comment"},r=(s=e.languages.insertBefore(a,"comment",o))[t]}if(r instanceof RegExp&&(r=s[t]={pattern:r}),Array.isArray(r))for(var i=0,p=r.length;i<p;i++)r[i]instanceof RegExp&&(r[i]={pattern:r[i]}),n(r[i]);else n(r)}}(a,(function(e){e.inside||(e.inside={}),e.inside.rest=n}))}))}}),a.addSupport(["java","javascript","php"],a)}(e)}e.exports=a,a.displayName="javadoclike",a.aliases=[]},44304:(e,a,n)=>{var t=n(94854),s=n(93336);function r(e){e.register(t),e.register(s),function(e){var a=e.languages.javascript,n=/\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})+\}/.source,t="(@(?:arg|argument|param|property)\\s+(?:"+n+"\\s+)?)";e.languages.jsdoc=e.languages.extend("javadoclike",{parameter:{pattern:RegExp(t+/(?:(?!\s)[$\w\xA0-\uFFFF.])+(?=\s|$)/.source),lookbehind:!0,inside:{punctuation:/\./}}}),e.languages.insertBefore("jsdoc","keyword",{"optional-parameter":{pattern:RegExp(t+/\[(?:(?!\s)[$\w\xA0-\uFFFF.])+(?:=[^[\]]+)?\](?=\s|$)/.source),lookbehind:!0,inside:{parameter:{pattern:/(^\[)[$\w\xA0-\uFFFF\.]+/,lookbehind:!0,inside:{punctuation:/\./}},code:{pattern:/(=)[\s\S]*(?=\]$)/,lookbehind:!0,inside:a,alias:"language-javascript"},punctuation:/[=[\]]/}},"class-name":[{pattern:RegExp(/(@(?:augments|class|extends|interface|memberof!?|template|this|typedef)\s+(?:<TYPE>\s+)?)[A-Z]\w*(?:\.[A-Z]\w*)*/.source.replace(/<TYPE>/g,(function(){return n}))),lookbehind:!0,inside:{punctuation:/\./}},{pattern:RegExp("(@[a-z]+\\s+)"+n),lookbehind:!0,inside:{string:a.string,number:a.number,boolean:a.boolean,keyword:e.languages.typescript.keyword,operator:/=>|\.\.\.|[&|?:*]/,punctuation:/[.,;=<>{}()[\]]/}}],example:{pattern:/(@example\s+(?!\s))(?:[^@\s]|\s+(?!\s))+?(?=\s*(?:\*\s*)?(?:@\w|\*\/))/,lookbehind:!0,inside:{code:{pattern:/^([\t ]*(?:\*\s*)?)\S.*$/m,lookbehind:!0,inside:a,alias:"language-javascript"}}}}),e.languages.javadoclike.addSupport("javascript",e.languages.jsdoc)}(e)}e.exports=r,r.displayName="jsdoc",r.aliases=[]}}]);
//# sourceMappingURL=react-syntax-highlighter_languages_refractor_jsdoc.8fabbd2b.chunk.js.map