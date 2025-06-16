type Constructor<T = Record<string, unknown>> = new (...args: unknown[]) => T;
type Factory<T> = () => T;

export class Container {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private services = new Map<string | Constructor<unknown>, Constructor<unknown> | Factory<unknown>>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private singletons = new Map<string | Constructor<unknown>, unknown>();

  register<T>(token: string | Constructor<T>, implementation: Constructor<T> | Factory<T>): void {
    this.services.set(token, implementation);
  }

  registerSingleton<T>(
    token: string | Constructor<T>,
    implementation: Constructor<T> | Factory<T>,
  ): void {
    this.services.set(token, implementation);
    this.singletons.set(token, null); // Mark as singleton
  }

  resolve<T>(token: string | Constructor<T>): T {
    // Check if it's a singleton and already instantiated
    if (this.singletons.has(token)) {
      const existing = this.singletons.get(token);
      if (existing) return existing as T;
    }

    const implementation = this.services.get(token);
    if (!implementation) {
      throw new Error(`Service ${token.toString()} not found`);
    }

    let instance: T;
    if (typeof implementation === "function") {
      if (implementation.prototype) {
        // It's a constructor
        instance = new (implementation as Constructor<T>)();
      } else {
        // It's a factory function
        instance = (implementation as Factory<T>)();
      }
    } else {
      instance = implementation as T;
    }

    // Store singleton instance
    if (this.singletons.has(token)) {
      this.singletons.set(token, instance);
    }

    return instance;
  }
}

// Global container instance
export const container = new Container();
