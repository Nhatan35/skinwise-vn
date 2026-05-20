export class AIProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIProviderError";
  }
}

export class AIProviderConfigurationError extends AIProviderError {
  constructor(message: string) {
    super(message);
    this.name = "AIProviderConfigurationError";
  }
}

export class AIProviderResponseError extends AIProviderError {
  constructor(message: string) {
    super(message);
    this.name = "AIProviderResponseError";
  }
}
