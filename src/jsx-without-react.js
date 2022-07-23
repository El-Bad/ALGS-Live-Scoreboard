/*////////////////////////////////////////////////////////////////////////////
JSX without react from
https://betterprogramming.pub/how-to-use-jsx-without-react-21d23346e5dc

# Install babel
npm install @babel/cli @babel/core @babel/plugin-transform-react-jsx

# add lines to package.json that are in this proj

# add these functions to app.js or index.js
////////////////////////////////////////////////////////////////////////////*/

/** @jsx createElement */
/*** @jsxFrag createFragment */
const createElement = (tag, props, ...children) => {
  if (typeof tag === "function") return tag(props, ...children);
  const element = document.createElement(tag);

  Object.entries(props || {}).forEach(([name, value]) => {
    if (name.startsWith("on") && name.toLowerCase() in window)
      element.addEventListener(name.toLowerCase().substr(2), value);
    else element.setAttribute(name, value.toString());
  });

  children.forEach((child) => {
    appendChild(element, child);
  });

  return element;
};

const appendChild = (parent, child) => {
  if (Array.isArray(child))
    child.forEach((nestedChild) => appendChild(parent, nestedChild));
  else
    parent.appendChild(child.nodeType ? child : document.createTextNode(child));
};

const createFragment = (props, ...children) => {
  return children;
};

export { createElement, appendChild, createFragment };
