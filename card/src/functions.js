//import * as C from './constants.js';
//import {EscImages} from './escImages.js';
let DEBUG = false;
export function setDebug(flag) { DEBUG = flag; }

export function getTextSize(text, font = 'Arial', fontHeight=16, fontWeight='') {
  // Create a temporary canvas element
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // Set the fontstyle
  context.font = `${fontWeight} ${fontHeight}px ${font}`;

  // Measure and return the width of the text
  let data = context.measureText(text);
  let width = Math.ceil(data.width);
  let height =  Math.ceil(data.fontBoundingBoxAscent + data.fontBoundingBoxDescent);
  return {width,height,text,data};

}
export function console_log(...args){

  if (!DEBUG) return;

  const stackLine = new Error().stack.split('\n')[2].trim();

  let caller = '?', line = '?';

  // Named: "at [new] ClassName.method (file.js:10:5)"
  const namedMatch = stackLine.match(/^at (?:new )?([^\s(]+)\s+\(.*:(\d+):\d+\)?$/);
  // Anonymous: "at http://...file.js:10:5"
  const anonMatch = stackLine.match(/^at .*:(\d+):\d+\)?$/);

  if (namedMatch) {
    caller = namedMatch[1];
    line = namedMatch[2];
  } else if (anonMatch) {
    caller = '<anonymous>';
    line = anonMatch[1];
  }
  console.log(formatDate("HH:mm:ss.SSS"),`[${caller}:${line}]`,...args);
}
function formatDate(format) {
  const now = new Date();
  const pad = (num, length) => num.toString().padStart(length, '0');

  return format.replace(/YYYY/g, now.getFullYear())
               .replace(/MM/g, pad(now.getMonth() + 1, 2))
               .replace(/DD/g, pad(now.getDate(), 2))
               .replace(/HH/g, pad(now.getHours(), 2))
               .replace(/mm/g, pad(now.getMinutes(), 2))
               .replace(/ss/g, pad(now.getSeconds(), 2))
               .replace(/SSS/g, pad(now.getMilliseconds(), 3));
}
export function defImagePathOrColor(image_map,image)
{
  let result;
  if (!image) return '';

  if (!image.includes('.')){
    // is Color
    result=image;
  }else{
    // is URL
    result =(image.includes('/') ? image : `${image_map}/${image}`);
  }
  return result;
}
export function isUrl(fileName){
  // Check if the file is a URL (starts with http:// or https://)
  return fileName.includes('.');
}
export function findElements(base, selector) {
  const results = [];

  recursiveSearch(base);

  return results;

  function recursiveSearch(node) {
    if (!node) return;

    // 1. Search in the regular DOM of this node
    if (node.querySelectorAll) {
      const matches = node.querySelectorAll(selector);
      for (const el of matches) {
        if (!results.includes(el)) {
          results.push(el);
        }
      }
    }

    // 2. If this node has a shadow root, search inside it
    if (node.shadowRoot) {
      const shadowMatches = node.shadowRoot.querySelectorAll(selector);
      for (const el of shadowMatches) {
        if (!results.includes(el)) {
          results.push(el);
        }
      }

      // Recurse into shadow root children
      for (const child of node.shadowRoot.children) {
        recursiveSearch(child);
      }
    }

    // 3. Recurse into regular children
    if (node.children) {
      for (const child of node.children) {
        recursiveSearch(child);
      }
    }
  }
}




export function displayNodePathToTopIncludingShadowAndClass(node) {
  let currentNode = node;
  const path = [];

  while (currentNode) {
    // If the node has a shadow root, include it in the path
    if (currentNode.host) {
        path.push(`#shadow-root`); // Include shadow root with its mode (open or closed)
        path.push(`${currentNode.host.nodeName}`); // Include shadow root with its mode (open or closed)
    }else{

      // Add the current node's tag name and class name (if any)
      let nodeDescription = currentNode.nodeName;

      // If the node has a className, add it to the description
      if (currentNode.className) {
          nodeDescription += `.${currentNode.className}`;
      }

      // Optionally, you can also add the ID, if you want
      if (currentNode.id) {
          nodeDescription += `#${currentNode.id}`;
      }

      path.push(nodeDescription);  // Add the node description to the path
    }
    // If we're inside a shadow DOM, go up to the shadow host
    //if (currentNode.shadowRoot) {
    if (currentNode.host) {
        currentNode = currentNode.host.parentNode  // Move to the shadow host
    } else {
        currentNode = currentNode.parentNode;  // Move to the regular parent node
    }
  }
}
export function findParentNode(node, selector) {
  // Check if the node matches the selector itself
  if (node.matches(selector)) {
      return node;
  }
  let currentNode = node;

  while (currentNode && !currentNode.matches(selector)) {
    // If the node has a shadow root, include it in the path
    if (currentNode.host) {
        currentNode = currentNode.host.parentNode  // Move to the shadow host
    } else {
        currentNode = currentNode.parentNode;  // Move to the regular parent node
    }
  }
  return currentNode;

}
export function isRunningLocally() {
  const hostname = window.location.hostname;
  const localPatterns = [
    /^localhost$/,
    /^127\.0\.0\.1$/,
    /^homeassistant\.local$/,
    /\.local$/,
    /^10\./,
    /^192\.168\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
  ];
  return localPatterns.some(pattern => pattern.test(hostname));
}
export function resizeDebugger(entries) {
    entries.forEach((entry, i) => {
      const reasons = [];

      const { width, height } = entry.contentRect;
      const target = entry.target;
      // Check if target dimensions actually changed vs last observation
      const prevSize = target._prevResizeSize;

      if (!prevSize) {
        reasons.push('🆕 first observation — no previous size to compare');
      } else if (prevSize.width === width && prevSize.height === height) {
        reasons.push('⚠️ fired but NO SIZE CHANGE — possibly reflow/style recalc triggered this');
      } else {
        if (prevSize.width !== width)  reasons.push(`↔️ width changed: ${prevSize.width}px → ${width}px`);
        if (prevSize.height !== height) reasons.push(`↕️ height changed: ${prevSize.height}px → ${height}px`);
      }

      // Check borderBoxSize if available
      if (entry.borderBoxSize?.length) {
        reasons.push(`📦 borderBox: ${entry.borderBoxSize[0].inlineSize} × ${entry.borderBoxSize[0].blockSize}`);
      }

      // Check contentRect change
      reasons.push(`📐 contentRect: ${width} × ${height}`);


      console.group(`🔁 ResizeObserver fired — entry ${i}`);
      console.log('target:', target);
      console.log('reasons:', reasons);
      console.log('target_prev:', target._prevResizeSize);
      console.trace();
      console.groupEnd();

      target._prevResizeSize = { width, height };
    });
  }
