import { useEffect } from "react";

const MANAGED_HEAD_SELECTOR = '[data-imgoraa-managed-head="true"]';

function removeManagedHeadElements() {
  document.head.querySelectorAll(MANAGED_HEAD_SELECTOR).forEach((element) => {
    element.remove();
  });
}

function cloneNodeForHead(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return document.createTextNode(node.textContent || "");
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const sourceElement = node;
  const nextElement = document.createElement(sourceElement.tagName.toLowerCase());

  Array.from(sourceElement.attributes).forEach((attribute) => {
    nextElement.setAttribute(attribute.name, attribute.value);
  });

  if (sourceElement.tagName.toLowerCase() === "script") {
    nextElement.text = sourceElement.textContent || "";
  } else {
    nextElement.innerHTML = sourceElement.innerHTML;
  }

  nextElement.setAttribute("data-imgoraa-managed-head", "true");
  return nextElement;
}

function appendManagedHeadCode(code) {
  if (!code.trim()) {
    return;
  }

  const template = document.createElement("template");
  template.innerHTML = code;

  Array.from(template.content.childNodes).forEach((node) => {
    const nextNode = cloneNodeForHead(node);

    if (nextNode) {
      document.head.appendChild(nextNode);
    }
  });
}

export default function useInjectHeadCode(code) {
  useEffect(() => {
    removeManagedHeadElements();
    appendManagedHeadCode(code || "");

    return () => {
      removeManagedHeadElements();
    };
  }, [code]);
}
