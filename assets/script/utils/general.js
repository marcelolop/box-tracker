//utility functions

function onEvent(event, selector, callback) {
  if (!event || !selector || !callback) {
    throw new Error("Missing required arguments");
  }
  return selector.addEventListener(event, callback);
}

function getElement(selector, parent = document) {
  if (!selector) {
    throw new Error("Missing required argument");
  }
  return parent.getElementById(selector);
}

function select(selector, parent = document) {
  if (!selector) {
    throw new Error("Missing required argument");
  }
  return parent.querySelector(selector);
}

function selectAll(selector, parent = document) {
  if (!selector) {
    throw new Error("Missing required argument");
  }
  return [...parent.querySelectorAll(selector)];
}

function print(arg) {
  console.log(arg);
}

function sleep(duration) {
  if (!duration) {
    throw new Error("Missing required argument");
  }
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

function randomNumber(min, max) {
  if (!min || !max) {
    throw new Error("Missing required arguments");
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function filterArray(array, callback) {
  if (!array || !callback) {
    throw new Error("Missing required arguments");
  }
  return array.filter(callback);
}

function create(element, parent = document) {
  if (!element) {
    throw new Error("Missing required argument");
  }
  return parent.createElement(element);
}

export {
  onEvent,
  getElement,
  select,
  selectAll,
  print,
  sleep,
  randomNumber,
  filterArray,
  create,
};
