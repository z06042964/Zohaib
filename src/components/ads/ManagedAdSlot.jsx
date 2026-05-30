import { useEffect, useRef } from "react";

function appendNodeToTarget(target, node) {
  if (node.nodeType === Node.TEXT_NODE) {
    if (node.textContent?.trim()) {
      target.appendChild(document.createTextNode(node.textContent));
    }
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return;
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

  target.appendChild(nextElement);
}

export default function ManagedAdSlot({ code, className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    container.innerHTML = "";

    if (!code?.trim()) {
      return undefined;
    }

    const template = document.createElement("template");
    template.innerHTML = code;

    Array.from(template.content.childNodes).forEach((node) => {
      appendNodeToTarget(container, node);
    });

    return () => {
      container.innerHTML = "";
    };
  }, [code]);

  if (!code?.trim()) {
    return null;
  }

  return <div ref={containerRef} className={className} />;
}
