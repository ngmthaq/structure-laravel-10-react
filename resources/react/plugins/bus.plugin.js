import { createContext, useContext } from "react";

export class EventBus {
  constructor() {
    this.events = {};
  }

  on(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName].push(callback);
    } else {
      this.events[eventName] = [callback];
    }
  }

  once(eventName, callback) {
    const handler = (...params) => {
      callback(...params);
      this.off(eventName, handler);
    };

    this.on(eventName, handler);
  }

  emit(eventName, ...params) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => callback(...params));
    }
  }

  off(eventName, callback) {
    if (this.events[eventName]) {
      if (this.events[eventName].length) {
        this.events[eventName] = this.events[eventName].filter((cb) => cb !== callback);
      } else {
        delete this.events[eventName];
      }
    }
  }
}

export const eventBus = new EventBus();

export const EvenBusContext = createContext(eventBus);

export const useEventBus = () => {
  return useContext(EvenBusContext);
};
