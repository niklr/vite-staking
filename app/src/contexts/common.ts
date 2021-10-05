export class CommonContext {
  dispose(): void {
    console.log("Disposing CommonContext");
  }
}

const context = new CommonContext();

export const getCommonContext = () => {
  return context;
}